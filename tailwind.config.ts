import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#080D1A', mid: '#0E1628', light: '#151F36', card: '#111827' },
        gold: { DEFAULT: '#C8A96E', light: '#E2CC9A', dim: '#8C7348' },
        white: { DEFAULT: '#F5F1EB', dim: '#A89F92' },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Outfit', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
