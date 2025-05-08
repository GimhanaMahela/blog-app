/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        blue: {
          600: "#2563eb", // Your navbar color
        },
      },
    },
  },
  plugins: [],
};
