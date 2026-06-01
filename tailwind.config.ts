import type { Config } from 'tailwindcss'

// Verde oficial SENA: #4e8e38 (extraído del logo)
// Paleta generada a partir de HSL(103°, 44%, 39%)
const senaPalette = {
  50:  '#f2f8ee',
  100: '#e0f0d4',
  200: '#c3e2ab',
  300: '#9dcf7a',
  400: '#72b84a',
  500: '#4e8e38',   // ← color base del logo
  600: '#3e7229',   // botones primarios
  700: '#305820',   // hover
  800: '#27461b',
  900: '#1e3714',
  950: '#0f1e09',
}

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.ts',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Sobreescribe "teal" con el verde SENA para no cambiar las clases existentes
        teal: senaPalette,
      },
    },
  },
  plugins: [],
} satisfies Config
