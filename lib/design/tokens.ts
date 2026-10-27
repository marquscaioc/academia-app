// Projeto Academia — one type family, neutral surfaces and restrained contrast.
export const font = {
  display: "Geist_600SemiBold",
  displayItalic: "Geist_500Medium",
  regular: "Geist_400Regular",
  medium: "Geist_500Medium",
  semibold: "Geist_600SemiBold",
  bold: "Geist_700Bold",
  black: "Geist_900Black",
} as const;

export const palette = {
  bg: "#F7F7F8", bgDeep: "#F0F0F2",
  surface: "#FFFFFF", surfaceElevated: "#F4F4F5",
  border: "#E4E4E7", hover: "#EFEFF1",
  // Compatibility keys for existing charts and domain components.
  violet300: "#52525B", violet400: "#3F3F46", violet500: "#27272A",
  violet600: "#18181B", violet700: "#18181B",
  fuchsia300: "#52525B", fuchsia400: "#3F3F46", fuchsia500: "#27272A",
  textPrimary: "#202024", textSecondary: "#52525B", textMuted: "#71717A",
  success: "#52525B", warning: "#52525B", danger: "#3F3F46",
} as const;

// Equal stops keep older gradient-based controls visually flat.
export const primaryGradient = ["#27272A", "#27272A"] as const;
export const backgroundWash = ["transparent", "transparent"] as const;
export const surfaceShadow = {
  shadowColor: "#18181B",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
} as const;
