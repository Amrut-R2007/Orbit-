'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useAppStore, ThemeMode } from '@/lib/store';

export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, setTheme, resolvedTheme } = useAppStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  if (compact) {
    return (
      <button
        onClick={cycleTheme}
        type="button"
        title={`Current theme: ${theme} (${resolvedTheme})`}
        aria-label="Toggle visual theme"
        className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)] transition-all shadow-sm active:scale-95"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-5 h-5 text-purple-400 animate-in spin-in-180 duration-300" />
        ) : (
          <Sun className="w-5 h-5 text-amber-500 animate-in spin-in-180 duration-300" />
        )}
      </button>
    );
  }

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-purple-400" /> },
    { mode: 'system', label: 'Auto', icon: <Laptop className="w-4 h-4 text-neutral-400" /> },
  ];

  return (
    <div className="flex items-center p-1 rounded-full border border-[var(--border)] bg-[var(--card)] shadow-inner">
      {options.map((opt) => {
        const isActive = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            onClick={() => setTheme(opt.mode)}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? 'bg-[var(--primary)] text-white shadow-sm font-semibold'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
