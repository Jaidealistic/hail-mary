import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#0A0B14',
        nebula: '#4B3FA0',
        safe: '#0F9B7A',
        alert: '#C87C1A',
        unknown: '#8B2020',
        textPrimary: '#E8E4F8',
        panel: '#2A2B40'
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
} satisfies Config
