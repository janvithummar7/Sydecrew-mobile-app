/**
 * Push deep links (carry-over gap §5.3). Every push from the API carries
 * `data: { type, id, path }`. `pushRoute` maps that path to an in-app route for
 * the viewer's shell, or null when the path is unknown or unsafe (the caller
 * then opens the home screen). Pure: unit-tested in test/feature6.test.ts.
 */
import type { Role } from '../routing';

const ID = '[A-Za-z0-9_-]{1,64}';

type To = ((id: string) => string) | null;
/** [pattern, route for a customer, route for a companion]; null = not for that shell. */
const TABLE: [RegExp, To, To][] = [
  [new RegExp(`^/bookings/(${ID})$`), (id) => `/booking/${id}`, (id) => `/booking/${id}`],
  [new RegExp(`^/messages/(${ID})$`), (id) => `/chat/${id}`, (id) => `/chat/${id}`],
  [new RegExp(`^/earnings/payouts/(${ID})$`), null, (id) => `/companion/payouts/${id}`],
  [/^\/earnings\/account$/, null, () => '/companion/payout-account'],
  [/^\/earnings$/, null, () => '/companion/earnings'],
  [new RegExp(`^/disputes/(${ID})$`), (id) => `/disputes/${id}`, (id) => `/disputes/${id}`],
  [/^\/support$/, () => '/support', () => '/support'],
  [new RegExp(`^/support/(${ID})$`), (id) => `/support/${id}`, (id) => `/support/${id}`],
  [/^\/safety$/, () => '/safety/sos', () => '/safety/sos'],
  [/^\/safety\/contacts$/, () => '/safety/contacts', () => '/safety/contacts'],
  // Membership (entity type user_subscriptions): e.g. a failed renewal payment. Customers only.
  [/^\/membership$/, () => '/membership', null],
  // Warnings, suspensions, bans and appeal decisions (entity type enforcement_actions).
  [/^\/account-status$/, () => '/account-status', () => '/account-status'],
  [/^\/settings$/, () => '/settings', () => '/settings'],
  [/^\/settings\/privacy$/, () => '/settings/privacy', () => '/settings/privacy'],
];

export function pushRoute(path: unknown, role: Role): string | null {
  if (typeof path !== 'string' || path.length > 200) return null;
  // Only plain app paths: one leading slash; no scheme, host, dot segments, query, or encoded characters.
  if (!/^\/[A-Za-z0-9/_-]*$/.test(path) || path.includes('//')) return null;
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path;
  for (const [re, customer, companion] of TABLE) {
    const m = re.exec(clean);
    if (!m) continue;
    const to = role === 'companion' ? companion : customer;
    return to ? to(m[1] ?? '') : null;
  }
  return null;
}

/**
 * Universal / app links (Feature 7): https://sydecrew.com/... and
 * https://www.sydecrew.com/... open the same screens as a push `path`.
 * Returns the URL's path (query and fragment dropped) when the link is ours,
 * or null when it is not (other hosts, http, other schemes, user-info or port
 * tricks): those are ignored. The path is NOT validated here: `linkRoute`
 * passes it through `pushRoute`, so unknown or unsafe paths open home.
 */
export function universalLinkPath(url: unknown): string | null {
  if (typeof url !== 'string' || url.length > 500) return null;
  const m = /^https:\/\/(?:www\.)?sydecrew\.com(?=[/?#]|$)([^?#]*)/i.exec(url);
  if (!m) return null;
  return m[1] || '/';
}

/** The in-app route for a universal link: null = not ours (ignore); otherwise a route, home when unknown. */
export function linkRoute(url: unknown, role: Role, home: string): string | null {
  const path = universalLinkPath(url);
  if (path === null) return null;
  return pushRoute(path, role) ?? home;
}

/** The `path` from a notification's data, if any. */
export function pushPath(data: unknown): unknown {
  return data && typeof data === 'object' ? (data as { path?: unknown }).path : undefined;
}
