import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        success: {
          100: '#dcfce7',
          600: '#16a34a',
        },
        warning: {
          100: '#fef9c3',
          600: '#ca8a04',
        },
        danger: {
          100: '#fee2e2',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Ethiopic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
