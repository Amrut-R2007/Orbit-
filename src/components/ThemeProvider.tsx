'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme, setResolvedTheme } = useAppStore();

  useEffect(() => {
    const saved = localStorage.getItem('orbit_theme') as 'light' | 'dark' | 'system' | null;
    if (saved) {
      setTheme(saved);
    }
    const savedMotion = localStorage.getItem('orbit_motion') as 'full' | 'reduced' | 'off' | null;
    if (savedMotion) {
      useAppStore.getState().setMotionPreference(savedMotion);
    }
  }, [setTheme]);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        setResolvedTheme('dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        setResolvedTheme('light');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme, setResolvedTheme]);

  return <>{children}</>;
};
