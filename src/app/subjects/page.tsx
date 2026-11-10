'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  FlaskConical,
  Award,
  AlertCircle,
  X,
  Check,
  Save,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAcademicData } from '@/hooks/useAcademicData';
import { Subject } from '@/lib/types';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';

export default function SubjectsPage() {
  const { user } = useAuth();
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    saveAllSubjects,
    getSubjectMetrics,
    isSaving,
    hasUnsavedChanges,
    lastSaved,
  } = useAcademicData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(3);
  const [hasLab, setHasLab] = useState(false);
  const [labCredits, setLabCredits] = useState(1.5);
  const [faculty, setFaculty] = useState('');
  const [color, setColor] = useState('#F4A261');

  const COLOR_PALETTE = ['#F4A261', '#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#EAB308'];

  // Total credits calculation
  const totalSemesterCredits = subjects.reduce((sum, s) => {
    return sum + s.credits + (s.hasLab && s.labCredits ? s.labCredits : 0);
  }, 0);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCode('');
    setCredits(3);
    setHasLab(false);
    setLabCredits(1.5);
    setFaculty('');
    setColor('#F4A261');
    setModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingId(sub.id);
    setName(sub.name);
    setCode(sub.code);
    setCredits(sub.credits);
    setHasLab(sub.hasLab);
    setLabCredits(sub.labCredits || 1.5);
    setFaculty(sub.faculty || '');
    setColor(sub.color);
    setModalOpen(true);
  };

  const handleSaveAll = async () => {
    setSaveSuccess(null);
    setSaveError(null);
    const res = await saveAllSubjects();
    if (res.success) {
      setSaveSuccess(`All ${res.count} subjects saved to cloud successfully!`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } else {
      setSaveError(
        `Cloud sync error: ${res.error || 'Failed to save'}. Your subjects remain safely saved locally on this device.`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalSaving(true);
    setSaveSuccess(null);
    setSaveError(null);
    try {
      const subjectPayload = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        credits: Number(credits),
        hasLab,
        labCredits: hasLab ? Number(labCredits) : 0,
        faculty: faculty.trim(),
        color,
        type: (hasLab ? 'theory+lab' : 'theory') as 'theory' | 'theory+lab',
      };

      if (editingId) {
        await updateSubject(editingId, subjectPayload);
      } else {
        await addSubject(subjectPayload);
      }
      setModalOpen(false);
      setSaveSuccess(`Subject "${name}" saved! Click "Save Changes" to sync with cloud.`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setSaveError('Could not save subject. Your change was not added.');
    } finally {
      setModalSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Total Credits Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Academic Courses & Subjects
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Configure courses with theory and laboratory attendance streams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Total Credits Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--foreground)] text-xs font-bold shadow-sm">
            <Award className="w-4 h-4 text-[var(--primary)]" />
            <span>Total: <span className="font-mono-num">{totalSemesterCredits}</span> Credits</span>
          </div>

          {/* Explicit Save to Cloud Button */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 ${
              hasUnsavedChanges
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Explicitly save all subjects to your cloud database"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Cloud...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{hasUnsavedChanges ? 'Save Changes' : 'Save to Cloud'}</span>
              </>
            )}
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Success Feedback Banner */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
          <button onClick={() => setSaveSuccess(null)} className="text-xs opacity-75 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Error Feedback Banner */}
      {saveError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
          <button onClick={() => setSaveError(null)} className="text-xs opacity-75 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Unsaved Changes Warning */}
      {hasUnsavedChanges && !saveSuccess && !saveError && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>You have unsaved changes. Click &quot;Save Changes&quot; to guarantee cloud persistence.</span>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold self-start sm:self-auto hover:bg-amber-600"
          >
            {isSaving ? 'Saving...' : 'Save Now'}
          </button>
        </div>
      )}

      {/* Subject Cards Grid */}
      {subjects.length === 0 ? (
        <div className="orbit-card p-12 text-center space-y-3 bg-[var(--card)]">
          <div className="w-20 h-20 mx-auto opacity-70">
            <MonsteraLeaf className="w-full h-full" />
          </div>
          <h3 className="font-bold text-lg text-[var(--foreground)]">No subjects created yet</h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            Add your semester subjects to start tracking lecture and lab attendance automatically.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold"
          >
            Add First Subject
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {subjects.map((sub) => {
            const theoryMet = getSubjectMetrics(sub.id, 'theory');
            const labMet = sub.hasLab ? getSubjectMetrics(sub.id, 'lab') : null;
            const target = user?.attendanceTarget || 75;

            return (
              <motion.div
                key={sub.id}
                layout
                className="orbit-card p-5 bg-[var(--card)] space-y-4 relative overflow-hidden"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm"
                      style={{ backgroundColor: sub.color }}
                    >
                      {sub.code.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)]">
                        {sub.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-0.5">
                        <span className="font-mono-num font-semibold">{sub.code}</span>
                        <span>•</span>
                        <span>{sub.credits} Theory Cr</span>
                        {sub.hasLab && (
                          <>
                            <span>•</span>
                            <span className="text-purple-600 dark:text-purple-400 font-medium">
                              +{sub.labCredits} Lab Cr
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(sub)}
                      className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                      title="Edit Subject"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSubject(sub.id)}
                      className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-rose-500 hover:bg-rose-500/10"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Faculty if present */}
                {sub.faculty && (
                  <p className="text-xs text-[var(--muted-foreground)] italic">
                    Faculty: {sub.faculty}
                  </p>
                )}

                {/* Theory Attendance Stream Card */}
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-xs font-bold text-[var(--foreground)]">Theory Attendance</span>
                    </div>
                    <span
                      className={`text-sm font-black font-mono-num ${
                        theoryMet.percentage < target ? 'text-rose-500' : 'text-emerald-500'
                      }`}
                    >
                      {theoryMet.percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        theoryMet.percentage < target ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, theoryMet.percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                    <span className="font-mono-num">
                      {theoryMet.attended} of {theoryMet.total} attended
                    </span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {theoryMet.canMiss > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Can miss {theoryMet.canMiss} classes
                        </span>
                      ) : theoryMet.mustAttend > 0 ? (
                        <span className="text-rose-500 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Must attend next {theoryMet.mustAttend}
                        </span>
                      ) : (
                        <span>On target edge</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Separate Lab Attendance Stream Card when hasLab is ON */}
                {sub.hasLab && labMet && (
                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                          Laboratory Attendance
                        </span>
                      </div>
                      <span
                        className={`text-sm font-black font-mono-num ${
                          labMet.percentage < target ? 'text-rose-500' : 'text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {labMet.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          labMet.percentage < target ? 'bg-rose-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min(100, labMet.percentage)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                      <span className="font-mono-num">
                        {labMet.attended} of {labMet.total} labs attended
                      </span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        {labMet.canMiss > 0 ? (
                          <span>Can miss {labMet.canMiss} labs</span>
                        ) : labMet.mustAttend > 0 ? (
                          <span className="text-rose-500 font-bold">
                            Must attend next {labMet.mustAttend} labs
                          </span>
                        ) : (
                          <span>On target edge</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
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
                  {editingId ? 'Edit Subject' : 'Add New Subject'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. 22CS42"
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Theory Credits
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="10"
                      required
                      value={credits}
                      onChange={(e) => setCredits(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                {/* Has Lab Toggle Switch */}
                <div className="p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--foreground)]">Has Laboratory Component</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        Track lab attendance separately from theory lectures
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasLab(!hasLab)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        hasLab ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          hasLab ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {hasLab && (
                    <div className="pt-2 border-t border-[var(--border)]">
                      <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                        Lab Credits
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="5"
                        value={labCredits}
                        onChange={(e) => setLabCredits(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                    Faculty (Optional)
                  </label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    placeholder="e.g. Prof. Ramesh K."
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                {/* Color Tag Picker */}
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1.5">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
                        style={{ backgroundColor: c }}
                      >
                        {color === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSaving}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-90 disabled:opacity-50"
                  >
                    {modalSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{modalSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Save Subject'}</span>
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
