/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'black': '#212121',
      'white': '#eeeeee',
      'dark-magenta': '#a64d79',
      'magenta': '#c27ba0ff',
      'red': '#e06666ff',
      'purple': '#8e7cc3ff',
      'green': '#93c47dff',
      'azure': '#6d9eebff',
      'cyan': '#76a5afff',
      'blue': '#6fa8dcff',
      'orange': '#f6b26bff',
      'yellow': '#ffd966ff',
      'gray': '#595959',
    },
    fontFamily: {
      sans: ['Fragment Mono', 'monospace'], // Tailwindcss uses sans by default
      mono: ['Fragment Mono', 'monospace'],
    },
    fontSize: {
      'title': '20vw',

      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    extend: {},
  },
  plugins: [],
}
