const neutral = {
  50: "#FAFAFA", 100: "#F4F4F5", 200: "#E4E4E7", 300: "#52525B",
  400: "#3F3F46", 500: "#27272A", 600: "#18181B", 700: "#18181B",
  800: "#18181B", 900: "#18181B", 950: "#18181B",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        display: ["Geist_600SemiBold"], "display-italic": ["Geist_500Medium"],
        serif: ["Geist_600SemiBold"], "serif-italic": ["Geist_500Medium"],
        sans: ["Geist_400Regular"], normal: ["Geist_400Regular"],
        medium: ["Geist_500Medium"], semibold: ["Geist_600SemiBold"],
        bold: ["Geist_700Bold"], black: ["Geist_900Black"],
      },
      borderRadius: { xl: "12px", "2xl": "14px", "3xl": "18px" },
      colors: {
        // Compatibility aliases apply the light theme to every existing route.
        dark: { 50: "#FFFFFF", 100: "#FAFAFA", 200: "#FFFFFF", 300: "#F4F4F5", 400: "#F7F7F8", 500: "#F0F0F2" },
        primary: neutral, accent: neutral, violet: neutral, fuchsia: neutral,
        ice: { 400: "#52525B", 500: "#3F3F46" },
        surface: { card: "#FFFFFF", elevated: "#F4F4F5", border: "#E4E4E7", hover: "#EFEFF1" },
        text: { primary: "#202024", secondary: "#52525B", muted: "#71717A" },
        success: { 500: "#52525B", 600: "#3F3F46" },
        warning: { 500: "#52525B", 600: "#3F3F46" },
        danger: { 500: "#3F3F46", 600: "#27272A" },
        red: neutral, orange: neutral, amber: neutral, yellow: neutral,
        lime: neutral, green: neutral, emerald: neutral, teal: neutral,
        cyan: neutral, sky: neutral, blue: neutral, indigo: neutral,
        purple: neutral, pink: neutral, rose: neutral,
      },
    },
  },
  plugins: [],
};
