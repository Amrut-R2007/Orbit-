'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockAlert,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  BellRing,
} from 'lucide-react';
import { useAcademicData } from '@/hooks/useAcademicData';
import { Deadline } from '@/lib/types';

export default function DeadlinesPage() {
  const { subjects, deadlines, addDeadline, updateDeadlineStatus } = useAcademicData();

  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'submitted'>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');

  // Due urgency badge calculation
  const getDueBadge = (dueDateStr: string, status: string) => {
    if (status === 'submitted') {
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
          Submitted ✓
        </span>
      );
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (dueDateStr < todayStr) {
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Overdue
        </span>
      );
    }
    if (dueDateStr === todayStr) {
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
          <Clock className="w-3 h-3" /> Due Today
        </span>
      );
    }
    if (dueDateStr === tomorrowStr) {
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold">
          Due Tomorrow
        </span>
      );
    }

    return (
      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-mono-num font-semibold">
        Due {dueDateStr}
      </span>
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addDeadline({
      title: title.trim(),
      subjectId,
      dueDate,
      priority,
      status: 'todo',
    });
    setTitle('');
    setModalOpen(false);
  };

  const filteredDeadlines = deadlines.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Academic Deadlines & Submissions
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Assignments, project milestones, and laboratory record submissions.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Deadline</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All Submissions' },
          { key: 'todo', label: 'To Do' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'submitted', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filter === tab.key
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        {filteredDeadlines.length === 0 ? (
          <div className="orbit-card p-12 text-center space-y-3 bg-[var(--card)]">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/60" />
            <h3 className="font-bold text-[var(--foreground)]">All clear! No pending submissions</h3>
            <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
              You have completed all assignments and laboratory records in this view.
            </p>
          </div>
        ) : (
          filteredDeadlines.map((dl) => {
            const sub = subjects.find((s) => s.id === dl.subjectId);

            return (
              <motion.div
                key={dl.id}
                layout
                className="orbit-card p-4 sm:p-5 bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-2.5 h-12 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sub?.color || 'var(--primary)' }}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)]">
                        {dl.title}
                      </h3>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          dl.priority === 'high'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {dl.priority} Priority
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      <span className="font-semibold text-[var(--foreground)]">
                        {sub?.name || 'General Course'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-mono-num">{dl.dueDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Badge & Status Select */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {getDueBadge(dl.dueDate, dl.status)}

                  <select
                    value={dl.status}
                    onChange={(e) =>
                      updateDeadlineStatus(
                        dl.id,
                        e.target.value as 'todo' | 'in_progress' | 'submitted'
                      )
                    }
                    className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)] focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                  </select>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Deadline Modal */}
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
                <h3 className="text-lg font-bold text-[var(--foreground)]">Add Academic Deadline</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                    Title / Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab Record 4 Submission"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Subject
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)]"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--muted-foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-90"
                  >
                    Create Submission
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
