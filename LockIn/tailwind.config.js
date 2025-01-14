/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        czarnuch: '#131313',
        zloty: '#F5B800',
        bialas: '#F5F5F5',
      },
    },
  },
  plugins: [],
}
