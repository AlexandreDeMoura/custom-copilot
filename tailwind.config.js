module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-500': '#4338ca',
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      fill: ['hover', 'focus'],
    }
  },
}
