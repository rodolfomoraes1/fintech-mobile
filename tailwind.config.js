/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Cores principais
        primary: "#47A138",
        secondary: "#FF5031",
        hover: "#FF5031",
        dark: "#004D61",
        light: "#DEE9EA",

        // Verdes
        green: {
          400: "#47A138",
          500: "#2F8D32",
          600: "#006B23",
        },

        // Vermelhos
        red: {
          400: "#FF6B6B",
          500: "#FF5031",
          600: "#D7381D",
        },

        // Amarelos
        yellow: {
          400: "#FFDA47",
          500: "#FFBF00",
          600: "#D79E00",
        },

        // Pretos
        black: {
          400: "#2C2C2C",
          500: "#1C1C1C",
          600: "#0F0F0F",
        },

        // Cores de background
        bgColors: {
          black: "#000000",
          lightGray: "#F8F8F8",
          paleGreen: "#E4EDE3",
          ice: "#F5F5F5",
          gray: "#CBCBCB",
        },
      },
    },
  },
  plugins: [],
};
