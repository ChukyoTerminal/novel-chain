import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'paper': '#fffddd',
        'paper-dark': '#383838',
        'text': '#1d1c2e',
        'text-dark': '#ffffff',
        'text-muted': '#5e5e5e',
        'text-muted-dark': '#d7d4e6',
        'text-secondary': '#ff1d1d',
        'text-white': '#ffffff',
        'accent-blue': '#3b82f6',
        'accent-green': '#10b95f',
        'accent-yellow': '#facc1f',
        'accent-red': '#ef4444',
        'book-paper': '#e6e0c3',
        'book-red-front': '#ff9e91',
        'book-red-aspect': '#c42127',
        'book-red-back': '#bd756c',
        'book-red-title': '#ffffff',
        'book-red-desc': '#ffffff',
        'book-blue-front': '#91caff',
        'book-blue-aspect': '#2176c4',
        'book-blue-back': '#6c9fbd',
        'book-blue-title': '#ffffff',
        'book-blue-desc': '#ffffff',
        'book-yellow-front': '#ffeb91',
        'book-yellow-aspect': '#c4a321',
        'book-yellow-back': '#bdb76c',
        'book-yellow-title': '#000000',
        'book-yellow-desc': '#000000',
        'book-green-front': '#91ffb3',
        'book-green-aspect': '#21c468',
        'book-green-back': '#6cbda1',
        'book-green-title': '#000000',
        'book-green-desc': '#000000',
        'book-purple-front': '#d391ff',
        'book-purple-aspect': '#7c21c4',
        'book-purple-back': '#9f6cbd',
        'book-purple-title': '#ffffff',
        'book-purple-desc': '#ffffff',
        'book-gray-front': '#b0b0b0',
        'book-gray-aspect': '#4f4f4f',
        'book-gray-back': '#7a7a7a',
        'book-gray-title': '#ffffff',
        'book-gray-desc': '#ffffff',
      }
    }
  }
} satisfies Config;
