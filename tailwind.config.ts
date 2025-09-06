import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        'paper' :{
          DEFAULT: '#fffddd',
          'dark': '#383838'
        },
        'text':{
          DEFAULT: {
            DEFAULT: '#1d1c2e',
            'dark': '#ffffff'
          },
          'muted': {
            DEFAULT: '#5e5e5e',
            'dark': '#d7d4e6'
          },
          'secondary': '#ff1d1d'
        },
        'accent':{
          'blue': '#3b82f6', 
        }
      }
    }
  }
} satisfies Config;
