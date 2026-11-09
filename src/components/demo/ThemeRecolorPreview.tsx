'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { MonsteraLeaf } from '../leaves/MonsteraLeaf';
import { PalmFrond } from '../leaves/PalmFrond';
import { TaroLeaf } from '../leaves/TaroLeaf';
import { Sun, Moon } from 'lucide-react';

export const ThemeRecolorPreview: React.FC = () => {
  const { resolvedTheme, setTheme } = useAppStore();

  return (
    <div className="orbit-card p-6 max-w-md w-full mx-auto bg-[var(--card)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
            Design System In Motion
          </span>
          <h3 className="text-lg font-bold text-[var(--foreground)]">Botanical Theme Engine</h3>
        </div>
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--foreground)] transition-all shadow-sm active:scale-95"
        >
          {resolvedTheme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-purple-500" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4">
        Leaves are clean inline vector SVGs driven directly by CSS variables. Watch the warm peach
        hues smoothly shift into midnight violet:
      </p>

      {/* Side-by-side botanical preview */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-20">
            <MonsteraLeaf className="w-full h-full" />
          </div>
          <span className="text-[10px] font-semibold text-[var(--muted-foreground)] mt-2">
            Monstera
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-20">
            <PalmFrond className="w-full h-full" />
          </div>
          <span className="text-[10px] font-semibold text-[var(--muted-foreground)] mt-2">
            Palm Frond
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-20">
            <TaroLeaf className="w-full h-full" />
          </div>
          <span className="text-[10px] font-semibold text-[var(--muted-foreground)] mt-2">
            Taro Leaf
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs px-1">
        <span className="text-[var(--muted-foreground)]">Current Palette:</span>
        <span className="font-mono-num font-bold text-[var(--foreground)]">
          {resolvedTheme === 'dark' ? 'Purple (#7C5CBF & #A78BFA)' : 'Peach (#FFCBA4 & #FFE2CC)'}
        </span>
      </div>
    </div>
  );
};
