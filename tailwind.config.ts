import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#ffffff',
          secondary: '#F9F9F9',
          dark: '#212121',
          'secondary-dark': '#181818'
        },
        foreground: {
          100: '#0D0D0D',
          300: '#F4F4F4',
          400: '#D7D7D7',
          500: '#5D5D5D',
          'dark-100': '#ECECEC',
          'dark-300': '#B4B4B4',
          'dark-400': '#676767',
          'dark-500': '#2E2E2E',
        }
      },
    },
  },
  plugins: [],
};
export default config;
