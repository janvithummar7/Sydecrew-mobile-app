import { Platform } from 'react-native';
import { getRefreshToken, setRefreshToken } from './tokenStore';
import type { Challenge, Me, OnboardingInput, OnboardingOptions, SessionResponse } from './types';

/**
 * Client for the Sydecrew API.
 *
 * Every request sends `X-Client: mobile`. The API then returns the refresh
 * token in the response body rather than as a cookie. It is stored in
 * SecureStore and sent back in the body to /auth/refresh and /auth/logout.
 * On TOKEN_EXPIRED a request is retried once after a silent refresh.
 */

/** The Android emulator reaches the host machine at 10.0.2.2. Set EXPO_PUBLIC_API_URL for a phone on Wi-Fi. */
const fallbackUrl = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || fallbackUrl).replace(/\/$/, '');

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: { fields?: Record<string, string> } & Record<string, unknown>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorBody['details'];

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }

  get fields(): Record<string, string> {
    return this.details?.fields ?? {};
  }
}

let accessToken: string | null = null;
let refreshing: Promise<SessionResponse | null> | null = null;
let onSessionLost: (() => void) | null = null;

export const setSessionLostHandler = (fn: (() => void) | null) => {
  onSessionLost = fn;
};

type Options = { method?: 'GET' | 'POST'; body?: unknown; noRetry?: boolean };

async function raw<T>(path: string, { method = 'GET', body }: Options): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/v1${path}`, {
      method,
      headers: {
        'x-client': 'mobile',
        accept: 'application/json',
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, {
      code: 'NETWORK_ERROR',
      message: 'We could not reach Sydecrew. Check your connection and try again.',
    });
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const err = (data as { error?: ApiErrorBody } | null)?.error;
    throw new ApiError(res.status, err ?? { code: `HTTP_${res.status}`, message: 'Something went wrong. Please try again.' });
  }
  return data as T;
}

/** Stores a fresh session (from OTP verification or refresh). */
export async function storeSession(session: SessionResponse) {
  accessToken = session.access_token;
  if (session.refresh_token) await setRefreshToken(session.refresh_token);
}

export async function clearSession() {
  accessToken = null;
  await setRefreshToken(null);
}

/** Uses the stored refresh token to get a new session. Concurrent callers share one request. */
export function refreshSession(): Promise<SessionResponse | null> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    const token = await getRefreshToken();
    if (!token) return null;
    try {
      const session = await raw<SessionResponse>('/auth/refresh', { method: 'POST', body: { refresh_token: token } });
      await storeSession(session);
      return session;
    } catch (err) {
      // Only forget the token when the API rejected it, not when offline.
      if (err instanceof ApiError && err.status === 401) await clearSession();
      throw err;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  try {
    return await raw<T>(path, options);
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401 || options.noRetry) throw err;
    if (err.code === 'TOKEN_EXPIRED') {
      const session = await refreshSession().catch(() => null);
      if (session) return raw<T>(path, options);
    }
    if (accessToken) {
      await clearSession();
      onSessionLost?.();
    }
    throw err;
  }
}

export const authApi = {
  register: (body: { full_name: string; email: string; phone: string; password: string }) =>
    api<{ challenge: Challenge }>('/auth/register', { method: 'POST', body }),
  login: (body: { identifier: string; password: string }) =>
    api<{ challenge: Challenge }>('/auth/login', { method: 'POST', body }),
  verifyCode: (body: { otp_id: string; code: string }) =>
    api<SessionResponse>('/auth/otp/verify', { method: 'POST', body }),
  resendCode: (otp_id: string) => api<{ challenge: Challenge }>('/auth/otp/resend', { method: 'POST', body: { otp_id } }),
  me: () => api<{ user: Me }>('/auth/me'),
  logout: async () => {
    const token = await getRefreshToken();
    await raw<void>('/auth/logout', { method: 'POST', body: { refresh_token: token ?? '' } }).catch(() => undefined);
    await clearSession();
  },
  resendEmail: () => api<{ already_verified?: boolean; dev_link?: string }>('/auth/email/resend', { method: 'POST' }),
  forgotPassword: (email: string) =>
    api<{ message: string; dev_link?: string }>('/auth/password/forgot', { method: 'POST', body: { email } }),
  onboardingOptions: () => api<OnboardingOptions>('/onboarding/options'),
  completeOnboarding: (body: OnboardingInput) => api<{ user: Me }>('/onboarding/complete', { method: 'POST', body }),
};
