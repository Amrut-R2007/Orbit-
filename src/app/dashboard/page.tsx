'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  MinusCircle,
  Plus,
  Trash2,
  AlertTriangle,
  Flame,
  CalendarDays,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAcademicData } from '@/hooks/useAcademicData';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';
import { AttendanceStatus } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    subjects,
    timetable,
    attendance,
    tasks,
    deadlines,
    exams,
    streaks,
    markAttendance,
    addTask,
    toggleTask,
    deleteTask,
    getSubjectMetrics,
    getOverallMetrics,
  } = useAcademicData();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDayOffset, setSelectedDayOffset] = useState(0); // 0 = Today

  // Current Date logic
  const now = new Date(Date.now() + selectedDayOffset * 86400000);
  const todayDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ...
  const formattedToday = now.toISOString().split('T')[0];
  const displayDateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Today's classes from timetable
  const todaySlots = timetable.filter((slot) => slot.dayOfWeek === todayDayOfWeek);

  // Overall Attendance Metrics
  const overallMetrics = getOverallMetrics();

  // Subjects below target
  const subjectsBelowTarget = subjects.filter((s) => {
    const met = getSubjectMetrics(s.id);
    return met.total > 0 && met.percentage < (user?.attendanceTarget || 75);
  });

  // Upcoming Exam Countdown
  const nextExam = exams[0];

  // Today's tasks
  const todayTasks = tasks.filter((t) => t.date === formattedToday || !t.date);
  const tasksCompletedCount = todayTasks.filter((t) => t.done).length;

  const handleMark = (slotId: string, subjectId: string, kind: 'theory' | 'lab', status: AttendanceStatus) => {
    markAttendance({
      date: formattedToday,
      slotId,
      subjectId,
      kind,
      status,
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      date: formattedToday,
      done: false,
      priority: 'medium',
    });
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Greeting & Streak Hero Header */}
      <div className="orbit-card p-6 sm:p-8 bg-[var(--card)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative leaf background in corner */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 opacity-15 pointer-events-none">
          <TaroLeaf className="w-full h-full" />
        </div>

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              {displayDateStr}
            </span>
            {selectedDayOffset !== 0 && (
              <button
                onClick={() => setSelectedDayOffset(0)}
                className="text-[11px] underline text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                (Reset to Today)
              </button>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
            <span className="inline-flex items-center gap-1.5 ml-2.5 text-sm sm:text-base font-bold text-orange-500 font-mono-num align-middle bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
              <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
              {streaks.current}d streak
            </span>
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {overallMetrics.headline}
          </p>
        </div>

        {/* Streak Counter Box */}
        <Link
          href="/streaks"
          className="z-10 flex items-center gap-4 px-4 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/15 transition-all group active:scale-95"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 fill-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black font-mono-num text-orange-600 dark:text-orange-400">
                {streaks.current}
              </span>
              <span className="text-xs font-bold text-orange-600/80 uppercase">Days</span>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] font-medium">
              Daily Academic Streak
            </p>
          </div>
        </Link>
      </div>

      {/* New Semester Setup Prompt if 0 subjects */}
      {subjects.length === 0 && (
        <div className="orbit-card p-6 bg-[var(--card)] border border-[var(--primary)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-[var(--foreground)]">Welcome to your semester workspace</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              You haven&apos;t added any subjects yet. Add your registered courses and lab credits to begin tracking attendance, scheduling classes, and logging marks.
            </p>
          </div>
          <Link
            href="/subjects"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-sm whitespace-nowrap hover:opacity-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Subject</span>
          </Link>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Attendance */}
        <div className="orbit-card p-4 sm:p-5 bg-[var(--card)] space-y-1">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Overall Attendance</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono-num text-[var(--foreground)]">
              {overallMetrics.percentage}%
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                overallMetrics.percentage >= (user?.attendanceTarget || 75)
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              Goal: {user?.attendanceTarget || 75}%
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)] truncate">
            {overallMetrics.attended} of {overallMetrics.total} classes attended
          </p>
        </div>

        {/* Subjects Below Target (Red Flag) */}
        <div className="orbit-card p-4 sm:p-5 bg-[var(--card)] space-y-1">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Under Target Flag</span>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-2xl sm:text-3xl font-black font-mono-num ${
                subjectsBelowTarget.length > 0 ? 'text-rose-500' : 'text-emerald-500'
              }`}
            >
              {subjectsBelowTarget.length}
            </span>
            {subjectsBelowTarget.length > 0 ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Action
              </span>
            ) : (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                Safe
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)] truncate">
            {subjectsBelowTarget.length > 0
              ? `${subjectsBelowTarget.map((s) => s.code).join(', ')} need recovery`
              : 'All subjects above minimum target'}
          </p>
        </div>

        {/* Upcoming Exam Countdown */}
        <div className="orbit-card p-4 sm:p-5 bg-[var(--card)] space-y-1">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Upcoming Assessment</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-[var(--foreground)] truncate">
              {nextExam ? nextExam.type.split(' ')[0] : 'None'}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
              Active
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)] truncate">
            {nextExam?.startDate || 'Syllabus preparation ongoing'}
          </p>
        </div>

        {/* Tasks Done Today */}
        <div className="orbit-card p-4 sm:p-5 bg-[var(--card)] space-y-1">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">Tasks Completed</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono-num text-[var(--foreground)]">
              {tasksCompletedCount}/{todayTasks.length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
              {todayTasks.length > 0
                ? `${Math.round((tasksCompletedCount / todayTasks.length) * 100)}%`
                : '0%'}
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Focus goal: 100% completion
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Classes & Today's Tasks */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Today's Classes List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-bold text-[var(--foreground)]">Today&apos;s Classes</h2>
            </div>
            <Link
              href="/timetable"
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>Full Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {todaySlots.length === 0 ? (
            /* Empty state */
            <div className="orbit-card p-8 bg-[var(--card)] text-center space-y-3">
              <div className="w-16 h-16 mx-auto opacity-70">
                <MonsteraLeaf className="w-full h-full" />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">No classes scheduled today!</h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
                Enjoy your break or use the Pomodoro timer to prepare for upcoming CIE tests.
              </p>
              <Link
                href="/focus"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-sm"
              >
                <Clock className="w-3.5 h-3.5" /> Start Focus Session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot) => {
                const sub = subjects.find((s) => s.id === slot.subjectId);
                const record = attendance.find(
                  (a) =>
                    a.date === formattedToday &&
                    (a.slotId === slot.id || a.subjectId === slot.subjectId) &&
                    a.kind === slot.kind
                );
                const metrics = sub ? getSubjectMetrics(sub.id, slot.kind) : null;

                return (
                  <motion.div
                    key={slot.id}
                    layout
                    className="orbit-card p-4 bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2.5 h-12 rounded-full flex-shrink-0"
                        style={{ backgroundColor: sub?.color || 'var(--primary)' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[var(--foreground)]">
                            {sub?.name || 'Class Slot'}
                          </h3>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              slot.kind === 'lab'
                                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                                : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                            }`}
                          >
                            {slot.kind}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-mono-num">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </span>
                          {slot.room && <span>• {slot.room}</span>}
                          {metrics && (
                            <span
                              className={`font-mono-num font-semibold ${
                                metrics.percentage < (user?.attendanceTarget || 75)
                                  ? 'text-rose-500 font-bold'
                                  : 'text-[var(--foreground)]'
                              }`}
                            >
                              • {metrics.percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* One-Tap Present / Absent / Cancelled Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleMark(slot.id, slot.subjectId, slot.kind, 'present')}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          record?.status === 'present'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-emerald-500 hover:border-emerald-500/40'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Present</span>
                      </button>

                      <button
                        onClick={() => handleMark(slot.id, slot.subjectId, slot.kind, 'absent')}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          record?.status === 'absent'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-rose-500 hover:border-rose-500/40'
                        }`}
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Absent</span>
                      </button>

                      <button
                        onClick={() => handleMark(slot.id, slot.subjectId, slot.kind, 'cancelled')}
                        title="Class Cancelled / Teacher on Leave"
                        className={`p-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          record?.status === 'cancelled'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-amber-500 hover:border-amber-500/40'
                        }`}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today's Tasks & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-bold text-[var(--foreground)]">Today&apos;s Focus Tasks</h2>
            </div>
            <span className="text-xs text-[var(--muted-foreground)] font-mono-num font-semibold">
              {tasksCompletedCount}/{todayTasks.length} Done
            </span>
          </div>

          <div className="orbit-card p-4 sm:p-5 bg-[var(--card)] space-y-4">
            {/* Add Task Input */}
            <form onSubmit={handleCreateTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add daily academic task..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Tasks list */}
            {todayTasks.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)] text-center py-4">
                No tasks logged for today. Stay organized and add one above!
              </p>
            ) : (
              <div className="space-y-2">
                {todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[var(--border)]/70 hover:border-[var(--border)] bg-[var(--background)]/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleTask(t.id)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          t.done
                            ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                            : 'border-[var(--border)] bg-[var(--card)]'
                        }`}
                      >
                        {t.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs sm:text-sm truncate ${
                          t.done
                            ? 'line-through text-[var(--muted-foreground)]'
                            : 'text-[var(--foreground)] font-medium'
                        }`}
                      >
                        {t.title}
                      </span>
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1 text-[var(--muted-foreground)] hover:text-rose-500 transition-colors"
                      aria-label="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Surfaced Academic Deadlines */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Upcoming Deadlines</span>
              </span>
              <Link
                href="/deadlines"
                className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {deadlines
                .filter((d) => d.status !== 'submitted')
                .slice(0, 3)
                .map((d) => {
                  const sub = subjects.find((s) => s.id === d.subjectId);
                  const isOverdue = d.dueDate < formattedToday;
                  const isDueToday = d.dueDate === formattedToday;

                  return (
                    <div
                      key={d.id}
                      className="orbit-card p-3 bg-[var(--card)] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[var(--foreground)] truncate">{d.title}</p>
                        <p className="text-[11px] text-[var(--muted-foreground)] truncate">
                          {sub?.code || 'Course'} • Due: {d.dueDate}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase flex-shrink-0 ${
                          isOverdue
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : isDueToday
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                        }`}
                      >
                        {isOverdue ? 'Overdue' : isDueToday ? 'Due Today' : d.priority}
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
