import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#228B22', // Forest green primary
          600: '#1e7a1e',
          700: '#1a6b1a',
          800: '#155c15',
          900: '#114d11',
          950: '#0a3d0a',
        },
        background: {
          DEFAULT: '#0a0f0a',
          card: '#111a11',
          elevated: '#162016',
        },
        foreground: {
          DEFAULT: '#e8f5e8',
          muted: '#a3c9a3',
          subtle: '#8bb38b', // Adjusted from #6b8f6b for ≥4.5:1 contrast on all surfaces
        },
        accent: {
          DEFAULT: '#34d399',
          hover: '#6ee7b7',
        },
        border: {
          DEFAULT: '#1e3a1e',
          hover: '#2d5a2d',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      spacing: {
        section: '6rem',       // Section vertical spacing (desktop)
        'section-sm': '4rem',  // Section vertical spacing (mobile)
        content: '2rem',       // Internal content padding
        '18': '4.5rem',        // 72px - useful for layout gaps
        '88': '22rem',         // Container widths
        '128': '32rem',        // Wider container
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-up-stagger': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '600': '600ms',
        '800': '800ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-out-soft': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'ease-out-counter': 'cubic-bezier(0.33, 1, 0.68, 1)', // For animated counters
      },
      transitionDelay: {
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [typography],
};

export default config;
