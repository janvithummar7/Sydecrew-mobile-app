/**
 * Analytics seam. Deliberately a no-op: no analytics SDK is installed and no
 * event leaves the device. Call sites can use it now; wire a provider later
 * (after a privacy review) without touching screens.
 */
export function track(_event: string, _props?: Record<string, string | number | boolean | null>): void {
  // no-op
}
