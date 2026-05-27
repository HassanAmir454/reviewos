import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        bg: {
          primary:   '#0A0B0E',
          secondary: '#0F1117',
          tertiary:  '#151820',
          elevated:  '#1C1F2A',
          hover:     '#222638',
        },
        accent: {
          green:  '#00FF88',
          purple: '#7B61FF',
          red:    '#FF6B6B',
          amber:  '#FFB800',
        },
        border: {
          subtle:   '#1E2233',
          default:  '#2A2E45',
          emphasis: '#3D4266',
        },
        text: {
          primary:   '#F0F0F5',
          secondary: '#8B8FA8',
          muted:     '#4A4E65',
          ghost:     '#2A2E45',
        },
      },
      animation: {
        'pulse-dot':     'pulseDot 2s ease-in-out infinite',
        'blink':         'blink 1s step-end infinite',
        'slide-up':      'slideUp 0.4s ease-out',
        'fade-in':       'fadeIn 0.3s ease-out',
        'stream-in':     'streamIn 0.15s ease-out',
        'critical-pulse':'criticalPulse 2s ease-in-out infinite',
        'shimmer':       'shimmer 1.5s infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.75)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        streamIn: {
          '0%':   { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        criticalPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,107,0)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(255,107,107,0.25)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
