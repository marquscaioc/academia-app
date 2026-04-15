/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Editorial display — italic-friendly serif for magazine-style headers
        serif: ["InstrumentSerif_400Regular"],
        "serif-italic": ["InstrumentSerif_400Regular_Italic"],
        // Brutalist numerals — massive stats, counts, reps
        display: ["ArchivoBlack_400Regular"],
        // Body — refined UI text
        sans: ["DMSans_400Regular"],
        medium: ["DMSans_500Medium"],
        semibold: ["DMSans_600SemiBold"],
        bold: ["DMSans_700Bold"],
      },
      colors: {
        // Royal Amethyst — primary #781BB6
        dark: {
          50: "#1E1826",
          100: "#191420",
          200: "#14101B",
          300: "#100C16",
          400: "#0B0811",
          500: "#07050C",
        },
        violet: {
          300: "#C78FEF",
          400: "#9B40D8",
          500: "#781BB6",
          600: "#641599",
          700: "#50107D",
          800: "#3D0C61",
        },
        fuchsia: {
          300: "#F0ABFC",
          400: "#E06BF5",
          500: "#C636E0",
        },
        ice: {
          400: "#67E8F9",
          500: "#22D3EE",
        },
        surface: {
          card: "#16121E",
          elevated: "#201B2A",
          border: "#2E2740",
          hover: "#261F33",
        },
        text: {
          primary: "#F2EEF8",
          secondary: "#A99FBA",
          muted: "#6E6382",
        },
        primary: {
          50: "#FAF5FF",
          100: "#F2E6FF",
          200: "#E2CAFF",
          300: "#C78FEF",
          400: "#9B40D8",
          500: "#781BB6",
          600: "#641599",
          700: "#50107D",
          800: "#3D0C61",
          900: "#2A0845",
          950: "#17042A",
        },
        accent: {
          50: "#FEF4FF",
          100: "#FCE7FF",
          200: "#F8CEFF",
          300: "#F0ABFC",
          400: "#E06BF5",
          500: "#C636E0",
          600: "#A41DBF",
          700: "#86169E",
          800: "#6E1381",
          900: "#5A1069",
          950: "#3B0449",
        },
        success: {
          500: "#34D399",
          600: "#10B981",
        },
        warning: {
          500: "#FBBF24",
          600: "#D97706",
        },
        danger: {
          500: "#FB7185",
          600: "#F43F5E",
        },
      },
    },
  },
  plugins: [],
};
