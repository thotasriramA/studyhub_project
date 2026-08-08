/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        logo: ['"Grand Hotel"', 'cursive'],
      },
      colors: {
        insta: {
          border: '#dbdbdb',
          gray: '#8e8e8e',
          bg: '#fafafa',
          blue: '#0095f6',
          red: '#ed4956',
        },
      },
    },
  },
  plugins: [],
}
