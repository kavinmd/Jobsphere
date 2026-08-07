/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#8196f9',
          500: '#6172f4',
          600: '#4f53ea',
          700: '#4040d1',
          800: '#3535a8',
          900: '#2f3285',
        },
        accent: {
          50: '#fff1f9',
          100: '#ffe4f3',
          200: '#fecce8',
          300: '#fda4d3',
          400: '#fb6cb6',
          500: '#f43f9a',
          600: '#e41f7e',
          700: '#c70f65',
          800: '#a41054',
          900: '#881348',
        },
        dark: {
          900: '#0a0b1a',
          800: '#0f1030',
          700: '#151640',
          600: '#1e2050',
          500: '#272960',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6172f4 0%, #f43f9a 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0b1a 0%, #151640 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(97, 114, 244, 0.1) 0%, rgba(244, 63, 154, 0.05) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
