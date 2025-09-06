import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
} satisfies Config;
