/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF9F6',
        brand: {
          DEFAULT: '#5C3D2E',
          dark: '#3B2318',
          light: '#D4764E',
          50: '#FAF5F0',
          100: '#F0E6DA',
          200: '#E0CDB5',
          300: '#C9A882',
          400: '#A67B5B',
          500: '#5C3D2E',
          600: '#4A3125',
          700: '#3B2318',
          800: '#2D1A11',
          900: '#1F100A',
        },
        surface: '#FFFFFF',
        border: '#E8E4DF',
        success: '#2D6A4F',
        warning: '#E09F3E',
        danger: '#C1292E',
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.08em',
      },
      keyframes: {
        dropdown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        dropdown: 'dropdown 150ms ease-out',
        'slide-in': 'slide-in 300ms ease-out',
      },
    },
  },
  plugins: [],
};
