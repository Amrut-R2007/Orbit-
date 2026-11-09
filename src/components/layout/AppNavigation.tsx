'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  CalendarCheck,
  TrendingUp,
  FileSpreadsheet,
  GraduationCap,
  Timer,
  ClockAlert,
  Flame,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { MonsteraLeaf } from '../leaves/MonsteraLeaf';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/calendar', label: 'Master Cal', icon: CalendarCheck },
  { href: '/predictor', label: 'Predictor', icon: TrendingUp },
  { href: '/exams', label: 'Exams', icon: FileSpreadsheet },
  { href: '/gpa', label: 'SGPA/CGPA', icon: GraduationCap },
  { href: '/focus', label: 'Focus Timer', icon: Timer },
  { href: '/deadlines', label: 'Deadlines', icon: ClockAlert },
  { href: '/streaks', label: 'Streaks', icon: Flame },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[var(--card)] border-r border-[var(--border)] p-4 select-none z-30 transition-colors duration-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/15 flex items-center justify-center border border-[var(--primary)]/30">
          <MonsteraLeaf className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">Orbit</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--primary)]/20 text-[var(--primary)]">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)] font-medium">
            by ByteCraft Studio
          </p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'text-[var(--primary)] font-semibold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
              }`}
            >
              {/* Active Morphing Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-pill"
                  className="absolute inset-0 rounded-xl bg-[var(--primary)]/12 border border-[var(--primary)]/30 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--primary)]' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile & Theme */}
      <div className="pt-4 border-t border-[var(--border)] mt-auto space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-[var(--muted-foreground)] font-medium">Theme</span>
          <ThemeToggle compact />
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--muted)] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center text-sm shadow-sm overflow-hidden">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              (user?.name || 'O').charAt(0)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--foreground)] truncate">
              {user?.name || 'My Profile'}
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)] truncate">
              {user?.branch || user?.college || 'Academic Account'}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export const MobileBottomBar: React.FC = () => {
  const pathname = usePathname();

  // Primary 5 mobile tabs for fast one-hand tap
  const primaryMobileTabs = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/timetable', label: 'Classes', icon: CalendarDays },
    { href: '/calendar', label: 'Calendar', icon: CalendarCheck },
    { href: '/predictor', label: 'Predict', icon: TrendingUp },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)]/90 backdrop-blur-md border-t border-[var(--border)] pb-safe transition-colors duration-300">
      <div className="flex items-center justify-around h-16 px-2">
        {primaryMobileTabs.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-16 h-12 rounded-xl touch-manipulation transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="active-mobile-pill"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-[var(--primary)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'text-[var(--primary)] scale-110' : 'text-[var(--muted-foreground)]'
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? 'text-[var(--primary)] font-semibold' : 'text-[var(--muted-foreground)]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
