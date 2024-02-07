/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/app/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      primary: "Orbitron",
      secondary: "sans-serif",
      tertiary: "Aldrich",
    },
    container: {
      padding: {
        DEFAULT: "15px",
      },
    },
    extend: {
      maxWidth: {
        "3xl": "64rem",
      },
      fontFamily: {
        mono: ["var(--font-roboto-mono)"],
      },
    },
    backgroundImage: {
      site: "url('/assets/site-bg.jpg')",
      services: "url('/assets/services.png')",
    },
  },
  plugins: [],
};
