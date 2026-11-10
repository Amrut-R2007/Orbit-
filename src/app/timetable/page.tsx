'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Clock,
  Copy,
  Trash2,
  Edit3,
  X,
  Save,
  Check,
  Loader2,
} from 'lucide-react';
import { useAcademicData } from '@/hooks/useAcademicData';
import { TimetableSlot } from '@/lib/types';

export default function TimetablePage() {
  const {
    subjects,
    timetable,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    duplicateDaySlots,
    saveAllTimetable,
    isSaving,
    hasUnsavedChanges,
  } = useAcademicData();

  const [activeDay, setActiveDay] = useState(1); // 1 = Monday
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Form State
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [kind, setKind] = useState<'theory' | 'lab'>('theory');
  const [room, setRoom] = useState('CS-301');

  // Copy day state
  const [copyTargetDay, setCopyTargetDay] = useState(2);
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  const DAYS = [
    { num: 1, name: 'Monday', short: 'Mon' },
    { num: 2, name: 'Tuesday', short: 'Tue' },
    { num: 3, name: 'Wednesday', short: 'Wed' },
    { num: 4, name: 'Thursday', short: 'Thu' },
    { num: 5, name: 'Friday', short: 'Fri' },
    { num: 6, name: 'Saturday', short: 'Sat' },
  ];

  const currentDaySlots = timetable
    .filter((s) => s.dayOfWeek === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const openAddSlot = () => {
    setEditingSlotId(null);
    setSubjectId(subjects[0]?.id || '');
    setStartTime('09:00');
    setEndTime('10:00');
    setKind('theory');
    setRoom('CS-301');
    setModalOpen(true);
  };

  const openEditSlot = (slot: TimetableSlot) => {
    setEditingSlotId(slot.id);
    setSubjectId(slot.subjectId);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setKind(slot.kind);
    setRoom(slot.room || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlotId) {
      updateTimetableSlot(editingSlotId, {
        subjectId,
        startTime,
        endTime,
        kind,
        room,
      });
    } else {
      addTimetableSlot({
        subjectId,
        dayOfWeek: activeDay,
        startTime,
        endTime,
        kind,
        room,
      });
    }
    setModalOpen(false);
  };

  const handleSaveTimetable = async () => {
    const res = await saveAllTimetable();
    if (res.success) {
      setSaveFeedback(`All ${res.count} timetable slots saved to cloud!`);
      setTimeout(() => setSaveFeedback(null), 4000);
    } else {
      setSaveFeedback('Error saving timetable. Slots remain safely cached locally.');
    }
  };

  const handleDuplicate = () => {
    duplicateDaySlots(activeDay, copyTargetDay);
    setCopyModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Timetable Builder
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Weekly grid from Monday to Saturday. Multi-hour lab slots and fast day copying.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Explicit Save Timetable Button */}
          <button
            onClick={handleSaveTimetable}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 ${
              hasUnsavedChanges
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Explicitly save timetable slots to cloud database"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Timetable</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCopyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] text-xs font-bold text-[var(--foreground)] shadow-sm active:scale-95 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Copy Day</span>
          </button>

          <button
            onClick={openAddSlot}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Save Feedback Banner */}
      {saveFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{saveFeedback}</span>
          </div>
          <button onClick={() => setSaveFeedback(null)} className="text-xs opacity-75 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Weekday Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 p-1 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        {DAYS.map((day) => {
          const isActive = activeDay === day.num;
          const slotCount = timetable.filter((s) => s.dayOfWeek === day.num).length;
          return (
            <button
              key={day.num}
              onClick={() => setActiveDay(day.num)}
              className={`flex-1 min-w-[70px] sm:min-w-[90px] py-2.5 px-2 rounded-xl text-xs font-bold transition-all relative ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
              }`}
            >
              <span>{day.short}</span>
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--border)] text-[var(--muted-foreground)]'
                }`}
              >
                {slotCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slot list for active day */}
      <div className="space-y-3">
        {currentDaySlots.length === 0 ? (
          <div className="orbit-card p-10 text-center space-y-3 bg-[var(--card)]">
            <Clock className="w-10 h-10 mx-auto text-[var(--muted-foreground)]/50" />
            <h3 className="font-bold text-[var(--foreground)]">No slots on this day</h3>
            <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
              Add your lecture and lab hours or copy from another weekday.
            </p>
            <button
              onClick={openAddSlot}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold"
            >
              Add First Slot
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentDaySlots.map((slot) => {
              const sub = subjects.find((s) => s.id === slot.subjectId);
              return (
                <motion.div
                  key={slot.id}
                  layout
                  className="orbit-card p-4 bg-[var(--card)] space-y-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-10 rounded-full"
                        style={{ backgroundColor: sub?.color || 'var(--primary)' }}
                      />
                      <div>
                        <h4 className="font-bold text-sm text-[var(--foreground)]">
                          {sub?.name || 'Class Slot'}
                        </h4>
                        <span className="text-[11px] font-mono-num text-[var(--muted-foreground)]">
                          {sub?.code || 'GEN'}
                        </span>
                      </div>
                    </div>

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

                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1.5 font-mono-num font-semibold text-[var(--foreground)]">
                      <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                    {slot.room && <span className="font-medium text-xs">Room {slot.room}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 pt-1">
                    <button
                      onClick={() => openEditSlot(slot)}
                      className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                      title="Edit Slot"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTimetableSlot(slot.id)}
                      className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-rose-500 hover:bg-rose-500/10"
                      title="Delete Slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Slot Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  {editingSlotId ? 'Edit Timetable Slot' : `Add Slot (${DAYS.find(d => d.num === activeDay)?.name})`}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-[var(--muted-foreground)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Class Type
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => setKind('theory')}
                        className={`py-1.5 rounded-lg text-xs font-bold ${
                          kind === 'theory' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        Theory
                      </button>
                      <button
                        type="button"
                        onClick={() => setKind('lab')}
                        className={`py-1.5 rounded-lg text-xs font-bold ${
                          kind === 'lab' ? 'bg-purple-600 text-white' : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        Lab (2-3h)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Classroom / Lab Room
                    </label>
                    <input
                      type="text"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      placeholder="e.g. CS-301 or Lab 4"
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--muted-foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-90"
                  >
                    Save Slot
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Copy Day Modal */}
      <AnimatePresence>
        {copyModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setCopyModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold text-[var(--foreground)]">Copy Day Schedule</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Copy all timetable slots from {DAYS.find(d => d.num === activeDay)?.name} to:
              </p>

              <select
                value={copyTargetDay}
                onChange={(e) => setCopyTargetDay(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)]"
              >
                {DAYS.filter(d => d.num !== activeDay).map((d) => (
                  <option key={d.num} value={d.num}>
                    {d.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setCopyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--muted-foreground)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDuplicate}
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md"
                >
                  Confirm Copy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
