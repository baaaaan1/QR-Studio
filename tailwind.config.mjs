/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-color)',
        surface: 'var(--surface-color)',
        'surface-elevated': 'var(--surface-elevated)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        primary: {
          DEFAULT: 'var(--primary-indigo)',
          hover: 'var(--primary-hover)',
        },
        cyan: {
          accent: 'var(--cyan-accent)',
        },
        green: {
          accent: 'var(--green-accent)',
        },
        pink: {
          accent: 'var(--pink-accent)',
        },
        border: 'var(--border-color)',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'major': '24px',
        'card': '16px',
        'control': '12px',
      },
      boxShadow: {
        'neu-flat': 'var(--neu-flat)',
        'neu-pressed': 'var(--neu-pressed)',
        'neu-hover': 'var(--neu-hover)',
        'neu-sm': 'var(--neu-sm)',
        'glow-indigo': '0 0 25px -4px var(--primary-indigo)',
        'glow-cyan': '0 0 25px -4px var(--cyan-accent)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
