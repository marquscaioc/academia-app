/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dark athletic luxury palette
        dark: {
          50: "#1A1A1D",
          100: "#151517",
          200: "#111113",
          300: "#0D0D0F",
          400: "#0A0A0B",
          500: "#070708",
        },
        lime: {
          300: "#D4FF2B",
          400: "#CCFF00",
          500: "#BBFF00",
          600: "#99DD00",
          700: "#77AA00",
        },
        electric: {
          400: "#00E5FF",
          500: "#00BCD4",
        },
        surface: {
          card: "#16161A",
          elevated: "#1E1E23",
          border: "#2A2A30",
          hover: "#22222A",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A0A0A8",
          muted: "#6B6B73",
        },
        primary: {
          50: "#F0FFF0",
          100: "#DFFFBF",
          200: "#CCFF80",
          300: "#BBFF00",
          400: "#AAEE00",
          500: "#BBFF00",
          600: "#99DD00",
          700: "#77AA00",
          800: "#558800",
          900: "#336600",
          950: "#1A4400",
        },
        accent: {
          50: "#E0FCFF",
          100: "#BEF8FD",
          200: "#87EAF2",
          300: "#54D1DB",
          400: "#38BEC9",
          500: "#00BCD4",
          600: "#009DAE",
          700: "#007D8A",
          800: "#005E67",
          900: "#004047",
          950: "#002A30",
        },
        success: {
          500: "#22c55e",
          600: "#16a34a",
        },
        warning: {
          500: "#FBBF24",
          600: "#D97706",
        },
        danger: {
          500: "#EF4444",
          600: "#DC2626",
        },
      },
    },
  },
  plugins: [],
};
