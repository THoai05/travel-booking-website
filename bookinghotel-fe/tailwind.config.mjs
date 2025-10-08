/** @type {import('tailwindcss').Config} */
import formsPlugin from "@tailwindcss/forms";
import lineClampPlugin from "@tailwindcss/line-clamp";
import animatePlugin from "tailwindcss-animatecss";

module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial"],
        heading: ["var(--font-poppins)", "var(--font-inter)", "ui-sans-serif"]
      }
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      "xl-max": { raw: "(max-width: 1440px)" },
      "lg-max": { raw: "(max-width: 1024px)" },
      "md-max": { raw: "(max-width: 768px)" },
      "sm-max": { raw: "(max-width: 576px)" },
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
