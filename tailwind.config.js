/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary accent — a restrained slate-indigo tone
        brand: {
          50:  '#f5f6ff',
          100: '#eceeff',
          200: '#d8dbfe',
          300: '#b5bbfd',
          400: '#8b93fa',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Surface — true neutral grey (no blue tint)
        surface: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card:  '0 1px 2px 0 rgb(0 0 0 / .05)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / .07), 0 2px 4px -2px rgb(0 0 0 / .05)',
        modal: '0 25px 50px -12px rgb(0 0 0 / .18)',
      },
      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // NEW: Added animations to make GitHub recognize new changes
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  // NEW: Added DaisyUI plugin for pre-built components (buttons, modals, etc.)
  plugins: [require("daisyui")],
  
  // DaisyUI Config - setting the theme to match your brand colors
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#6366f1", // matches brand-500
          "base-100": "#fafafa", // matches surface-50
        },
      },
    ],
  },
}