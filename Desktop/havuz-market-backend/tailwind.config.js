/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        havuzTurkuaz: '#00b4d8',    // İstediğin o harika turkuaz rengi
        havuzKoyuMavi: '#03045e',   // Buton yazıları ve başlıklar için koyu ton
        havuzGece: '#07121c',       // Footer ve üst bar rengi
      },
    },
  },
  plugins: [],
}