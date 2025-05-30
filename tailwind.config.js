/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4B0082',
        secondary: '#FFD700',
        accent: '#1F1F1F',
      }
    }
  },
  plugins: [],
}