/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "star-wars-yellow": {
          DEFAULT: "#FFC500"
        },
        "space": {
          DEFAULT: '#060606'
        }
      }
    },
  },
  plugins: [],
};
