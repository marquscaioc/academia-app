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
        // Midnight Ultraviolet palette
        dark: {
          50: "#1C1821",
          100: "#17131C",
          200: "#130F18",
          300: "#0F0B13",
          400: "#0B080F",
          500: "#08060B",
        },
        violet: {
          300: "#C084FC",
          400: "#A855F7",
          500: "#9333EA",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
        },
        fuchsia: {
          300: "#F0ABFC",
          400: "#E879F9",
          500: "#D946EF",
        },
        ice: {
          400: "#67E8F9",
          500: "#22D3EE",
        },
        surface: {
          card: "#15121A",
          elevated: "#1E1A25",
          border: "#2D2737",
          hover: "#231E2D",
        },
        text: {
          primary: "#F5F3FF",
          secondary: "#A8A0B8",
          muted: "#6E6580",
        },
        primary: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7C3AED",
          800: "#6D28D9",
          900: "#5B21B6",
          950: "#3B0764",
        },
        accent: {
          50: "#FDF4FF",
          100: "#FAE8FF",
          200: "#F5D0FE",
          300: "#F0ABFC",
          400: "#E879F9",
          500: "#D946EF",
          600: "#C026D3",
          700: "#A21CAF",
          800: "#86198F",
          900: "#701A75",
          950: "#4A044E",
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
