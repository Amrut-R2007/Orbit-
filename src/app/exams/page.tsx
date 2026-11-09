'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileSpreadsheet,
  CheckSquare,
  Square,
  Plus,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAcademicData } from '@/hooks/useAcademicData';

export default function ExamsPage() {
  const {
    subjects,
    exams,
    addExam,
    updateExamSubjectMarks,
    toggleExamSyllabusItem,
  } = useAcademicData();

  const [activeExamId, setActiveExamId] = useState(exams[0]?.id || '');

  React.useEffect(() => {
    if (exams.length > 0 && (!activeExamId || !exams.some((e) => e.id === activeExamId))) {
      setActiveExamId(exams[0].id);
    }
  }, [exams, activeExamId]);

  const activeExam = exams.find((e) => e.id === activeExamId) || exams[0];

  const createDefaultExam = (name: string) => {
    const examSubjects = subjects.map((s) => ({
      id: `es-${s.id}-${Date.now()}`,
      subjectId: s.id,
      expectedQuiz: 10,
      quizMax: 10,
      expectedExam: 40,
      examMax: 50,
      syllabus: [
        { id: `syl-1-${s.id}`, title: 'Module 1 & 2 Concepts', done: false },
        { id: `syl-2-${s.id}`, title: 'Module 3 & 4 Practice', done: false },
      ],
    }));
    addExam({
      type: name,
      startDate: new Date().toISOString().split('T')[0],
      subjects: examSubjects,
    });
  };

  // Helper for color rule:
  // if obtained > expected: green
  // else if obtained is present: red
  // neutral grey while obtained is empty
  const getMarkBadge = (expected: number, obtained?: number) => {
    if (obtained === undefined || obtained === null) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-mono-num font-semibold">
          Pending
        </span>
      );
    }
    const diff = obtained - expected;
    const isHigher = diff > 0;
    const isExact = diff === 0;

    return (
      <span
        className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-mono-num font-bold ${
          isHigher
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : isExact
            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
            : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
        }`}
      >
        <span>{obtained}</span>
        <span>
          ({diff > 0 ? `+${diff}` : `${diff}`})
        </span>
      </span>
    );
  };

  // Chart data calculation
  const chartData = (activeExam?.subjects || []).map((es) => {
    const sub = subjects.find((s) => s.id === es.subjectId);
    const totalExpected = es.expectedQuiz + es.expectedExam;
    const totalObtained =
      (es.obtainedQuiz ?? 0) + (es.obtainedExam ?? 0);

    return {
      name: sub?.code || 'Sub',
      expected: totalExpected,
      obtained: es.obtainedQuiz !== undefined || es.obtainedExam !== undefined ? totalObtained : 0,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Exams & Syllabus Tracker
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Continuous evaluations and examinations with target vs obtained score tracking.
          </p>
        </div>

        {exams.length > 0 && (
          <button
            onClick={() => createDefaultExam(`Assessment ${exams.length + 1}`)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-95 self-start sm:self-auto"
          >
            + Add Assessment
          </button>
        )}
      </div>

      {exams.length === 0 ? (
        <div className="orbit-card p-12 text-center space-y-4 bg-[var(--card)]">
          <BarChart3 className="w-12 h-12 mx-auto text-[var(--primary)] opacity-60" />
          <h3 className="font-bold text-lg text-[var(--foreground)]">No Assessments Configured</h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
            Create your continuous internal assessments (CIE 1, CIE 2) or Semester End Exam to track target marks against obtained scores and module checklists.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => createDefaultExam('CIE 1 (Internal)')}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-sm"
            >
              + Add CIE 1 Evaluation
            </button>
            <button
              onClick={() => createDefaultExam('CIE 2 (Internal)')}
              className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs font-bold"
            >
              + Add CIE 2 Evaluation
            </button>
            <button
              onClick={() => createDefaultExam('Semester End Exam (SEE)')}
              className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs font-bold"
            >
              + Add SEE Examination
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Exam Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {exams.map((exam) => {
              const isActive = activeExamId === exam.id;
              return (
                <button
                  key={exam.id}
                  onClick={() => setActiveExamId(exam.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {exam.type}
                </button>
              );
            })}
          </div>

      {/* Top Summary Card with Recharts Bar Chart */}
      <div className="orbit-card p-6 bg-[var(--card)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)]">
              Performance Summary: {activeExam?.type}
            </h3>
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">
            Total Expected vs Obtained
          </span>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  color: 'var(--foreground)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="expected" fill="var(--leaf-primary)" name="Expected Total" radius={[6, 6, 0, 0]} />
              <Bar dataKey="obtained" fill="var(--leaf-deep)" name="Obtained Marks" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exam Subjects Cards */}
      <div className="space-y-4">
        {(activeExam?.subjects || []).map((es) => {
          const sub = subjects.find((s) => s.id === es.subjectId);
          const completedTopics = es.syllabus.filter((s) => s.done).length;
          const totalTopics = es.syllabus.length;
          const syllabusProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

          const totalExpected = es.expectedQuiz + es.expectedExam;
          const hasObtained = es.obtainedQuiz !== undefined && es.obtainedExam !== undefined;
          const totalObtained = (es.obtainedQuiz ?? 0) + (es.obtainedExam ?? 0);

          return (
            <motion.div
              key={es.id}
              layout
              className="orbit-card p-5 sm:p-6 bg-[var(--card)] space-y-5"
            >
              {/* Subject Title & Marks Highlights */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sub?.color || 'var(--primary)' }}
                    />
                    <h3 className="font-bold text-base sm:text-lg text-[var(--foreground)]">
                      {sub?.name || 'Subject'}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    Course Code: <span className="font-mono-num font-semibold">{sub?.code}</span> • Max Total: {es.quizMax + es.examMax} Marks
                  </p>
                </div>

                {/* Aggregate Delta */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] block">
                      Total Verdict
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-[var(--muted-foreground)] font-mono-num">
                        Exp: {totalExpected}
                      </span>
                      <span>→</span>
                      {hasObtained ? (
                        getMarkBadge(totalExpected, totalObtained)
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)] font-semibold">
                          Awaiting results
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Marks Inputs Row with live difference coloring */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Quiz Expected */}
                <div className="p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                    Expected Quiz ({es.quizMax})
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={es.quizMax}
                    value={es.expectedQuiz}
                    onChange={(e) =>
                      updateExamSubjectMarks(activeExam.id, es.subjectId, {
                        expectedQuiz: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 bg-transparent font-mono-num font-bold text-lg text-[var(--foreground)] focus:outline-none"
                  />
                </div>

                {/* Quiz Obtained */}
                <div className="p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                      Obtained Quiz
                    </span>
                    {getMarkBadge(es.expectedQuiz, es.obtainedQuiz)}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={es.quizMax}
                    placeholder="—"
                    value={es.obtainedQuiz ?? ''}
                    onChange={(e) =>
                      updateExamSubjectMarks(activeExam.id, es.subjectId, {
                        obtainedQuiz: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 bg-transparent font-mono-num font-bold text-lg text-[var(--foreground)] focus:outline-none"
                  />
                </div>

                {/* Exam Expected */}
                <div className="p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                    Expected Exam ({es.examMax})
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={es.examMax}
                    value={es.expectedExam}
                    onChange={(e) =>
                      updateExamSubjectMarks(activeExam.id, es.subjectId, {
                        expectedExam: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 bg-transparent font-mono-num font-bold text-lg text-[var(--foreground)] focus:outline-none"
                  />
                </div>

                {/* Exam Obtained */}
                <div className="p-3 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                      Obtained Exam
                    </span>
                    {getMarkBadge(es.expectedExam, es.obtainedExam)}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={es.examMax}
                    placeholder="—"
                    value={es.obtainedExam ?? ''}
                    onChange={(e) =>
                      updateExamSubjectMarks(activeExam.id, es.subjectId, {
                        obtainedExam: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 bg-transparent font-mono-num font-bold text-lg text-[var(--foreground)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Syllabus Progress Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    Syllabus Checklist ({completedTopics}/{totalTopics} Units Mastered)
                  </span>
                  <span className="text-xs font-bold font-mono-num text-[var(--primary)]">
                    {syllabusProgress}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                    style={{ width: `${syllabusProgress}%` }}
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  {es.syllabus.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleExamSyllabusItem(activeExam.id, es.subjectId, item.id)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-[var(--muted)]/50 transition-colors"
                    >
                      {item.done ? (
                        <CheckSquare className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          item.done
                            ? 'line-through text-[var(--muted-foreground)]'
                            : 'text-[var(--foreground)] font-medium'
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  )}
</div>
  );
}
