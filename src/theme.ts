/**
 * Theme for the app, derived ONLY from the generated design tokens
 * (src/theme/tokens.ts <- design/tokens.json, shared with Sydecrew-web).
 * No colour, size or radius literals live here or in screens:
 * `npm run lint` fails on raw hex / rgba values outside the token files.
 */
import { colors as tokenColors, fonts, motion, radius as tokenRadius, semantic, shadow, space as tokenSpace, touchTarget, type as tokenType, z } from './theme/tokens';

export const colors = { ...tokenColors, ...semantic } as const;
export { semantic, shadow, motion, z, touchTarget, fonts };

export const radius = tokenRadius;

/** Named spacing on the token scale (4-point grid). */
export const space = {
  xs: tokenSpace['1'],
  sm: tokenSpace['2'],
  md: tokenSpace['3'],
  lg: tokenSpace['4'],
  xl: tokenSpace['6'],
  xxl: tokenSpace['8'],
  xxxl: tokenSpace['12'],
} as const;

/** Font family for a weight: Geist for text, Instrument Serif for the italic display accent. */
export function fontFor(weight?: string, serif = false): string {
  if (serif) return fonts.serif.italic;
  if (weight === '700' || weight === '600' || weight === 'bold') return fonts.sans.semibold;
  if (weight === '500') return fonts.sans.medium;
  return fonts.sans.regular;
}

/** The type scale with the brand fonts applied. */
export const type = Object.fromEntries(
  Object.entries(tokenType).map(([k, t]) => [k, { ...t, fontFamily: fontFor(t.fontWeight) }]),
) as { [K in keyof typeof tokenType]: (typeof tokenType)[K] & { fontFamily: string } };

/** A token colour at an opacity, e.g. alpha(colors.lime400, 0.15) for tinted backgrounds. */
export function alpha(hex: string, opacity: number): string {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
