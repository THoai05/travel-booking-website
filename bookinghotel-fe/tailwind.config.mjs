/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms';
import lineClampPlugin from '@tailwindcss/line-clamp';
import animatePlugin from 'tailwindcss-animatecss';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#00C6FF',
          DEFAULT: '#0072FF',
          dark: '#0047B3',
        },
      },
      backgroundImage: {
        'gradient-bluvera': 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)',
      },
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      'xl-max': { 'raw': '(max-width: 1440px)' },
      'lg-max': { 'raw': '(max-width: 1024px)' },
      'md-max': { 'raw': '(max-width: 768px)' },
      'sm-max': { 'raw': '(max-width: 576px)' },
    },
  },
  plugins: [
    formsPlugin,
    lineClampPlugin,
    animatePlugin({
      classes: ['bounce', 'bounceIn'],
      variants: ['responsive'],
    }),
  ],
};
