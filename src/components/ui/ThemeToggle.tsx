"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-20 h-8 rounded-xl bg-white/10 animate-pulse" />;
  }

  return (
    <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'light'
            ? 'bg-white text-amber-500 shadow-sm'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'dark'
            ? 'bg-[#121826] text-indigo-400 shadow-sm border border-indigo-500/30'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-white/20 text-emerald-500 dark:text-emerald-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        }`}
        title="System Theme"
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
