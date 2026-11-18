import { universalLinkPath } from '@/lib/nav/pushLinks';

/**
 * Incoming system URLs, before Expo Router matches them (Feature 7), on cold
 * start (`initial`) and while running.
 *  - https://sydecrew.com/... and https://www.sydecrew.com/... (universal / app
 *    links, see app.json) -> /link?to=<path>; src/app/link.tsx then picks the
 *    screen for the user's shell, exactly as for a push `path`.
 *  - Any other http(s) URL is ignored (null keeps the current screen).
 *  - sydecrew://... custom-scheme links pass through unchanged (src/lib/routing.ts).
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string | null {
  try {
    const own = universalLinkPath(path);
    if (own !== null) return `/link?to=${encodeURIComponent(own)}`;
    if (/^https?:\/\//i.test(path)) return null;
    return path;
  } catch {
    return '/';
  }
}
