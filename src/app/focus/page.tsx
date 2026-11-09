'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAcademicData } from '@/hooks/useAcademicData';

export default function FocusTimerPage() {
  const { subjects, focusSessions, logFocusSession } = useAcademicData();

  // Presets
  const PRESETS = [
    { label: '25 / 5 Focus', focusMin: 25, breakMin: 5 },
    { label: '50 / 10 Deep', focusMin: 50, breakMin: 10 },
    { label: '15 Quick', focusMin: 15, breakMin: 3 },
  ];

  const [activePreset, setActivePreset] = useState(0);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');

  const initialDuration = (mode === 'focus' ? PRESETS[activePreset].focusMin : PRESETS[activePreset].breakMin) * 60;
  const [totalSeconds, setTotalSeconds] = useState(initialDuration);
  const [remainingSeconds, setRemainingSeconds] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Background-safe timestamp persistence
  const targetEndTimeRef = useRef<number | null>(null);

  // Audio synthesis for chime
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz transformation frequency
      osc.frequency.exponentialRampToValueAtTime(264, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {
      // Audio fallback
    }
  };

  // Timer Tick using wall-clock timestamps
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + remainingSeconds * 1000;
      }

      interval = setInterval(() => {
        if (!targetEndTimeRef.current) return;
        const diff = Math.max(0, Math.round((targetEndTimeRef.current - Date.now()) / 1000));
        setRemainingSeconds(diff);

        if (diff <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          targetEndTimeRef.current = null;
          playChime();

          if (mode === 'focus') {
            logFocusSession({
              subjectId: selectedSubjectId,
              startedAt: new Date(Date.now() - totalSeconds * 1000).toISOString(),
              durationMin: Math.round(totalSeconds / 60),
              type: 'focus',
            });
            // Switch to break
            setMode('break');
            const nextBreak = PRESETS[activePreset].breakMin * 60;
            setTotalSeconds(nextBreak);
            setRemainingSeconds(nextBreak);
          } else {
            setMode('focus');
            const nextFocus = PRESETS[activePreset].focusMin * 60;
            setTotalSeconds(nextFocus);
            setRemainingSeconds(nextFocus);
          }
        }
      }, 500);
    } else {
      targetEndTimeRef.current = null;
    }

    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds, mode, activePreset, totalSeconds, selectedSubjectId, soundEnabled, logFocusSession, PRESETS]);

  const toggleStartPause = () => {
    if (!isRunning) {
      targetEndTimeRef.current = Date.now() + remainingSeconds * 1000;
      setIsRunning(true);
    } else {
      setIsRunning(false);
      targetEndTimeRef.current = null;
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    const dur = (mode === 'focus' ? PRESETS[activePreset].focusMin : PRESETS[activePreset].breakMin) * 60;
    setTotalSeconds(dur);
    setRemainingSeconds(dur);
  };

  const handleSelectPreset = (idx: number) => {
    setActivePreset(idx);
    setIsRunning(false);
    targetEndTimeRef.current = null;
    const dur = (mode === 'focus' ? PRESETS[idx].focusMin : PRESETS[idx].breakMin) * 60;
    setTotalSeconds(dur);
    setRemainingSeconds(dur);
  };

  // Minutes & Seconds formatted
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Circular gauge math
  const progressRatio = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (1 - progressRatio) * circumference;

  // Analytics Chart Data: Hours per subject
  const subjectHoursData = subjects.map((s) => {
    const minsTotal = focusSessions
      .filter((fs) => fs.subjectId === s.id)
      .reduce((sum, fs) => sum + fs.durationMin, 0);
    return {
      name: s.code,
      hours: Math.round((minsTotal / 60) * 10) / 10,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
          Focus Timer & Study Analytics
        </h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Timestamp-synced Pomodoro cycles with ambient chime, background accuracy, and subject analytics.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Timer Control Card (7 Cols) */}
        <div className="lg:col-span-7 orbit-card p-6 sm:p-8 bg-[var(--card)] flex flex-col items-center space-y-6">
          {/* Mode Badges */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[var(--background)] border border-[var(--border)]">
            <button
              onClick={() => {
                setMode('focus');
                handleReset();
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === 'focus'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Focus Session
            </button>
            <button
              onClick={() => {
                setMode('break');
                handleReset();
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === 'break'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Rest Break
            </button>
          </div>

          {/* Circular Countdown Ring */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
              {/* Track */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                stroke="var(--border)"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress */}
              <motion.circle
                cx="120"
                cy="120"
                r={radius}
                stroke={mode === 'focus' ? 'var(--leaf-primary)' : '#10B981'}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <span className="text-5xl sm:text-6xl font-black font-mono-num tracking-tighter text-[var(--foreground)]">
                {timeDisplay}
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-[var(--muted-foreground)]">
                {mode === 'focus' ? 'Focusing' : 'Resting'}
              </span>
            </div>
          </div>

          {/* Controls: Play/Pause, Reset, Sound */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-3.5 rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-all active:scale-90"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={toggleStartPause}
              className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-[var(--primary)] text-white font-bold text-base shadow-xl hover:opacity-95 active:scale-95 transition-all"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Focus</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3.5 rounded-full border border-[var(--border)] bg-[var(--background)] transition-all active:scale-90 ${
                soundEnabled ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
              }`}
              title={soundEnabled ? 'Ambient Chime Active' : 'Sound Muted'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Presets Row */}
          <div className="flex items-center gap-2 pt-2">
            {PRESETS.map((p, idx) => (
              <button
                key={p.label}
                onClick={() => handleSelectPreset(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activePreset === idx
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-bold'
                    : 'border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Subject linkage */}
          <div className="w-full max-w-xs pt-2">
            <label className="block text-[11px] font-bold text-[var(--muted-foreground)] uppercase mb-1 text-center">
              Target Course for this session
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)] text-center"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Analytics Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="orbit-card p-6 bg-[var(--card)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="font-bold text-sm text-[var(--foreground)]">Study Hours by Subject</h3>
              </div>
              <span className="text-xs text-[var(--muted-foreground)]">Logged Cycles</span>
            </div>

            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '1rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="hours" fill="var(--leaf-primary)" radius={[6, 6, 0, 0]} name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="orbit-card p-5 bg-[var(--card)] space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              <h4 className="font-bold text-xs text-[var(--foreground)]">Recent Focus History</h4>
            </div>

            <div className="space-y-2">
              {focusSessions.slice(0, 4).map((fs) => {
                const sub = subjects.find((s) => s.id === fs.subjectId);
                return (
                  <div
                    key={fs.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-[var(--foreground)]">
                        {sub?.name || 'General Focus'}
                      </span>
                    </div>
                    <span className="font-mono-num font-semibold text-[var(--muted-foreground)]">
                      {fs.durationMin} mins
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
