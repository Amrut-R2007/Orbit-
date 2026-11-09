'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAcademicData } from '@/hooks/useAcademicData';
import { predictAttendance, calculateAttendanceMetrics } from '@/lib/attendance-calculator';

export default function AttendancePredictorPage() {
  const { user } = useAuth();
  const { subjects, attendance, getSubjectMetrics, getOverallMetrics } = useAcademicData();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('overall');
  const [selectedKind, setSelectedKind] = useState<'theory' | 'lab'>('theory');

  // Interactive Live Sliders
  const [classesToSkip, setClassesToSkip] = useState<number>(0);
  const [classesToAttend, setClassesToAttend] = useState<number>(0);

  const target = user?.attendanceTarget || 75;

  // Base metrics
  const isOverall = selectedSubjectId === 'overall';
  const baseMetrics = isOverall
    ? getOverallMetrics()
    : getSubjectMetrics(selectedSubjectId, selectedKind);

  // Projected metrics
  const prediction = predictAttendance(
    baseMetrics.attended,
    baseMetrics.total,
    classesToAttend,
    classesToSkip,
    target
  );

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Gauge animation math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prediction.projectedPercentage / 100) * circumference;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
          Attendance Predictor & Bunk Calculator
        </h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Simulate future attendances and skips. Live gauge reveals exactly when your percentage crosses the {target}% threshold.
        </p>
      </div>

      {/* Subject & Stream Selectors */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <select
          value={selectedSubjectId}
          onChange={(e) => {
            setSelectedSubjectId(e.target.value);
            setClassesToSkip(0);
            setClassesToAttend(0);
          }}
          className="flex-1 px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm font-bold text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] shadow-sm"
        >
          <option value="overall">All Subjects Combined (Overall Attendance)</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} - {s.name}
            </option>
          ))}
        </select>

        {!isOverall && currentSubject?.hasLab && (
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <button
              onClick={() => setSelectedKind('theory')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedKind === 'theory'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Theory Lectures
            </button>
            <button
              onClick={() => setSelectedKind('lab')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedKind === 'lab'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Laboratory
            </button>
          </div>
        )}
      </div>

      {/* Main Simulation Display Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Animated Percentage Ring & Key Verdict (5 Cols) */}
        <div className="lg:col-span-5 orbit-card p-6 sm:p-8 bg-[var(--card)] flex flex-col items-center text-center space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
            Projected Semester Standing
          </span>

          {/* Circular Animated SVG Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="var(--border)"
                strokeWidth="11"
                fill="transparent"
              />
              <motion.circle
                cx="65"
                cy="65"
                r={radius}
                stroke={prediction.meetsTarget ? 'var(--leaf-primary)' : '#EF4444'}
                strokeWidth="11"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-black font-mono-num text-[var(--foreground)]">
                {prediction.projectedPercentage}%
              </span>
              <span className="text-[11px] font-mono-num text-[var(--muted-foreground)] font-semibold mt-0.5">
                {prediction.projectedAttended} / {prediction.projectedTotal} attended
              </span>
            </div>
          </div>

          {/* Delta and Status Pill */}
          <div className="space-y-2 w-full">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                prediction.meetsTarget
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              {prediction.meetsTarget ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Target Met (≥ {target}%)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Below Target (&lt; {target}%)</span>
                </>
              )}
            </div>

            <p className="text-xs text-[var(--foreground)] font-medium leading-relaxed">
              {baseMetrics.headline}
            </p>
          </div>
        </div>

        {/* Right: Live Interactive Sliders & Decision Engine (7 Cols) */}
        <div className="lg:col-span-7 orbit-card p-6 sm:p-8 bg-[var(--card)] space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-lg font-bold text-[var(--foreground)]">
              Simulation Controls
            </h3>
          </div>

          {/* Slider 1: Classes to Skip (Bunk) */}
          <div className="space-y-2 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Classes You Plan to Skip (Bunk)
                </label>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Simulate missed lectures
                </p>
              </div>
              <span className="text-xl font-black font-mono-num text-rose-600 dark:text-rose-400">
                +{classesToSkip}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={classesToSkip}
              onChange={(e) => setClassesToSkip(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          {/* Slider 2: Classes to Attend */}
          <div className="space-y-2 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Classes You Plan to Attend
                </label>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Simulate future attendance
                </p>
              </div>
              <span className="text-xl font-black font-mono-num text-emerald-600 dark:text-emerald-400">
                +{classesToAttend}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={classesToAttend}
              onChange={(e) => setClassesToAttend(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Direct Calculation Insights */}
          <div className="p-4 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              <span>Smart Bunk Recommendations:</span>
            </div>

            <ul className="text-xs space-y-2 text-[var(--foreground)]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>Safe Bunk Buffer:</strong>{' '}
                  {baseMetrics.canMiss > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      You can safely miss up to {baseMetrics.canMiss} more consecutive classes.
                    </span>
                  ) : (
                    <span>No buffer remaining. Missing the next class will drop you below {target}%.</span>
                  )}
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>Recovery Target:</strong>{' '}
                  {baseMetrics.mustAttend > 0 ? (
                    <span className="text-rose-500 font-bold">
                      You must attend the next {baseMetrics.mustAttend} classes consecutively to recover {target}%.
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Already meeting minimum requirements!
                    </span>
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
