/**
 * PII scrubber for crash reports (Feature 7). Sentry runs `scrubEvent` in
 * `beforeSend` and `scrubBreadcrumb` in `beforeBreadcrumb` (src/lib/sentry.ts),
 * so nothing below leaves the phone:
 *  - phones, emails, names, passwords / tokens / authorization / cookies / OTPs
 *  - ID document fields (Aadhaar, PAN, passport, document numbers)
 *  - bank account numbers, IFSC, UPI ids
 *  - message text: body / text / message / statement / description / note (and reason, content, caption)
 *  - location: lat / lng / coordinates / address
 * Keys are matched by name at any depth (in event extras, contexts, request
 * data, breadcrumb data). Every remaining string is pattern-scrubbed (emails,
 * phone and account numbers, bearer tokens, JWTs, PAN, coordinates), and URL
 * query values for sensitive keys are dropped.
 * Pure (no Sentry import), unit-tested in test/feature7.test.ts.
 */

export const FILTERED = '[Filtered]';

type Obj = Record<string, unknown>;

const norm = (k: string) => k.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[-\s.]/g, '_').toLowerCase();

/** Exact key names (after normalising camelCase / dashes to snake_case). */
const EXACT = new Set([
  // contact and names
  'phone', 'phone_number', 'mobile', 'mobile_number', 'msisdn', 'email', 'email_address', 'destination',
  'name', 'full_name', 'first_name', 'last_name', 'middle_name', 'display_name', 'legal_name', 'username', 'user_name',
  'holder_name', 'account_holder', 'account_holder_name', 'beneficiary_name', 'contact_name', 'emergency_contact',
  // credentials
  'authorization', 'cookie', 'cookies', 'set_cookie', 'otp', 'otp_code', 'pin', 'cvv',
  // ID documents
  'aadhaar', 'aadhaar_number', 'aadhar', 'pan', 'pan_number', 'passport', 'passport_number', 'dob', 'date_of_birth',
  'document_number', 'id_number', 'doc_number', 'dl_number', 'voter_id', 'document_front', 'document_back', 'selfie',
  // bank
  'account_number', 'account_no', 'bank_account', 'bank_account_number', 'ifsc', 'ifsc_code', 'upi', 'upi_id', 'vpa', 'utr',
  // message text
  'body', 'text', 'message', 'messages', 'statement', 'description', 'note', 'notes', 'reason', 'content', 'caption', 'comment',
  // location
  'lat', 'lng', 'lon', 'long', 'latitude', 'longitude', 'coords', 'coordinates', 'location', 'address', 'geo', 'accuracy',
  'ip', 'ip_address',
  // touch breadcrumbs: accessibility labels can name people ("Message Priya")
  'label', 'title',
]);
/** Substrings that make any key sensitive (password, new_password, refresh_token, x_api_key, client_secret...). */
const CONTAINS = /pass(word|wd)|token|secret|api_key|authori[sz]ation|session_id|aadhaar|passport|account_number|_email|email_|_phone|phone_/;

export function isSensitiveKey(key: string): boolean {
  const k = norm(key);
  return EXACT.has(k) || CONTAINS.test(k);
}

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const BEARER = /\b(Bearer|Basic|Token)\s+[A-Za-z0-9._~+/=-]{6,}/gi;
const JWT = /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}/g;
/** 10+ digits, optionally spaced or dashed: phone numbers, Aadhaar, bank accounts. Dates (8 digits) and UUID parts are not touched. */
const LONG_NUMBER = /(?<![\w-])\+?\d(?:[ -]?\d){8,17}(?![\w-])/g;
const PAN = /\b[A-Z]{5}\d{4}[A-Z]\b/g;
const COORDS = /-?\d{1,2}\.\d{3,}\s*,\s*-?\d{1,3}\.\d{3,}/g;
/** ?key=value pairs in URLs and query strings. */
const QUERY_PAIR = /([?&;])([^=&#\s]+)=([^&#\s]*)/g;
const QUERY_KEYS = new Set(['code', 'sig', 'signature', 'key', 'exp', 'expires', 'q', 'query', 'search']);

export function scrubString(s: string): string {
  return s
    .replace(QUERY_PAIR, (m, sep: string, k: string) => (isSensitiveKey(k) || QUERY_KEYS.has(norm(k)) ? `${sep}${k}=${FILTERED}` : m))
    .replace(BEARER, (_m, scheme: string) => `${scheme} ${FILTERED}`)
    .replace(JWT, FILTERED)
    .replace(EMAIL, '[email]')
    .replace(COORDS, '[location]')
    .replace(LONG_NUMBER, '[number]')
    .replace(PAN, '[id]');
}

/** Deep copy with sensitive keys replaced and every string pattern-scrubbed. */
export function scrubValue(value: unknown, depth = 0, seen: WeakSet<object> = new WeakSet()): unknown {
  if (typeof value === 'string') return scrubString(value);
  if (value === null || typeof value !== 'object') return value;
  if (depth > 12 || seen.has(value)) return FILTERED;
  seen.add(value);
  if (Array.isArray(value)) return value.map((v) => scrubValue(v, depth + 1, seen));
  const out: Obj = {};
  for (const [k, v] of Object.entries(value as Obj)) {
    out[k] = isSensitiveKey(k) && v !== null && v !== undefined ? FILTERED : scrubValue(v, depth + 1, seen);
  }
  return out;
}

/** Structural Sentry fields that only hold SDK and build metadata (no user data): left as they are. */
const KEEP = new Set(['sdk', 'debug_meta', 'platform', 'level', 'event_id', 'timestamp', 'start_timestamp', 'release', 'dist', 'environment', 'type', 'fingerprint']);
/** Device/OS/app contexts: their `name` is the OS or app name (keep) except the device name ("Priya's iPhone"). */
const META_CONTEXTS = new Set(['os', 'app', 'runtime', 'culture', 'react_native_context', 'trace', 'expo', 'device']);

/** Sentry `beforeSend`: returns a scrubbed copy of the event. */
export function scrubEvent<T extends object>(event: T): T {
  const e = event as Obj;
  const out: Obj = {};
  for (const [k, v] of Object.entries(e)) {
    if (KEEP.has(k)) out[k] = v;
    else if (k === 'user') out.user = v && typeof v === 'object' && typeof (v as Obj).id === 'string' ? { id: (v as Obj).id } : undefined;
    else if (k === 'message' || k === 'logentry') out[k] = scrubValue(v); // the error message itself: patterns only
    else if (k === 'exception') out[k] = scrubException(v);
    else if (k === 'request') out[k] = scrubRequest(v);
    else if (k === 'contexts') out[k] = scrubContexts(v);
    else if (k === 'breadcrumbs') out[k] = Array.isArray(v) ? v.map((b) => scrubBreadcrumb(b as Obj)) : scrubValue(v);
    else out[k] = scrubValue(v);
  }
  return out as T;
}

/** Sentry `beforeBreadcrumb`: message patterns scrubbed, data keys filtered, URLs cleaned. */
export function scrubBreadcrumb<T extends object>(crumb: T): T {
  const b = crumb as Obj;
  const out: Obj = { ...b };
  // Console breadcrumbs are developer logs and may hold API bodies: only the level is kept.
  if (b.category === 'console') return { ...out, message: FILTERED, data: undefined } as T;
  if (typeof b.message === 'string') out.message = scrubString(b.message);
  if (b.data !== undefined) out.data = scrubValue(b.data);
  return out as T;
}

function scrubException(v: unknown): unknown {
  if (!v || typeof v !== 'object') return v;
  const values = (v as Obj).values;
  if (!Array.isArray(values)) return scrubValue(v);
  return {
    ...(v as Obj),
    values: values.map((x) => {
      if (!x || typeof x !== 'object') return x;
      const ex = x as Obj;
      const frames = (ex.stacktrace as Obj | undefined)?.frames;
      return {
        ...ex,
        ...(typeof ex.value === 'string' ? { value: scrubString(ex.value) } : {}),
        // Frames: file names and functions stay (needed to debug); local variables are dropped.
        ...(Array.isArray(frames) ? { stacktrace: { ...(ex.stacktrace as Obj), frames: frames.map((f) => (f && typeof f === 'object' ? { ...(f as Obj), vars: undefined } : f)) } } : {}),
        ...(ex.mechanism !== undefined ? { mechanism: scrubValue(ex.mechanism) } : {}),
      };
    }),
  };
}

function scrubRequest(v: unknown): unknown {
  if (!v || typeof v !== 'object') return v;
  const r = v as Obj;
  const out: Obj = {};
  for (const [k, x] of Object.entries(r)) {
    if (k === 'cookies' || k === 'data' || k === 'env') out[k] = x === undefined ? undefined : FILTERED; // request bodies never leave the phone
    else if (k === 'url' && typeof x === 'string') out.url = scrubString(x);
    else if (k === 'query_string') out.query_string = typeof x === 'string' ? scrubString(x.startsWith('?') ? x : `?${x}`).replace(/^\?/, '') : scrubValue(x);
    else out[k] = scrubValue(x);
  }
  return out;
}

function scrubContexts(v: unknown): unknown {
  if (!v || typeof v !== 'object') return v;
  const out: Obj = {};
  for (const [name, ctx] of Object.entries(v as Obj)) {
    if (META_CONTEXTS.has(name) && ctx && typeof ctx === 'object') {
      const c: Obj = {};
      for (const [k, x] of Object.entries(ctx as Obj)) {
        if (name === 'device' && (k === 'name' || k === 'device_name')) continue;
        c[k] = typeof x === 'string' ? scrubString(x) : isSensitiveKey(k) && k !== 'name' ? FILTERED : scrubValue(x);
      }
      out[name] = c;
    } else out[name] = scrubValue(ctx);
  }
  return out;
}
