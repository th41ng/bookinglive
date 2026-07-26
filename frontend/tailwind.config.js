/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07111f',
        panel: '#0d1728',
        panelSoft: '#111d34',
        line: 'rgba(255,255,255,0.08)',
        text: '#ecf3ff',
        muted: '#97a6c1',
        accent: {
          50: '#effbff',
          100: '#d7f4ff',
          200: '#aee9ff',
          300: '#79d9ff',
          400: '#3dc2ff',
          500: '#14a3ff',
          600: '#0b84d9',
          700: '#0b69ad',
        },
        success: '#39d98a',
        warning: '#ffb020',
        danger: '#ff6b6b',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(20,163,255,0.12), 0 20px 60px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
