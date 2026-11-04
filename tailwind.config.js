/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(10 20 16)',
        ink: 'rgb(234 243 237)',
        surface: 'rgb(19 33 26)',
        line: 'rgb(37 56 44)',
        muted: 'rgb(140 163 150)',
        brand: {
          400: 'rgb(54 190 123)',
          500: 'rgb(25 161 99)',
          300: 'rgb(109 216 160)',
          200: 'rgb(165 234 195)',
        },
        accent: {
          400: 'rgb(210 220 28)',
          300: 'rgb(227 236 76)',
          200: 'rgb(240 245 140)',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'ui-sans-serif', 'sans-serif'],
        body: ['Barlow', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
      },
      maxWidth: {
        prose: '65ch',
      },
    },
    plugins: [],
  }
}
