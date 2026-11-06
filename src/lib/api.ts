import { Platform } from 'react-native';
import { deviceHeaders } from './device';
import { getRefreshToken, setRefreshToken } from './tokenStore';
import type { Challenge, LoginResponse, Me, OnboardingInput, OnboardingOptions, SessionResponse } from './types';

/**
 * Client for the Sydecrew API.
 *
 * Every request sends `X-Client: mobile`. The API then returns the refresh
 * token in the response body rather than as a cookie. It is stored in
 * SecureStore and sent back in the body to /auth/refresh and /auth/logout.
 * On TOKEN_EXPIRED a request is retried once after a silent refresh.
 */

/**
 * In development the Android emulator reaches the host at 10.0.2.2. Release
 * builds have NO fallback: EXPO_PUBLIC_API_URL must be set (eas.json), or every
 * request fails with CONFIG_MISSING instead of silently calling a dev machine.
 */
const devFallback = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? devFallback : '')).replace(/\/$/, '');

// Development: on Android "localhost" is the phone itself, not your computer.
if (__DEV__ && Platform.OS === 'android' && /localhost|127\.0\.0\.1/.test(API_URL)) {
  console.warn(
    "EXPO_PUBLIC_API_URL points at localhost, which Android cannot reach. Use http://10.0.2.2:4000 (emulator) or your computer's LAN IP, and set the API's PUBLIC_API_URL to the same address.",
  );
}

/** Requests that take longer than this fail as NETWORK_ERROR (Android's default is no timeout at all). */
const TIMEOUT_MS = 15_000;

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

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
/** `headers`: extra request headers, e.g. Idempotency-Key for POST /bookings. */
type Options = { method?: Method; body?: unknown; noRetry?: boolean; headers?: Record<string, string> };

async function raw<T>(path: string, { method = 'GET', body, headers: extra }: Options): Promise<T> {
  if (!API_URL) throw new ApiError(0, { code: 'CONFIG_MISSING', message: 'This build is not configured. Please update the app.' });
  let res: Response;
  const device = await deviceHeaders().catch(() => ({}) as Record<string, string>);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    res = await fetch(`${API_URL}/api/v1${path}`, {
      signal: controller.signal,
      method,
      headers: {
        'x-client': 'mobile',
        accept: 'application/json',
        // X-Device-Id / X-Platform: duplicate-device checks during companion verification.
        ...device,
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
        ...(extra ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, {
      code: 'NETWORK_ERROR',
      message: 'We could not reach Sydecrew. Check your connection and try again.',
    });
  } finally {
    clearTimeout(timer);
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

/** Bumped on every sign-out, so a refresh that finishes afterwards cannot store its token. */
let generation = 0;

export async function clearSession() {
  generation += 1;
  accessToken = null;
  await setRefreshToken(null);
}

/** Uses the stored refresh token to get a new session. Concurrent callers share one request. */
export function refreshSession(): Promise<SessionResponse | null> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    const token = await getRefreshToken();
    if (!token) return null;
    const startedIn = generation;
    try {
      const session = await raw<SessionResponse>('/auth/refresh', { method: 'POST', body: { refresh_token: token } });
      if (startedIn !== generation) return null; // signed out meanwhile: drop it
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
    const hadSession = accessToken !== null || err.code === 'TOKEN_EXPIRED';
    if (err.code === 'TOKEN_EXPIRED') {
      // Temporary refresh failures (offline, 429, 5xx) are rethrown and keep the session.
      const session = await refreshSession();
      if (session) return raw<T>(path, options);
    }
    if (hadSession) {
      await clearSession();
      onSessionLost?.();
    }
    throw err;
  }
}

export const authApi = {
  register: (body: { full_name: string; email: string; phone: string; password: string }) =>
    api<{ challenge: Challenge }>('/auth/register', { method: 'POST', body }),
  /** Staff with two-step sign-in get `mfa_required` instead of a code: they sign in on the web admin. */
  login: (body: { identifier: string; password: string }) => api<LoginResponse>('/auth/login', { method: 'POST', body }),
  verifyCode: (body: { otp_id: string; code: string }) =>
    api<SessionResponse>('/auth/otp/verify', { method: 'POST', body }),
  resendCode: (otp_id: string) => api<{ challenge: Challenge }>('/auth/otp/resend', { method: 'POST', body: { otp_id } }),
  me: () => api<{ user: Me }>('/auth/me'),
  logout: async () => {
    await refreshing?.catch(() => undefined); // let an in-flight refresh settle first
    const token = await getRefreshToken();
    await raw<void>('/auth/logout', { method: 'POST', body: { refresh_token: token ?? '' } }).catch(() => undefined);
    await clearSession();
  },
  resendEmail: () => api<{ already_verified?: boolean; dev_link?: string }>('/auth/email/resend', { method: 'POST' }),
  forgotPassword: (email: string) =>
    api<{ message: string; dev_link?: string }>('/auth/password/forgot', { method: 'POST', body: { email } }),
  onboardingOptions: () => api<OnboardingOptions>('/onboarding/options'),
  completeOnboarding: (body: OnboardingInput) => api<{ user: Me }>('/onboarding/complete', { method: 'POST', body }),
  /** Email links (sydecrew://verify-email?token=…, sydecrew://reset-password?token=…). Work signed in or out. */
  verifyEmail: (token: string) => raw<{ verified: true }>('/auth/email/verify', { method: 'POST', body: { token } }),
  resetPassword: (token: string, password: string) => raw<{ reset: true }>('/auth/password/reset', { method: 'POST', body: { token, password } }),
};
