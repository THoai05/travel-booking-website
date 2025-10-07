/** @type {import('tailwindcss').Config} */
import animatePlugin from 'tailwindcss-animatecss';
import formsPlugin from '@tailwindcss/forms';
import lineClampPlugin from '@tailwindcss/line-clamp';

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
    //Animate CSS settings (custom plugin)
    animatedSettings: {
      animatedSpeed: 1000,
      heartBeatSpeed: 500,
      hingeSpeed: 2000,
      bounceInSpeed: 750,
      bounceOutSpeed: 750,
      animationDelaySpeed: 500,
      classes: ['bounce', 'bounceIn'],
    },
  },
  plugins: [
    lineClampPlugin,
    formsPlugin,
    animatePlugin,
  ],
};
