/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'severity': {
          'low': '#22c55e',
          'medium': '#eab308',
          'high': '#ef4444',
        }
      }
    },
  },
  plugins: [],
}