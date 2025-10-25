/** @type {import('tailwindcss').Config} */

// --- SỬA LỖI Ở ĐÂY ---
const formsPlugin = require("@tailwindcss/forms");
const lineClampPlugin = require("@tailwindcss/line-clamp");
const animatePlugin = require("tailwindcss-animatecss");
// --------------------

module.exports = {
  // Mảng content này của bro BÂY GIỜ ĐÃ ĐÚNG.
  // Nó sẽ quét HẾT thư mục 'src', 'app', và 'components'
  content: [
    "./app/**/*.{ts,tsx,js,jsx}", 
    "./components/**/*.{ts,tsx,js,jsx}",
    './src/**/*.{js,ts,jsx,tsx,mdx}' // Dòng này sẽ bắt hết các component UI của bro
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      "xl-max": { max: "1440px" },
      "lg-max": { max: "1024px" },
      "md-max": { max: "768px" },
      "sm-max": { max: "576px" },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
        ],
        heading: ["var(--font-poppins)", "var(--font-inter)", "ui-sans-serif"],
      },
    },
  },
  plugins: [
    formsPlugin,
    lineClampPlugin,
    animatePlugin({
      classes: ["bounce", "bounceIn"],
      variants: ["responsive"],
    }),
  ],
};