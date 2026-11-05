/* GENERATED from design/tokens.json by scripts/tokens.js. Do not edit; run `npm run tokens:gen`. */

export const colors = {
  ink600: "#3a3546",
  ink700: "#262230",
  ink800: "#1a1723",
  ink850: "#13111a",
  ink900: "#0e0c14",
  ink950: "#08070c",
  plum900: "#1a1430",
  plum950: "#110d1f",
  fog50: "#faf9fc",
  fog100: "#f3f1f8",
  fog300: "#c9c4d6",
  fog400: "#aca6ba",
  fog500: "#8d879c",
  lavender100: "#efeaff",
  lavender200: "#ddd4ff",
  lavender300: "#c8baff",
  lavender400: "#b29fff",
  lavender500: "#9a84f5",
  lavender700: "#4c3e8f",
  lavender900: "#221a42",
  lime200: "#f0ffc4",
  lime300: "#e3ff8a",
  lime400: "#d4ff4f",
  lime500: "#b9e636",
  red300: "#fca5a5",
  red400: "#f87171",
  red900: "#3b1219",
  amber300: "#fcd34d",
  amber900: "#3a2a08",
  green300: "#86efac",
  green900: "#0f2e1c",
  white: "#ffffff",
  black: "#000000",
  surface: "rgba(255,255,255,0.04)",
  surfaceStrong: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.12)",
  borderStrong: "rgba(255,255,255,0.25)",
  divider: "rgba(255,255,255,0.06)",
  scrim: "rgba(8,7,12,0.72)"
} as const;

export const semantic = {
  bg: "#08070c",
  bgRaised: "#0e0c14",
  bgCard: "#13111a",
  text: "#f3f1f8",
  textStrong: "#faf9fc",
  textMuted: "#aca6ba",
  textSubtle: "#8d879c",
  accent: "#d4ff4f",
  onAccent: "#08070c",
  brand: "#c8baff",
  onBrand: "#08070c",
  focus: "#c8baff",
  danger: "#f87171",
  dangerText: "#fca5a5",
  dangerBg: "#3b1219",
  warningText: "#fcd34d",
  warningBg: "#3a2a08",
  successText: "#86efac",
  successBg: "#0f2e1c"
} as const;

export const fonts = {
  sans: {
    regular: "Geist_400Regular",
    medium: "Geist_500Medium",
    semibold: "Geist_600SemiBold"
  },
  serif: {
    regular: "InstrumentSerif_400Regular",
    italic: "InstrumentSerif_400Regular_Italic"
  }
} as const;

export const type = {
  display: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "600",
    letterSpacing: -1
  },
  title: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "600",
    letterSpacing: -0.5
  },
  heading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    letterSpacing: 0
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "400",
    letterSpacing: 0
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
    letterSpacing: 0
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase"
  }
} as const;

export const space = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
  "10": 40,
  "12": 48,
  "16": 64
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999
} as const;

export const shadow = {
  card: {
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 12
    },
    elevation: 6
  },
  pop: {
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 32,
    shadowOffset: {
      width: 0,
      height: 24
    },
    elevation: 12
  }
} as const;

export const z = {
  base: 0,
  sticky: 10,
  header: 40,
  overlay: 60,
  modal: 70,
  toast: 80
} as const;

export const motion = {
  duration: {
    fast: 200,
    base: 450,
    slow: 900
  },
  easing: {
    outExpo: [
      0.16,
      1,
      0.3,
      1
    ],
    outQuart: [
      0.25,
      1,
      0.5,
      1
    ],
    inOutQuart: [
      0.76,
      0,
      0.24,
      1
    ]
  }
} as const;

export const touchTarget = 44 as const;

export const tokensVersion = 1;
