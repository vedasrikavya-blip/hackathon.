/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#3D81E3',
        accentCyan: '#00F5FF',
        accentPurple: '#7B61FF',
        accentLightCyan: '#6EE7FF',
        darkBg: '#050816',
        darkBgAura: '#0c0c0c',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


