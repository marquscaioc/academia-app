// Editorial Amethyst — shared design tokens.
// Use `font.*` for inline `style={{ fontFamily }}`; className font utilities
// (font-display, font-bold, etc.) map to the same families via tailwind.config.

export const font = {
  /** Instrument Serif — editorial headings + hero numerals. Use large. */
  display: "InstrumentSerif_400Regular",
  displayItalic: "InstrumentSerif_400Regular_Italic",
  /** DM Sans — body / UI. */
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semibold: "DMSans_600SemiBold",
  bold: "DMSans_700Bold",
  black: "DMSans_900Black",
} as const;

// Royal Amethyst palette (kept). Mirrors tailwind.config for inline use
// (gradients, shadows, SVG, chart libs that need raw hex).
export const palette = {
  bg: "#0B0811",
  bgDeep: "#07050C",
  surface: "#16121E",
  surfaceElevated: "#201B2A",
  border: "#2E2740",
  hover: "#261F33",

  violet300: "#C78FEF",
  violet400: "#9B40D8",
  violet500: "#781BB6",
  violet600: "#641599",
  violet700: "#50107D",

  fuchsia300: "#F0ABFC",
  fuchsia400: "#E06BF5",
  fuchsia500: "#C636E0",

  textPrimary: "#F2EEF8",
  textSecondary: "#A99FBA",
  textMuted: "#6E6382",

  success: "#34D399",
  warning: "#FBBF24",
  danger: "#FB7185",
} as const;

/** Signature amethyst gradient (buttons, accents). */
export const amethystGradient = ["#781BB6", "#C636E0"] as const;
/** Soft atmospheric glow for backgrounds (top-down wash). */
export const glowWash = ["rgba(120,27,182,0.22)", "transparent"] as const;

/**
 * Amethyst drop-glow for elevated/active surfaces. Works on web + iOS.
 * (Android elevation ignores shadowColor pre-API 28 — acceptable.)
 */
export const amethystGlow = {
  shadowColor: "#9B40D8",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 24,
  elevation: 12,
} as const;
