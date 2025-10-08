/** @type {import('tailwindcss').Config} */
import formsPlugin from "@tailwindcss/forms";
import lineClampPlugin from "@tailwindcss/line-clamp";
import animatePlugin from "tailwindcss-animatecss";

module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
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
