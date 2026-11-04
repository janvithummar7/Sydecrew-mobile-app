/** Client-side checks that mirror the API's rules, so most mistakes are caught before a round trip. */

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Accepts '98765 43210', '+91 98765-43210', '09876543210'; returns the 10 digits or null. */
export function indianMobile(v: string): string | null {
  let d = v.replace(/[\s\-()]/g, '');
  if (d.startsWith('+91')) d = d.slice(3);
  else if (d.startsWith('91') && d.length === 12) d = d.slice(2);
  else if (d.startsWith('0') && d.length === 11) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 && p.length <= 72 },
  { id: 'letter', label: 'A letter', test: (p: string) => /[A-Za-z]/.test(p) },
  { id: 'number', label: 'A number', test: (p: string) => /\d/.test(p) },
] as const;

export const passwordOk = (p: string) => passwordRules.every((r) => r.test(p));
