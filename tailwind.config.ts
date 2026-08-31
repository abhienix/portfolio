import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#020B18',
          ocean: '#041428',
          land: '#0A2240',
          cyan: '#00F5FF',
          red: '#FF3B3B',
          orange: '#FF8C00',
          green: '#00FF88',
          amber: '#FFB700',
          text: '#E0F4FF',
          dim: '#94BBD9',
          muted: '#648BA8',
          secondary: '#CBD5E1',
          border: '#0E3A6E',
        },
        amber: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
        },
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-radar': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        scanline: 'scanline 0.4s linear forwards',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        scanline: {
          '0%': { top: '0', opacity: '0.35' },
          '100%': { top: '100%', opacity: '0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
