/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";
import formsPlugin from "@tailwindcss/forms";
import lineClampPlugin from "@tailwindcss/line-clamp";
import animatePlugin from "tailwindcss-animatecss";

const config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
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
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system"],
        heading: ["var(--font-poppins)", "var(--font-inter)", "ui-sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    formsPlugin,
    lineClampPlugin,
    animatePlugin({
      classes: ["bounce", "bounceIn"],
      variants: ["responsive"],
    }),
    heroui(),
  ],
};

export default config;
