/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // German market — earthy, professional
        anthracite: '#2A2A2A',
        anthraciteDeep: '#1C1C1C',
        olive: '#5C6B4A',
        oliveLight: '#7A8B62',
        cream: '#F5F0E6',
        creamMuted: '#E8E2D6',
        crust: '#B8956A',
        crustDark: '#96784A',
        tomato: '#9E4A3A',
        night: '#1C1C1C',
        ink: '#2A2A2A',
      },
      fontFamily: {
        display: ['"Cairo"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
