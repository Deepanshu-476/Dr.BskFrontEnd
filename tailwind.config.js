/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        stame: {
          cream: "#fff8ee",
          paper: "#fffaf2",
          line: "#ead8c7",
          brown: "#4b210b",
          bark: "#5b260d",
          copper: "#9c5a27",
          gold: "#c88425",
        },
      },
      boxShadow: {
        stame: "0 8px 24px rgba(91, 42, 15, 0.12)",
      },
    },
  },
  plugins: [],
};
