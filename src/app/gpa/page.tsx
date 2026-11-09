'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  TrendingUp,
  HelpCircle,
  Plus,
  Trash2,
  Calculator,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  RVCE_GRADING_SCALE,
  marksToGrade,
  calculateSGPA,
  calculateCGPA,
  calculateRequiredSGPA,
  CourseGradeEntry,
  SemesterRecord,
} from '@/lib/rvce-grading';
import { useAuth } from '@/context/AuthContext';
import { useAcademicData } from '@/hooks/useAcademicData';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const DEFAULT_SEMESTERS: SemesterRecord[] = [1, 2, 3, 4, 5, 6, 7, 8].map((num) => ({
  number: num,
  courses: [],
}));

export default function GPACalculatorPage() {
  const { user } = useAuth();
  const { subjects } = useAcademicData();
  const uid = user?.uid;

  const [semesters, setSemesters] = useState<SemesterRecord[]>(DEFAULT_SEMESTERS);
  const [activeSemNum, setActiveSemNum] = useState<number>(user?.semester || 1);

  // Firestore real-time listener for GPA
  useEffect(() => {
    if (!uid || !isFirebaseConfigured) return;
    const unsub = onSnapshot(doc(db, 'users', uid, 'gpa', 'records'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().semesters) {
        setSemesters(docSnap.data().semesters);
      }
    });
    return () => unsub();
  }, [uid]);

  const saveSemesters = async (newSemesters: SemesterRecord[]) => {
    setSemesters(newSemesters);
    if (uid && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'users', uid, 'gpa', 'records'), { semesters: newSemesters }, { merge: true });
      } catch (err) {
        console.error('Failed to autosave GPA records:', err);
      }
    }
  };

  // What-If Target Mode State
  const [targetCGPA, setTargetCGPA] = useState<number>(9.0);

  // Active semester data
  const activeSemester =
    semesters.find((s) => s.number === activeSemNum) || {
      number: activeSemNum,
      courses: [],
    };

  // Calculations
  const activeSGPA = calculateSGPA(activeSemester.courses);
  const overallCGPA = calculateCGPA(semesters);

  // Past cumulative credits & points up to previous semester for What-If
  const pastSemesters = semesters.filter((s) => s.number < activeSemNum);
  const pastCGPA = calculateCGPA(pastSemesters);
  const activeTotalCredits = activeSemester.courses.reduce((acc, c) => acc + c.credits, 0);

  const whatIfResult = calculateRequiredSGPA(
    pastCGPA.totalCredits,
    pastCGPA.earnedPoints,
    activeTotalCredits || 20,
    targetCGPA
  );

  // Update a course in active semester
  const updateCourse = (index: number, updates: Partial<CourseGradeEntry>) => {
    const updatedCourses = [...activeSemester.courses];
    const targetCourse = { ...updatedCourses[index], ...updates };

    // If marks updated, auto-convert to grade & grade point
    if (updates.marks !== undefined) {
      const derived = marksToGrade(updates.marks);
      targetCourse.grade = derived.grade;
      targetCourse.gradePoint = derived.gradePoint;
    } else if (updates.grade !== undefined) {
      if (updates.grade === 'W') {
        targetCourse.withdrawn = true;
        targetCourse.gradePoint = 0;
      } else {
        const found = RVCE_GRADING_SCALE.find((g) => g.grade === updates.grade);
        if (found) {
          targetCourse.gradePoint = found.gradePoint;
          targetCourse.withdrawn = false;
        }
      }
    }

    updatedCourses[index] = targetCourse;

    const newSemesters = semesters.map((sem) => {
      if (sem.number !== activeSemNum) return sem;
      const newSgpa = calculateSGPA(updatedCourses).sgpa;
      return { ...sem, courses: updatedCourses, sgpa: newSgpa };
    });

    saveSemesters(newSemesters);
  };

  const addCourse = () => {
    const newCourse: CourseGradeEntry = {
      name: 'Course ' + (activeSemester.courses.length + 1),
      credits: 3,
      marks: 85,
      grade: 'A+',
      gradePoint: 9,
      attempt: 1,
    };
    const updatedCourses = [...activeSemester.courses, newCourse];
    const newSemesters = semesters.map((sem) => {
      if (sem.number !== activeSemNum) return sem;
      const newSgpa = calculateSGPA(updatedCourses).sgpa;
      return { ...sem, courses: updatedCourses, sgpa: newSgpa };
    });
    saveSemesters(newSemesters);
  };

  const importCoursesFromSubjects = () => {
    if (subjects.length === 0) return;
    const imported: CourseGradeEntry[] = subjects.map((s) => ({
      name: s.name,
      credits: (s.credits || 3) + (s.hasLab ? (s.labCredits || 1) : 0),
      marks: 85,
      grade: 'A+',
      gradePoint: 9,
      attempt: 1,
    }));
    const newSemesters = semesters.map((sem) => {
      if (sem.number !== activeSemNum) return sem;
      const newSgpa = calculateSGPA(imported).sgpa;
      return { ...sem, courses: imported, sgpa: newSgpa };
    });
    saveSemesters(newSemesters);
  };

  const removeCourse = (index: number) => {
    const updatedCourses = activeSemester.courses.filter((_, i) => i !== index);
    const newSemesters = semesters.map((sem) => {
      if (sem.number !== activeSemNum) return sem;
      const newSgpa = calculateSGPA(updatedCourses).sgpa;
      return { ...sem, courses: updatedCourses, sgpa: newSgpa };
    });
    saveSemesters(newSemesters);
  };

  // Trend chart data (Sem 1 to Sem 8)
  const trendData = semesters.map((sem) => ({
    name: `Sem ${sem.number}`,
    sgpa: sem.sgpa ?? calculateSGPA(sem.courses).sgpa,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
          RVCE SGPA & CGPA Engine
        </h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Autonomous RVCE Autonomous Scheme (Grade points 0-10, W excluded from SGPA, F excluded from CGPA).
        </p>
      </div>

      {/* Aggregate Score Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cumulative CGPA */}
        <div className="orbit-card p-5 bg-[var(--card)] space-y-1">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">
            Cumulative CGPA
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono-num text-[var(--primary)]">
              {overallCGPA.cgpa.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-[var(--muted-foreground)]">/ 10.00</span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Total Graded Credits: <span className="font-mono-num font-bold">{overallCGPA.totalCredits}</span>
          </p>
        </div>

        {/* Equivalent Percentage */}
        <div className="orbit-card p-5 bg-[var(--card)] space-y-1">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">
            Equivalent Percentage
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono-num text-emerald-600 dark:text-emerald-400">
              {overallCGPA.equivalentPercentage.toFixed(1)}%
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
              CGPA × 10
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Official RVCE conversion formula
          </p>
        </div>

        {/* Active Semester SGPA */}
        <div className="orbit-card p-5 bg-[var(--card)] space-y-1">
          <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">
            Sem {activeSemNum} SGPA
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono-num text-[var(--foreground)]">
              {activeSGPA.sgpa.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-[var(--muted-foreground)]">
              {activeSGPA.totalCredits} credits
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)] truncate">
            Points earned: {activeSGPA.earnedPoints}
          </p>
        </div>
      </div>

      {/* SGPA Semester Trend Chart */}
      <div className="orbit-card p-6 bg-[var(--card)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-sm text-[var(--foreground)]">SGPA Semester Progression</h3>
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">Sem 1 to Current</span>
        </div>

        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis domain={[5, 10]} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  color: 'var(--foreground)',
                }}
              />
              <Line
                type="monotone"
                dataKey="sgpa"
                stroke="var(--leaf-deep)"
                strokeWidth={3}
                dot={{ r: 5, fill: 'var(--primary)' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* What-If Target Mode Planner */}
      <div className="orbit-card p-5 bg-[var(--card)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)]">
              What-If CGPA Target Planner
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] font-bold">
            Interactive Goal Solver
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">
              Desired Cumulative Target CGPA
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="7.0"
                max="10.0"
                step="0.05"
                value={targetCGPA}
                onChange={(e) => setTargetCGPA(Number(e.target.value))}
                className="flex-1 accent-[var(--primary)]"
              />
              <span className="text-lg font-black font-mono-num text-[var(--primary)] min-w-[50px]">
                {targetCGPA.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--background)] border border-[var(--border)] w-full sm:w-auto min-w-[280px]">
            <span className="text-[11px] font-bold uppercase text-[var(--muted-foreground)] block mb-1">
              Required Semester SGPA
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono-num ${
                  whatIfResult.isAchievable ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {whatIfResult.requiredSGPA.toFixed(2)}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {whatIfResult.isAchievable ? 'Achievable' : 'Unreachable'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
              {whatIfResult.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Semester Tabs (Sem 1 to Sem 8) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
          const isActive = activeSemNum === num;
          const sem = semesters.find((s) => s.number === num);
          const sgpa = sem ? sem.sgpa ?? calculateSGPA(sem.courses).sgpa : null;

          return (
            <button
              key={num}
              onClick={() => setActiveSemNum(num)}
              className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <div>Sem {num}</div>
              <div className="text-[10px] font-mono-num opacity-85 mt-0.5">
                {sgpa ? `${sgpa.toFixed(2)}` : 'Empty'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Course Grade List */}
      <div className="orbit-card p-5 bg-[var(--card)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-sm text-[var(--foreground)]">
              Courses for Semester {activeSemNum}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {subjects.length > 0 && (
              <button
                onClick={importCoursesFromSubjects}
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--foreground)] hover:border-[var(--primary)] transition-all"
              >
                Import from Registered Subjects
              </button>
            )}
            <button
              onClick={addCourse}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>
        </div>

        {activeSemester.courses.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
              No courses registered for Semester {activeSemNum} yet. Add a course manually or import from your active subjects.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={addCourse}
                className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-sm"
              >
                + Add First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSemester.courses.map((course, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[var(--background)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              {/* Course Name */}
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(idx, { name: e.target.value })}
                  className="w-full bg-transparent font-bold text-sm text-[var(--foreground)] focus:outline-none"
                />
              </div>

              {/* Credits */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase block sm:hidden">
                  Credits
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={course.credits}
                    onChange={(e) => updateCourse(idx, { credits: Number(e.target.value) })}
                    className="w-14 px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-bold font-mono-num text-[var(--foreground)]"
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">Cr</span>
                </div>
              </div>

              {/* Marks (0-100) */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase block sm:hidden">
                  Marks
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={course.marks ?? ''}
                    placeholder="Marks"
                    onChange={(e) =>
                      updateCourse(idx, {
                        marks: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-bold font-mono-num text-[var(--foreground)]"
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">/100</span>
                </div>
              </div>

              {/* Grade Selector & Grade Points */}
              <div className="sm:col-span-3 flex items-center gap-2">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(idx, { grade: e.target.value })}
                  className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-black text-[var(--foreground)]"
                >
                  <option value="O">O (10)</option>
                  <option value="A+">A+ (9)</option>
                  <option value="A">A (8)</option>
                  <option value="B+">B+ (7)</option>
                  <option value="B">B (6)</option>
                  <option value="C">C (5)</option>
                  <option value="P">P (4)</option>
                  <option value="F">F (0)</option>
                  <option value="W">W (Withdrawn)</option>
                </select>

                {/* Attempt Indicator */}
                <select
                  value={course.attempt || 1}
                  onChange={(e) =>
                    updateCourse(idx, { attempt: Number(e.target.value) as 1 | 2 | 3 })
                  }
                  className="px-1.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[10px] font-bold text-[var(--muted-foreground)]"
                  title="Attempt Flag: Regular, 2nd (*), or 3rd+ (**)"
                >
                  <option value="1">Reg</option>
                  <option value="2">2nd (*)</option>
                  <option value="3">3rd+ (**)</option>
                </select>
              </div>

              {/* Remove button */}
              <div className="sm:col-span-1 text-right">
                <button
                  onClick={() => removeCourse(idx)}
                  className="p-1.5 text-[var(--muted-foreground)] hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Live Substituted Formula Verification Preview */}
        <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)]">
            <Calculator className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Mathematical Formula Verification:</span>
          </div>
          <code className="block text-[11px] font-mono-num text-[var(--muted-foreground)] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {activeSGPA.formulaString}
          </code>
        </div>
      </div>
    </div>
  );
}
