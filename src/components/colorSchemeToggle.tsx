/* eslint-disable max-len */
import { useColorScheme } from './colorSchemeProvider';
import { LuMoon, LuSun } from 'react-icons/lu';

export function ColorSchemeToggle() {
  const { scheme, toggleScheme } = useColorScheme();
  return (
    <button
      onClick={toggleScheme}
      className="px-3 py-2 rounded border bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2"
      aria-label="テーマ切り替え"
    >
      {scheme === 'light' ? <LuMoon /> : <LuSun />}
      {scheme === 'light' ? 'ダーク' : 'ライト'}モード
    </button>
  );
}
