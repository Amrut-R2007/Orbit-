'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import {
  Subject,
  TimetableSlot,
  AttendanceRecord,
  AttendanceStatus,
  Exam,
  Task,
  Deadline,
  StreakRecord,
  FocusSession,
} from '@/lib/types';
import { calculateAttendanceMetrics, AttendanceMetrics } from '@/lib/attendance-calculator';

const DEFAULT_STREAK: StreakRecord = {
  current: 0,
  longest: 0,
  lastDate: new Date().toISOString().split('T')[0],
  badges: [],
};

export function useAcademicData() {
  const { user } = useAuth();
  const uid = user?.uid;

  // Real academic state (defaults to clean empty state)
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [streaks, setStreaks] = useState<StreakRecord>(DEFAULT_STREAK);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Firestore real-time synchronization
  useEffect(() => {
    if (!uid || !isFirebaseConfigured) {
      setIsLoaded(true);
      return;
    }

    const unsubSub = onSnapshot(
      collection(db, 'users', uid, 'subjects'),
      (snap) => {
        setSubjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subject)));
      },
      (err) => console.error('Subjects sync error:', err)
    );

    const unsubTT = onSnapshot(
      collection(db, 'users', uid, 'timetable'),
      (snap) => {
        setTimetable(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TimetableSlot)));
      },
      (err) => console.error('Timetable sync error:', err)
    );

    const unsubAtt = onSnapshot(
      collection(db, 'users', uid, 'attendance'),
      (snap) => {
        setAttendance(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceRecord)));
      },
      (err) => console.error('Attendance sync error:', err)
    );

    const unsubTasks = onSnapshot(
      collection(db, 'users', uid, 'tasks'),
      (snap) => {
        setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
      },
      (err) => console.error('Tasks sync error:', err)
    );

    const unsubExams = onSnapshot(
      collection(db, 'users', uid, 'exams'),
      (snap) => {
        setExams(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Exam)));
      },
      (err) => console.error('Exams sync error:', err)
    );

    const unsubDeadlines = onSnapshot(
      collection(db, 'users', uid, 'deadlines'),
      (snap) => {
        setDeadlines(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Deadline)));
      },
      (err) => console.error('Deadlines sync error:', err)
    );

    const unsubFocus = onSnapshot(
      collection(db, 'users', uid, 'focusSessions'),
      (snap) => {
        setFocusSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FocusSession)));
      },
      (err) => console.error('Focus sync error:', err)
    );

    const unsubStreaks = onSnapshot(
      doc(db, 'users', uid, 'streaks', 'current'),
      (docSnap) => {
        if (docSnap.exists()) {
          setStreaks(docSnap.data() as StreakRecord);
        }
      },
      (err) => console.error('Streaks sync error:', err)
    );

    setIsLoaded(true);

    return () => {
      unsubSub();
      unsubTT();
      unsubAtt();
      unsubTasks();
      unsubExams();
      unsubDeadlines();
      unsubFocus();
      unsubStreaks();
    };
  }, [uid]);

  // 1. Subjects Management
  const addSubject = useCallback(
    async (sub: Omit<Subject, 'id'>) => {
      if (!uid) return;
      const id = 'sub-' + Date.now();
      const newSubject: Subject = { ...sub, id };
      setSubjects((prev) => [...prev, newSubject]);
      await setDoc(doc(db, 'users', uid, 'subjects', id), newSubject);
    },
    [uid]
  );

  const updateSubject = useCallback(
    async (id: string, updates: Partial<Subject>) => {
      if (!uid) return;
      setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
      await setDoc(doc(db, 'users', uid, 'subjects', id), updates, { merge: true });
    },
    [uid]
  );

  const deleteSubject = useCallback(
    async (id: string) => {
      if (!uid) return;
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      await deleteDoc(doc(db, 'users', uid, 'subjects', id));
    },
    [uid]
  );

  // 2. Timetable Management
  const addTimetableSlot = useCallback(
    async (slot: Omit<TimetableSlot, 'id'>) => {
      if (!uid) return;
      const id = 'tt-' + Date.now();
      const newSlot: TimetableSlot = { ...slot, id };
      setTimetable((prev) => [...prev, newSlot]);
      await setDoc(doc(db, 'users', uid, 'timetable', id), newSlot);
    },
    [uid]
  );

  const updateTimetableSlot = useCallback(
    async (id: string, updates: Partial<TimetableSlot>) => {
      if (!uid) return;
      setTimetable((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
      await setDoc(doc(db, 'users', uid, 'timetable', id), updates, { merge: true });
    },
    [uid]
  );

  const deleteTimetableSlot = useCallback(
    async (id: string) => {
      if (!uid) return;
      setTimetable((prev) => prev.filter((s) => s.id !== id));
      await deleteDoc(doc(db, 'users', uid, 'timetable', id));
    },
    [uid]
  );

  const duplicateDaySlots = useCallback(
    async (fromDay: number, toDay: number) => {
      if (!uid) return;
      const sourceSlots = timetable.filter((s) => s.dayOfWeek === fromDay);
      for (const [idx, s] of sourceSlots.entries()) {
        const id = `tt-${toDay}-${Date.now()}-${idx}`;
        const cloned: TimetableSlot = {
          ...s,
          id,
          dayOfWeek: toDay,
        };
        await setDoc(doc(db, 'users', uid, 'timetable', id), cloned);
      }
    },
    [timetable, uid]
  );

  // 3. Attendance Marking (Autosaves to Firestore)
  const markAttendance = useCallback(
    async (params: {
      date: string;
      slotId?: string;
      subjectId: string;
      kind: 'theory' | 'lab';
      status: AttendanceStatus;
      note?: string;
    }) => {
      if (!uid) return;
      const recordId = `${params.date}_${params.slotId || params.subjectId}_${params.kind}`;
      const newRecord: AttendanceRecord = {
        id: recordId,
        date: params.date,
        slotId: params.slotId,
        subjectId: params.subjectId,
        kind: params.kind,
        status: params.status,
        note: params.note,
        updatedAt: new Date().toISOString(),
      };

      setAttendance((prev) => {
        const existingIdx = prev.findIndex((a) => a.id === recordId);
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = newRecord;
          return next;
        }
        return [...prev, newRecord];
      });

      await setDoc(doc(db, 'users', uid, 'attendance', recordId), newRecord);
    },
    [uid]
  );

  // 4. Metrics & Attendance Calculations
  const getSubjectMetrics = useCallback(
    (subjectId: string, kind?: 'theory' | 'lab'): AttendanceMetrics => {
      const relevant = attendance.filter((a) => {
        if (a.subjectId !== subjectId) return false;
        if (kind && a.kind !== kind) return false;
        return a.status !== 'cancelled' && a.status !== 'holiday';
      });

      const attended = relevant.filter((a) => a.status === 'present').length;
      const total = relevant.length;
      const target = user?.attendanceTarget || 75;

      return calculateAttendanceMetrics(attended, total, target);
    },
    [attendance, user?.attendanceTarget]
  );

  const getOverallMetrics = useCallback((): AttendanceMetrics => {
    const relevant = attendance.filter(
      (a) => a.status !== 'cancelled' && a.status !== 'holiday'
    );
    const attended = relevant.filter((a) => a.status === 'present').length;
    const total = relevant.length;
    const target = user?.attendanceTarget || 75;

    return calculateAttendanceMetrics(attended, total, target);
  }, [attendance, user?.attendanceTarget]);

  // 5. Tasks Management
  const addTask = useCallback(
    async (task: Omit<Task, 'id'>) => {
      if (!uid) return;
      const id = 'task-' + Date.now();
      const newTask: Task = { ...task, id };
      setTasks((prev) => [newTask, ...prev]);
      await setDoc(doc(db, 'users', uid, 'tasks', id), newTask);
    },
    [uid]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      if (!uid) return;
      const target = tasks.find((t) => t.id === id);
      if (!target) return;
      const updatedDone = !target.done;
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: updatedDone } : t)));
      await setDoc(doc(db, 'users', uid, 'tasks', id), { done: updatedDone }, { merge: true });
    },
    [tasks, uid]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!uid) return;
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await deleteDoc(doc(db, 'users', uid, 'tasks', id));
    },
    [uid]
  );

  // 6. Exam Management
  const addExam = useCallback(
    async (exam: Omit<Exam, 'id'>) => {
      if (!uid) return;
      const id = 'exam-' + Date.now();
      const newExam: Exam = { ...exam, id };
      setExams((prev) => [...prev, newExam]);
      await setDoc(doc(db, 'users', uid, 'exams', id), newExam);
    },
    [uid]
  );

  const updateExamSubjectMarks = useCallback(
    async (
      examId: string,
      subjectId: string,
      updates: {
        obtainedQuiz?: number;
        obtainedExam?: number;
        expectedQuiz?: number;
        expectedExam?: number;
      }
    ) => {
      if (!uid) return;
      const currentExam = exams.find((e) => e.id === examId);
      if (!currentExam) return;

      const updatedSubjects = currentExam.subjects.map((es) =>
        es.subjectId === subjectId ? { ...es, ...updates } : es
      );
      const updatedExam = { ...currentExam, subjects: updatedSubjects };

      setExams((prev) => prev.map((e) => (e.id === examId ? updatedExam : e)));
      await setDoc(doc(db, 'users', uid, 'exams', examId), updatedExam, { merge: true });
    },
    [exams, uid]
  );

  const toggleExamSyllabusItem = useCallback(
    async (examId: string, subjectId: string, syllabusId: string) => {
      if (!uid) return;
      const currentExam = exams.find((e) => e.id === examId);
      if (!currentExam) return;

      const updatedSubjects = currentExam.subjects.map((es) => {
        if (es.subjectId !== subjectId) return es;
        return {
          ...es,
          syllabus: es.syllabus.map((item) =>
            item.id === syllabusId ? { ...item, done: !item.done } : item
          ),
        };
      });
      const updatedExam = { ...currentExam, subjects: updatedSubjects };

      setExams((prev) => prev.map((e) => (e.id === examId ? updatedExam : e)));
      await setDoc(doc(db, 'users', uid, 'exams', examId), updatedExam, { merge: true });
    },
    [exams, uid]
  );

  const deleteExam = useCallback(
    async (examId: string) => {
      if (!uid) return;
      setExams((prev) => prev.filter((e) => e.id !== examId));
      await deleteDoc(doc(db, 'users', uid, 'exams', examId));
    },
    [uid]
  );

  // 7. Focus Session Logger
  const logFocusSession = useCallback(
    async (session: Omit<FocusSession, 'id'>) => {
      if (!uid) return;
      const id = 'fs-' + Date.now();
      const newSession: FocusSession = { ...session, id };
      setFocusSessions((prev) => [newSession, ...prev]);
      await setDoc(doc(db, 'users', uid, 'focusSessions', id), newSession);
    },
    [uid]
  );

  // 8. Deadlines Management
  const addDeadline = useCallback(
    async (dl: Omit<Deadline, 'id'>) => {
      if (!uid) return;
      const id = 'dl-' + Date.now();
      const newDl: Deadline = { ...dl, id };
      setDeadlines((prev) => [...prev, newDl]);
      await setDoc(doc(db, 'users', uid, 'deadlines', id), newDl);
    },
    [uid]
  );

  const updateDeadlineStatus = useCallback(
    async (id: string, status: 'todo' | 'in_progress' | 'submitted') => {
      if (!uid) return;
      setDeadlines((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
      await setDoc(doc(db, 'users', uid, 'deadlines', id), { status }, { merge: true });
    },
    [uid]
  );

  const deleteDeadline = useCallback(
    async (id: string) => {
      if (!uid) return;
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
      await deleteDoc(doc(db, 'users', uid, 'deadlines', id));
    },
    [uid]
  );

  // 9. Streaks Update
  const updateStreaks = useCallback(
    async (streakUpdates: Partial<StreakRecord>) => {
      if (!uid) return;
      const merged = { ...streaks, ...streakUpdates };
      setStreaks(merged);
      await setDoc(doc(db, 'users', uid, 'streaks', 'current'), merged, { merge: true });
    },
    [streaks, uid]
  );

  return {
    isLoaded,
    subjects,
    timetable,
    attendance,
    exams,
    tasks,
    deadlines,
    streaks,
    focusSessions,
    addSubject,
    updateSubject,
    deleteSubject,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    duplicateDaySlots,
    markAttendance,
    getSubjectMetrics,
    getOverallMetrics,
    addTask,
    toggleTask,
    deleteTask,
    addExam,
    deleteExam,
    updateExamSubjectMarks,
    toggleExamSyllabusItem,
    logFocusSession,
    addDeadline,
    updateDeadlineStatus,
    deleteDeadline,
    updateStreaks,
  };
}
