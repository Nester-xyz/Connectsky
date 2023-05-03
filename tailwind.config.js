/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.{html, js, jsx, ts, tsx} ",
    "./public/*.{html, js, jsx, ts, tsx} ",
    // "./dist/index.html",
  ],
  theme: {
    extend: {
      colors: {
        gray: "#f0f2f5",
      },
    },
    plugins: [],
  },
};
