'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [semester, setSemester] = useState(user?.semester || 1);
  const [attendanceTarget, setAttendanceTarget] = useState(user?.attendanceTarget || 75);
  const [semStart, setSemStart] = useState(user?.semStart || new Date().toISOString().split('T')[0]);
  const [semEnd, setSemEnd] = useState(
    user?.semEnd || new Date(Date.now() + 86400000 * 120).toISOString().split('T')[0]
  );

  React.useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.college) setCollege(user.college);
      if (user.branch) setBranch(user.branch);
      if (user.semester) setSemester(user.semester);
      if (user.attendanceTarget) setAttendanceTarget(user.attendanceTarget);
    }
  }, [user]);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      college,
      branch,
      semester: Number(semester),
      attendanceTarget: Number(attendanceTarget),
      semStart,
      semEnd,
      isOnboarded: true,
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 flex items-center justify-center border border-[var(--primary)]/30">
            <MonsteraLeaf className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--foreground)]">Orbit</h1>
            <p className="text-xs text-[var(--muted-foreground)]">by ByteCraft Studio</p>
          </div>
        </div>

        {/* Wizard Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="orbit-card p-6 sm:p-8 bg-[var(--card)]"
        >
          {/* Progress dots */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1 ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                }`}
              >
                1
              </span>
              <span className="text-xs font-semibold text-[var(--foreground)]">Profile</span>
            </div>
            <div className="h-0.5 w-12 bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2 ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                }`}
              >
                2
              </span>
              <span className="text-xs font-semibold text-[var(--foreground)]">Academic Goals</span>
            </div>
          </div>

          <form onSubmit={handleFinish} className="space-y-4">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amrut Patil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. RVCE, PES University, IIT Bombay"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Branch / Major
                    </label>
                    <input
                      type="text"
                      required
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Current Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
                >
                  <span>Continue to Semester Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[var(--foreground)]">
                      Minimum Attendance Target
                    </label>
                    <span className="text-sm font-black font-mono-num text-[var(--primary)]">
                      {attendanceTarget}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="1"
                    value={attendanceTarget}
                    onChange={(e) => setAttendanceTarget(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                    Standard college minimum is 75% for exam eligibility.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Semester Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={semStart}
                      onChange={(e) => setSemStart(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                      Semester End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={semEnd}
                      onChange={(e) => setSemEnd(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Launch My Semester</span>
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
