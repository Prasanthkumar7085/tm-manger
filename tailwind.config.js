/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'sans-serif'], },
      colors: {
        primary: '#bf1b39',
        secondary: '#1e3a8a'
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(95.1deg, #3357AA 0.6%, #BF1B39 101.33%)',
      },
      boxShadow: {
        'all': '0px 0px 9px 0px rgba(0, 0, 0, 0.14)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}