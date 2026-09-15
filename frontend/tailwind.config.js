/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A3E62', // Biotech Blue
          container: '#0e8388',
        },
        secondary: {
          DEFAULT: '#3BC9A1', // Innovation Teal
          container: '#92f7c3',
        },
        accent: {
          cyan: '#00D1FF', // Digital Cyan
        },
        surface: {
          DEFAULT: '#f7faf9',
          dim: '#d7dbda',
          lowest: '#ffffff',
          low: '#f1f4f3',
          container: '#ebeeed',
          high: '#e6e9e8',
        },
      }
    },
  },
  plugins: [],
}
