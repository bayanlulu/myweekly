// components/ThemeToggle.tsx - SAFE VERSION
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  try {
    const { theme, toggleTheme } = useTheme();
    
    return (
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="text-gray-700 w-6 h-6" />
        ) : (
          <Sun className="text-yellow-400 w-6 h-6" />
        )}
      </button>
    );
  } catch (error) {
    // Fallback if ThemeProvider is not available
    return (
      <button
        onClick={() => {
          const isDark = document.documentElement.classList.contains('dark');
          if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          }
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white border-2 border-gray-300 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Toggle theme"
      >
        <Sun className="text-gray-700 w-6 h-6" />
      </button>
    );
  }
}