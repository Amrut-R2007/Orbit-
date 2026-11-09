'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Award,
  CheckCircle2,
  CalendarCheck,
  Timer,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { useAcademicData } from '@/hooks/useAcademicData';
import { useAppStore } from '@/lib/store';
import { fireLeafConfetti } from '@/components/leaves/LeafConfetti';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';

export default function StreaksPage() {
  const { streaks } = useAcademicData();
  const { resolvedTheme } = useAppStore();

  const handleCelebrate = () => {
    fireLeafConfetti(resolvedTheme === 'dark');
  };

  const streakTypes = [
    {
      title: 'Class Attendance Streak',
      desc: 'Marked present for scheduled lecture and lab sessions.',
      icon: CalendarCheck,
      count: streaks.current,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Daily Tasks Streak',
      desc: 'Completed prioritized academic tasks on schedule.',
      icon: CheckCircle2,
      count: streaks.current > 0 ? streaks.current : 0,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Pomodoro Focus Streak',
      desc: 'Completed deep focus study blocks consistently.',
      icon: Timer,
      count: streaks.current > 0 ? streaks.current : 0,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  const BADGES = [
    {
      id: 'b1',
      title: '7-Day Streak Master',
      desc: 'Maintained uninterrupted attendance across 7 consecutive college days.',
      unlocked: streaks.current >= 7 || streaks.longest >= 7,
      date: (streaks.current >= 7 || streaks.longest >= 7) ? 'Unlocked' : 'Requires 7-day streak',
    },
    {
      id: 'b2',
      title: 'Consistent Week',
      desc: 'Attended scheduled lectures and laboratories without unexcused skips.',
      unlocked: streaks.current >= 5 || streaks.longest >= 5,
      date: (streaks.current >= 5 || streaks.longest >= 5) ? 'Unlocked' : 'Requires 5 active days',
    },
    {
      id: 'b3',
      title: 'Syllabus Finisher',
      desc: 'Checked off 100% of preparation units for an evaluation.',
      unlocked: streaks.badges?.includes('syllabus_finisher') || false,
      date: streaks.badges?.includes('syllabus_finisher') ? 'Unlocked' : 'Complete all syllabus items for an exam',
    },
    {
      id: 'b4',
      title: 'Focus Pioneer',
      desc: 'Logged structured study cycles with focused attention.',
      unlocked: streaks.badges?.includes('focus_pioneer') || false,
      date: streaks.badges?.includes('focus_pioneer') ? 'Unlocked' : 'Complete 5 focus sessions',
    },
    {
      id: 'b5',
      title: 'Semester Momentum',
      desc: 'Maintained active academic consistency for 14 consecutive days.',
      unlocked: streaks.longest >= 14,
      date: streaks.longest >= 14 ? 'Unlocked' : 'Requires 14-day streak',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
          Streaks & Academic Badges
        </h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Stay consistent in attendance, daily tasks, and study sessions.
        </p>
      </div>

      {/* Hero Streak Celebration Card */}
      <div className="orbit-card p-6 sm:p-8 bg-[var(--card)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
            Unstoppable Momentum
          </span>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Flame className="w-10 h-10 text-orange-500 fill-orange-500 animate-bounce" />
            <span className="text-4xl sm:text-5xl font-black font-mono-num text-[var(--foreground)]">
              {streaks.current} Days
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-md">
            Longest record: <span className="font-mono-num font-bold text-[var(--foreground)]">{streaks.longest} days</span>.
            Keep marking today&apos;s lectures to extend your streak!
          </p>
        </div>

        {/* Celebrate button */}
        <button
          onClick={handleCelebrate}
          className="z-10 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--primary)] text-white font-bold text-sm shadow-xl hover:opacity-95 active:scale-95 transition-all"
        >
          <PartyPopper className="w-4 h-4" />
          <span>Trigger Leaf Confetti</span>
        </button>
      </div>

      {/* 3 Streak Pillars */}
      <div className="grid sm:grid-cols-3 gap-4">
        {streakTypes.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.title} className="orbit-card p-5 bg-[var(--card)] space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-2xl ${st.bg} flex items-center justify-center ${st.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-2xl font-black font-mono-num ${st.color}`}>
                  {st.count}d
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--foreground)]">{st.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges Showcase */}
      <div className="orbit-card p-6 bg-[var(--card)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-base text-[var(--foreground)]">Milestone Badges</h3>
          </div>
          <span className="text-xs text-[var(--muted-foreground)] font-semibold">
            {BADGES.filter((b) => b.unlocked).length} of {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((b) => (
            <motion.div
              key={b.id}
              whileHover={{ y: -2 }}
              onClick={b.unlocked ? handleCelebrate : undefined}
              className={`p-4 rounded-2xl border transition-all ${
                b.unlocked
                  ? 'bg-[var(--background)] border-[var(--primary)]/40 cursor-pointer shadow-sm'
                  : 'bg-[var(--muted)]/40 border-[var(--border)] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    b.unlocked
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'bg-[var(--border)] text-[var(--muted-foreground)]'
                  }`}
                >
                  <MonsteraLeaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[var(--foreground)]">{b.title}</h4>
                  <span className="text-[10px] text-[var(--muted-foreground)]">{b.date}</span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
