/**
 * The one error UX (integration pass §3.4). API errors look like
 * { error: { code, message, details: { fields? } } }. Field errors go inline;
 * every known code gets the friendly message from the shared table
 * (contracts/errors.json, the same table the web app uses).
 */
import { ERROR_MESSAGES } from './contract/errors';

export type ErrorView = {
  /** One sentence for the form or screen. */
  message: string;
  /** Inline messages by field name (validation errors). */
  fields: Record<string, string>;
  code: string | null;
  /** True when the API could not be reached: show the offline state, not an error. */
  offline: boolean;
  details: Record<string, unknown>;
};

const NETWORK = new Set(['NETWORK_ERROR', 'CONFIG_MISSING', 'TIMEOUT']);
const FALLBACK = 'Something went wrong. Please try again.';
const OFFLINE = 'We could not reach Sydecrew. Check your connection and try again.';

type Like = { code?: unknown; message?: unknown; details?: unknown; status?: unknown };

export function errorView(err: unknown): ErrorView {
  const e = (err && typeof err === 'object' ? err : {}) as Like;
  const code = typeof e.code === 'string' ? e.code : null;
  const details = (e.details && typeof e.details === 'object' ? e.details : {}) as Record<string, unknown>;
  const fields = (details.fields && typeof details.fields === 'object' ? details.fields : {}) as Record<string, string>;
  if (code && NETWORK.has(code)) return { message: OFFLINE, fields: {}, code, offline: true, details };
  const apiMessage = typeof e.message === 'string' && e.message ? e.message : null;
  // Field-level validation keeps the API's message (it names the field); everything else uses the shared table.
  const message = (code && code !== 'VALIDATION_FAILED' && ERROR_MESSAGES[code]) || apiMessage || (code && ERROR_MESSAGES[code]) || FALLBACK;
  return { message, fields, code, offline: false, details };
}

/** Friendly text for a code, for places that only have the code. */
export const messageFor = (code: string) => ERROR_MESSAGES[code] ?? FALLBACK;
