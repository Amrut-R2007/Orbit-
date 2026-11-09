'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useAcademicData } from '@/hooks/useAcademicData';
import { MonsteraLeaf } from '../leaves/MonsteraLeaf';
import { NAV_ITEMS } from './AppNavigation';
import { Menu, X, Flame, Bell } from 'lucide-react';

export const AppHeader: React.FC<{ title?: string }> = ({ title }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { streaks } = useAcademicData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active page title fallback
  const currentNav = NAV_ITEMS.find((n) => n.href === pathname);
  const displayTitle = title || currentNav?.label || 'Orbit';

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 lg:hidden">
            <MonsteraLeaf className="w-6 h-6" />
            <span className="font-bold text-lg text-[var(--foreground)]">Orbit</span>
          </div>

          <h1 className="hidden lg:block text-xl font-bold tracking-tight text-[var(--foreground)]">
            {displayTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter Badge */}
          <Link
            href="/streaks"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs hover:bg-orange-500/20 transition-all active:scale-95"
            title={`${streaks.current} day streak! Tap to view badges.`}
          >
            <Flame className="w-4 h-4 text-orange-500 animate-pulse fill-orange-500" />
            <span className="font-mono-num">{streaks.current}d</span>
          </Link>

          {/* Deadlines shortcut / alerts */}
          <Link
            href="/deadlines"
            className="relative p-2 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Deadlines"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </Link>

          {/* Theme Switcher in header */}
          <ThemeToggle compact />

          {/* Cloud Autosave Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] text-[11px] font-semibold text-[var(--muted-foreground)] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autosaved</span>
          </div>

          {/* User profile picture */}
          <Link
            href="/settings"
            className="w-9 h-9 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center text-xs overflow-hidden border border-[var(--border)] shadow-sm"
          >
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              (user?.name || 'O').charAt(0)
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Dropdown for full 11 sections */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[80vw] h-full bg-[var(--card)] p-4 flex flex-col justify-between border-r border-[var(--border)] animate-in slide-in-from-left duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <MonsteraLeaf className="w-7 h-7" />
                  <div>
                    <span className="font-bold text-lg text-[var(--foreground)]">Orbit</span>
                    <p className="text-[10px] text-[var(--muted-foreground)]">by ByteCraft Studio</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--primary)] text-white font-semibold'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--muted-foreground)] mb-2">Switch Theme</p>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
