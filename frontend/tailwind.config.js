/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d70018',
          50: '#fff1f1',
          100: '#ffdede',
          200: '#ffc1c1',
          300: '#ff9494',
          400: '#ff5656',
          500: '#ff2020',
          600: '#d70018',
          700: '#b80016',
          800: '#960016',
          900: '#7c0018',
        },
        gearvn: {
          bg: '#f4f4f4',
          card: '#ffffff',
          dark: '#1a1a1a',
          darker: '#111111',
          text: '#333333',
          muted: '#666666',
          border: '#e5e7eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-red': 'pulse-red 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(215, 0, 24, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(215, 0, 24, 0)' },
        }
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.12)',
        'red-glow': '0 4px 15px rgba(215, 0, 24, 0.25)',
      }
    },
  },
  plugins: [],
}
