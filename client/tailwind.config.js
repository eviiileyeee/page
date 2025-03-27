const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode with 'class'
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Tailwind content paths
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#60a5fa',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#4f46e5',
          light: '#818cf8',
          dark: '#4338ca',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['NeueMontreal-Regular', ...defaultTheme.fontFamily.sans],
        heading: ['FoundersGrotesk-Semibold', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

