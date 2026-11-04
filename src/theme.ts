/**
 * Sydecrew design tokens, matching the website (Sydecrew-web/src/app/globals.css):
 * near-black ink, lavender, lime and fog white. Dark UI only.
 */
export const colors = {
  ink950: '#08070c',
  ink900: '#0e0c14',
  ink800: '#1a1723',
  ink700: '#262230',
  plum950: '#110d1f',

  fog50: '#faf9fc',
  fog100: '#f3f1f8',
  fog300: '#c9c4d6',
  fog400: '#aca6ba',
  fog500: '#8d879c',

  lavender300: '#c8baff',
  lavender400: '#b29fff',

  lime300: '#e3ff8a',
  lime400: '#d4ff4f',

  red300: '#fca5a5',
  red400: '#f87171',

  /** Translucent white layers used for fields and cards. */
  surface: 'rgba(255,255,255,0.04)',
  surfaceStrong: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.12)',
  borderStrong: 'rgba(255,255,255,0.25)',
  divider: 'rgba(255,255,255,0.06)',
} as const;

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const type = {
  display: { fontSize: 34, lineHeight: 38, fontWeight: '600', letterSpacing: -1 },
  title: { fontSize: 26, lineHeight: 31, fontWeight: '600', letterSpacing: -0.5 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 23 },
  small: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 13, lineHeight: 18 },
  eyebrow: { fontSize: 12, lineHeight: 14, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
} as const;
