/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0E11',
          secondary: '#12161C',
          tertiary: '#1A2030',
        },
        accent: {
          blue: '#3B82F6',
          'blue-hover': '#2563EB',
          'blue-dim': '#1D4ED8',
        },
        border: {
          DEFAULT: '#1E2A3A',
          light: '#2A3A50',
        },
        text: {
          primary: '#E2E8F0',
          secondary: '#94A3B8',
          muted: '#475569',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
