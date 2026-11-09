'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  MinusCircle,
  Coffee,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { useAcademicData } from '@/hooks/useAcademicData';
import { AttendanceStatus } from '@/lib/types';

export default function CalendarPage() {
  const {
    subjects,
    timetable,
    attendance,
    tasks,
    deadlines,
    markAttendance,
  } = useAcademicData();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const formattedSelected = format(selectedDate, 'yyyy-MM-dd');
  const dayOfWeek = selectedDate.getDay();

  // Month navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Date calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Timetable slots applicable for selected date
  const slotsForDate = timetable.filter((s) => s.dayOfWeek === dayOfWeek);

  // Day attendance summary color helper
  const getDaySummary = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const records = attendance.filter((a) => a.date === dateStr);
    if (records.length === 0) return null;

    const hasHoliday = records.some((r) => r.status === 'holiday');
    if (hasHoliday) return 'holiday';

    const absents = records.filter((r) => r.status === 'absent').length;
    const presents = records.filter((r) => r.status === 'present').length;

    if (absents > 0) return 'absent';
    if (presents > 0) return 'present';
    return 'neutral';
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSheetOpen(true);
  };

  const handleMarkStatus = (
    slotId: string,
    subjectId: string,
    kind: 'theory' | 'lab',
    status: AttendanceStatus
  ) => {
    const key = `${formattedSelected}_${slotId}_${kind}`;
    markAttendance({
      date: formattedSelected,
      slotId,
      subjectId,
      kind,
      status,
      note: noteInputs[key],
    });
  };

  const handleMarkFullDayHoliday = () => {
    slotsForDate.forEach((slot) => {
      markAttendance({
        date: formattedSelected,
        slotId: slot.id,
        subjectId: slot.subjectId,
        kind: slot.kind,
        status: 'holiday',
        note: 'Declared College Holiday',
      });
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Master Attendance Calendar
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Retroactive attendance editing for any past, present, or future semester date.
          </p>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] text-[var(--foreground)]"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold min-w-[130px] text-center text-[var(--foreground)]">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] text-[var(--foreground)]"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-medium text-[var(--muted-foreground)] px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" /> All Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" /> Absences
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" /> Holiday
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Task Dot
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="orbit-card p-4 sm:p-6 bg-[var(--card)] select-none">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[var(--muted-foreground)]">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const summary = getDaySummary(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);
            const dayTasks = tasks.filter((t) => t.date === dateStr);
            const dayDeadlines = deadlines.filter((d) => d.dueDate === dateStr && d.status !== 'submitted');

            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(day)}
                className={`min-h-[64px] sm:min-h-[82px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
                  !isCurrentMonth ? 'opacity-35' : ''
                } ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/30'
                    : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-bold font-mono-num ${
                      isTodayDate
                        ? 'w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center'
                        : 'text-[var(--foreground)]'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Summary Status Dot */}
                  {summary && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        summary === 'present'
                          ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                          : summary === 'absent'
                          ? 'bg-rose-500 ring-2 ring-rose-500/20'
                          : 'bg-amber-500'
                      }`}
                    />
                  )}
                </div>

                {/* Task & Deadline Indicators */}
                <div className="flex items-center gap-1 mt-1">
                  {dayDeadlines.map((dl) => (
                    <span
                      key={dl.id}
                      className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"
                      title={`Deadline: ${dl.title}`}
                    />
                  ))}
                  {dayTasks.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className="w-1.5 h-1.5 rounded-full bg-blue-500"
                      title={t.title}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-[var(--muted-foreground)]">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Retroactive Attendance Drawer / Sheet Modal */}
      <AnimatePresence>
        {sheetOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={() => setSheetOpen(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[var(--card)] border border-[var(--border)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4"
            >
              {/* Sheet Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
                    Retroactive Attendance Editor
                  </span>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h3>
                </div>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Action: Mark Full Day Holiday */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    Mark whole-day as college holiday
                  </span>
                </div>
                <button
                  onClick={handleMarkFullDayHoliday}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/25 transition-colors"
                >
                  Set Holiday
                </button>
              </div>

              {/* Deadlines due on this date */}
              {deadlines.filter((d) => d.dueDate === formattedSelected).length > 0 && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                    Submissions Due on this Day
                  </span>
                  <div className="space-y-1.5">
                    {deadlines
                      .filter((d) => d.dueDate === formattedSelected)
                      .map((dl) => (
                        <div
                          key={dl.id}
                          className="flex items-center justify-between text-xs text-[var(--foreground)]"
                        >
                          <span className="font-semibold truncate">{dl.title}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-300">
                            {dl.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Slots List for Selected Date */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Scheduled Timetable Classes ({slotsForDate.length})
                </h4>

                {slotsForDate.length === 0 ? (
                  <p className="text-xs text-[var(--muted-foreground)] text-center py-4">
                    No classes are scheduled on this weekday in your timetable.
                  </p>
                ) : (
                  slotsForDate.map((slot) => {
                    const sub = subjects.find((s) => s.id === slot.subjectId);
                    const record = attendance.find(
                      (a) =>
                        a.date === formattedSelected &&
                        (a.slotId === slot.id || a.subjectId === slot.subjectId) &&
                        a.kind === slot.kind
                    );
                    const inputKey = `${formattedSelected}_${slot.id}_${slot.kind}`;

                    return (
                      <div
                        key={slot.id}
                        className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--background)] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[var(--foreground)]">
                                {sub?.name || 'Subject'}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                  slot.kind === 'lab'
                                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                                    : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                                }`}
                              >
                                {slot.kind}
                              </span>
                            </div>
                            <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5 font-mono-num">
                              <Clock className="w-3 h-3" /> {slot.startTime} - {slot.endTime}
                            </span>
                          </div>

                          {/* 4 Status Choice Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMarkStatus(slot.id, slot.subjectId, slot.kind, 'present')}
                              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                                record?.status === 'present'
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-emerald-500'
                              }`}
                              title="Mark Present"
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </button>

                            <button
                              onClick={() => handleMarkStatus(slot.id, slot.subjectId, slot.kind, 'absent')}
                              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                                record?.status === 'absent'
                                  ? 'bg-rose-500 text-white shadow-sm'
                                  : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-rose-500'
                              }`}
                              title="Mark Absent"
                            >
                              <X className="w-4 h-4 stroke-[3]" />
                            </button>

                            <button
                              onClick={() => handleMarkStatus(slot.id, slot.subjectId, slot.kind, 'cancelled')}
                              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                                record?.status === 'cancelled'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-amber-500'
                              }`}
                              title="Mark Cancelled"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Optional Retroactive Reason Note */}
                        <div className="pt-2 border-t border-[var(--border)]">
                          <input
                            type="text"
                            placeholder="Optional note (e.g. sick leave, lab postponed)..."
                            defaultValue={record?.note || ''}
                            onChange={(e) =>
                              setNoteInputs((prev) => ({ ...prev, [inputKey]: e.target.value }))
                            }
                            onBlur={() => {
                              if (record) {
                                markAttendance({
                                  date: formattedSelected,
                                  slotId: slot.id,
                                  subjectId: slot.subjectId,
                                  kind: slot.kind,
                                  status: record.status,
                                  note: noteInputs[inputKey] ?? record.note,
                                });
                              }
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
