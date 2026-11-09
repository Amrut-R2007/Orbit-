'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Coffee } from 'lucide-react';
import { calculateAttendanceMetrics } from '@/lib/attendance-calculator';

type DayStatus = 'present' | 'absent' | 'holiday';

interface DayDemo {
  day: string;
  name: string;
  status: DayStatus;
}

export const InteractiveAttendanceDemo: React.FC = () => {
  const [days, setDays] = useState<DayDemo[]>([
    { day: 'Mon', name: 'DSA & OS', status: 'present' },
    { day: 'Tue', name: 'Discrete Math', status: 'present' },
    { day: 'Wed', name: 'Networks Lab', status: 'absent' },
    { day: 'Thu', name: 'Embedded Sys', status: 'present' },
    { day: 'Fri', name: 'DSA & Systems', status: 'present' },
    { day: 'Sat', name: 'Elective', status: 'holiday' },
  ]);

  const toggleDayStatus = (index: number) => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== index) return d;
        const next: DayStatus =
          d.status === 'present' ? 'absent' : d.status === 'absent' ? 'holiday' : 'present';
        return { ...d, status: next };
      })
    );
  };

  const countedDays = days.filter((d) => d.status !== 'holiday');
  const attendedCount = countedDays.filter((d) => d.status === 'present').length;
  const totalCount = countedDays.length;
  const metrics = calculateAttendanceMetrics(attendedCount, totalCount, 75);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (metrics.percentage / 100) * circumference;

  return (
    <div className="orbit-card p-6 max-w-md w-full mx-auto bg-[var(--card)] select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
            Live Interactive Simulator
          </span>
          <h3 className="text-lg font-bold text-[var(--foreground)]">Interactive Attendance Ring</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
          Target: 75%
        </span>
      </div>

      <div className="flex items-center justify-center gap-6 py-4">
        {/* Animated Circular Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="var(--border)"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress ring */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              stroke={
                metrics.status === 'safe'
                  ? 'var(--leaf-primary)'
                  : metrics.status === 'warning'
                  ? '#F59E0B'
                  : '#EF4444'
              }
              strokeWidth="9"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black font-mono-num text-[var(--foreground)]">
              {metrics.percentage}%
            </span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-medium uppercase">
              {attendedCount}/{totalCount}
            </span>
          </div>
        </div>

        {/* Dynamic Metric Output */}
        <div className="flex-1 space-y-2">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
              metrics.percentage >= 75
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
            }`}
          >
            <span>{metrics.percentage >= 75 ? '✓ On Target' : '⚠ Below Target'}</span>
          </div>
          <p className="text-xs text-[var(--foreground)] leading-relaxed font-medium">
            {metrics.headline}
          </p>
        </div>
      </div>

      <p className="text-xs text-[var(--muted-foreground)] text-center mb-3">
        Tap any day below to cycle Present → Absent → Holiday:
      </p>

      {/* Weekday clickable tiles */}
      <div className="grid grid-cols-6 gap-1.5">
        {days.map((item, idx) => (
          <button
            key={item.day}
            onClick={() => toggleDayStatus(idx)}
            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all active:scale-95 ${
              item.status === 'present'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : item.status === 'absent'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                : 'bg-[var(--muted)] border-transparent text-[var(--muted-foreground)]'
            }`}
          >
            <span className="text-xs font-bold">{item.day}</span>
            <div className="mt-1">
              {item.status === 'present' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              {item.status === 'absent' && <X className="w-3.5 h-3.5 stroke-[3]" />}
              {item.status === 'holiday' && <Coffee className="w-3.5 h-3.5" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
