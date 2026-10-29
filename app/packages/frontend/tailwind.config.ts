import type { Config } from 'tailwindcss';
import captured from './src/theme/captured-theme.json';

/**
 * The captured site ships Tailwind v3.4 output. Its theme is read back from the
 * compiled rules by app/scripts/extract-theme.py, so utilities used here compile to
 * the same declarations as the original. CSS keywords keep Tailwind's own defaults.
 */
const KEYWORDS = new Set(['current', 'inherit', 'transparent']);
const colors = Object.fromEntries(Object.entries(captured.colors).filter(([name]) => !KEYWORDS.has(name)));

export default {
  content: ['./src/**/*.{ts,tsx}', './src/components/leaderboard/original-countdown.mjs'],
  // `.dark\:x:is(.dark *)` in the capture is the v3.4 `class` strategy.
  darkMode: 'class',
  theme: {
    borderRadius: captured.borderRadius,
    extend: {
      colors,
      fontFamily: { sans: [captured.fontFamily.sans], mono: [captured.fontFamily.mono] },
    },
  },
  plugins: [],
} satisfies Config;
