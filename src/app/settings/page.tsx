'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Moon,
  Sun,
  Shield,
  Laptop,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAcademicData } from '@/hooks/useAcademicData';
import { useAppStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const {
    subjects,
    timetable,
    attendance,
    exams,
    tasks,
    deadlines,
  } = useAcademicData();
  const { theme, setTheme, motionPreference, setMotionPreference } = useAppStore();
  const router = useRouter();

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [semester, setSemester] = useState(user?.semester || 1);
  const [attendanceTarget, setAttendanceTarget] = useState(user?.attendanceTarget || 75);
  const [semStart, setSemStart] = useState(user?.semStart || '2026-08-01');
  const [semEnd, setSemEnd] = useState(user?.semEnd || '2026-12-15');

  React.useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.college) setCollege(user.college);
      if (user.branch) setBranch(user.branch);
      if (user.semester) setSemester(user.semester);
      if (user.attendanceTarget) setAttendanceTarget(user.attendanceTarget);
      if (user.semStart) setSemStart(user.semStart);
      if (user.semEnd) setSemEnd(user.semEnd);
    }
  }, [user]);

  // Push notification toggles
  const [notifClass15, setNotifClass15] = useState(user?.notifications?.classes ?? true);
  const [notifBelowTarget, setNotifBelowTarget] = useState(user?.notifications?.attendance ?? true);
  const [notifExam3Days, setNotifExam3Days] = useState(user?.notifications?.exams ?? true);
  const [notifDeadlineTomorrow, setNotifDeadlineTomorrow] = useState(user?.notifications?.deadlines ?? true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      college,
      branch,
      semester: Number(semester),
      attendanceTarget: Number(attendanceTarget),
      semStart,
      semEnd,
      motion: motionPreference,
      notifications: {
        classes: notifClass15,
        attendance: notifBelowTarget,
        exams: notifExam3Days,
        deadlines: notifDeadlineTomorrow,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Export Data as JSON
  const handleExportJSON = () => {
    const backup = {
      profile: user,
      subjects,
      timetable,
      attendance,
      exams,
      tasks,
      deadlines,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbit-academic-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Attendance CSV
  const handleExportAttendanceCSV = () => {
    const headers = ['Date', 'SubjectId', 'Kind', 'Status', 'Note', 'UpdatedAt'];
    const rows = attendance.map((a) => [
      a.date,
      a.subjectId,
      a.kind,
      a.status,
      `"${a.note || ''}"`,
      a.updatedAt,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbit-attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of Orbit?')) {
      await logout();
      router.push('/');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Manage your student profile, academic semester goals, notifications, and data backups.
        </p>
      </div>

      {/* Profile & Academic Goals */}
      <form onSubmit={handleSaveProfile} className="orbit-card p-6 bg-[var(--card)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-base text-[var(--foreground)]">Student Profile</h3>
          </div>
          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
              College / University
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
              Department / Branch
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
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

        {/* Target Attendance & Dates */}
        <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[var(--foreground)]">
                Attendance Target Threshold
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                Semester Start
              </label>
              <input
                type="date"
                value={semStart}
                onChange={(e) => setSemStart(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-bold text-[var(--foreground)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
                Semester End
              </label>
              <input
                type="date"
                value={semEnd}
                onChange={(e) => setSemEnd(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-bold text-[var(--foreground)]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-95"
        >
          Save Profile Updates
        </button>
      </form>

      {/* Visual Theme Settings */}
      <div className="orbit-card p-6 bg-[var(--card)] space-y-4">
        <h3 className="font-bold text-base text-[var(--foreground)]">Visual Theme</h3>
        <p className="text-xs text-[var(--muted-foreground)]">
          Switch between Warm Cream (Peach leaves) and Midnight Charcoal (Purple leaves).
        </p>
        <ThemeToggle />
      </div>

      {/* Ambient Background Motion Control */}
      <div className="orbit-card p-6 bg-[var(--card)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[var(--foreground)]">Ambient Background Motion</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Subtle leaf drift and swaying background atmosphere tuned to each section.
            </p>
          </div>
          <span className="text-xs font-bold font-mono-num uppercase px-2.5 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
            {motionPreference}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
          {(['full', 'reduced', 'off'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setMotionPreference(mode);
                updateProfile({ motion: mode });
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                motionPreference === mode
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {mode} Motion
            </button>
          ))}
        </div>
      </div>

      {/* Smart Notifications (Firebase Cloud Messaging triggers) */}
      <div className="orbit-card p-6 bg-[var(--card)] space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-bold text-base text-[var(--foreground)]">Smart Reminders</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              title: 'Class Starting in 15 Minutes',
              desc: 'Alerts you before lecture or lab starts based on your daily timetable.',
              checked: notifClass15,
              toggle: () => setNotifClass15(!notifClass15),
            },
            {
              title: 'Attendance Drops Below Target',
              desc: 'Immediate warning whenever a course percentage dips below your goal.',
              checked: notifBelowTarget,
              toggle: () => setNotifBelowTarget(!notifBelowTarget),
            },
            {
              title: 'Exam in 3 Days Reminder',
              desc: 'Countdown notification to prepare syllabus checklist for CIE assessments.',
              checked: notifExam3Days,
              toggle: () => setNotifExam3Days(!notifExam3Days),
            },
            {
              title: 'Assignment Due Tomorrow',
              desc: 'Urgent reminder to submit assignments and laboratory records.',
              checked: notifDeadlineTomorrow,
              toggle: () => setNotifDeadlineTomorrow(!notifDeadlineTomorrow),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--background)] border border-[var(--border)]"
            >
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">{item.title}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={item.toggle}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  item.checked ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    item.checked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="orbit-card p-6 bg-[var(--card)] space-y-4">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-bold text-base text-[var(--foreground)]">Data Export & Portability</h3>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          Export your complete semester records, attendance logs, and marks to JSON or CSV format.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportAttendanceCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)] hover:border-[var(--primary)] shadow-sm"
          >
            <Download className="w-4 h-4 text-[var(--primary)]" />
            <span>Export Attendance CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)] hover:border-[var(--primary)] shadow-sm"
          >
            <Download className="w-4 h-4 text-[var(--primary)]" />
            <span>Export Full JSON Archive</span>
          </button>
        </div>
      </div>

      {/* Account & Session */}
      <div className="orbit-card p-6 bg-[var(--card)] border-rose-500/30 space-y-4">
        <h3 className="font-bold text-base text-[var(--foreground)]">Account & Session</h3>
        <p className="text-xs text-[var(--muted-foreground)]">
          Signed in as <span className="font-semibold text-[var(--foreground)]">{user?.email || 'Student'}</span> (UID: {user?.uid?.slice(0, 8)}...).
        </p>

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
