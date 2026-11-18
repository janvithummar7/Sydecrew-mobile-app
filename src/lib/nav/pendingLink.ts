/**
 * A universal-link path opened while signed out (Feature 7). Kept in memory
 * only, and opened once after sign-in (src/app/_layout.tsx).
 */
let pending: string | null = null;

export const setPendingLink = (path: string | null) => {
  pending = path;
};

export function takePendingLink(): string | null {
  const p = pending;
  pending = null;
  return p;
}
