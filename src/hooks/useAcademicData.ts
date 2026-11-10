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

// Safe localStorage sync helper
const syncLocal = (key: string, data: unknown) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage sync warning:', e);
    }
  }
};

const getLocal = <T>(key: string, fallback: T): T => {
  if (typeof window !== 'undefined') {
    try {
      const val = localStorage.getItem(key);
      if (val) return JSON.parse(val);
    } catch {}
  }
  return fallback;
};

export function useAcademicData() {
  const { user } = useAuth();
  const uid = user?.uid;

  // Real academic state (initialized with localStorage cache so no data is ever lost)
  const [subjects, setSubjects] = useState<Subject[]>(() => getLocal('orbit_subjects', []));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => getLocal('orbit_timetable', []));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getLocal('orbit_attendance', []));
  const [exams, setExams] = useState<Exam[]>(() => getLocal('orbit_exams', []));
  const [tasks, setTasks] = useState<Task[]>(() => getLocal('orbit_tasks', []));
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => getLocal('orbit_deadlines', []));
  const [streaks, setStreaks] = useState<StreakRecord>(() => getLocal('orbit_streaks', DEFAULT_STREAK));
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => getLocal('orbit_focus', []));
  const [isLoaded, setIsLoaded] = useState(false);

  // Manual save status tracking
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Firestore real-time synchronization with non-destructive merge
  useEffect(() => {
    if (!uid || !isFirebaseConfigured) {
      setIsLoaded(true);
      return;
    }

    const unsubSub = onSnapshot(
      collection(db, 'users', uid, 'subjects'),
      (snap) => {
        const cloudList = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subject));
        setSubjects((prev) => {
          // Merge cloud items with any local items that haven't arrived in the snapshot yet
          const cloudIds = new Set(cloudList.map((c) => c.id));
          const localPending = prev.filter((p) => !cloudIds.has(p.id));
          const merged = [...cloudList, ...localPending];
          syncLocal('orbit_subjects', merged);
          return merged;
        });
      },
      (err) => console.error('Subjects sync error:', err)
    );

    const unsubTT = onSnapshot(
      collection(db, 'users', uid, 'timetable'),
      (snap) => {
        const cloudList = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TimetableSlot));
        setTimetable((prev) => {
          const cloudIds = new Set(cloudList.map((c) => c.id));
          const localPending = prev.filter((p) => !cloudIds.has(p.id));
          const merged = [...cloudList, ...localPending];
          syncLocal('orbit_timetable', merged);
          return merged;
        });
      },
      (err) => console.error('Timetable sync error:', err)
    );

    const unsubAtt = onSnapshot(
      collection(db, 'users', uid, 'attendance'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceRecord));
        setAttendance(list);
        syncLocal('orbit_attendance', list);
      },
      (err) => console.error('Attendance sync error:', err)
    );

    const unsubTasks = onSnapshot(
      collection(db, 'users', uid, 'tasks'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
        setTasks(list);
        syncLocal('orbit_tasks', list);
      },
      (err) => console.error('Tasks sync error:', err)
    );

    const unsubExams = onSnapshot(
      collection(db, 'users', uid, 'exams'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Exam));
        setExams(list);
        syncLocal('orbit_exams', list);
      },
      (err) => console.error('Exams sync error:', err)
    );

    const unsubDeadlines = onSnapshot(
      collection(db, 'users', uid, 'deadlines'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Deadline));
        setDeadlines(list);
        syncLocal('orbit_deadlines', list);
      },
      (err) => console.error('Deadlines sync error:', err)
    );

    const unsubFocus = onSnapshot(
      collection(db, 'users', uid, 'focusSessions'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FocusSession));
        setFocusSessions(list);
        syncLocal('orbit_focus', list);
      },
      (err) => console.error('Focus sync error:', err)
    );

    const unsubStreaks = onSnapshot(
      doc(db, 'users', uid, 'streaks', 'current'),
      (docSnap) => {
        if (docSnap.exists()) {
          const st = docSnap.data() as StreakRecord;
          setStreaks(st);
          syncLocal('orbit_streaks', st);
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

  // 1. Subjects Management & Explicit Save
  const addSubject = useCallback(
    async (sub: Omit<Subject, 'id'>) => {
      const id = 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const newSubject: Subject = { ...sub, id };
      
      setSubjects((prev) => {
        const next = [...prev, newSubject];
        syncLocal('orbit_subjects', next);
        return next;
      });
      setHasUnsavedChanges(true);

      if (uid && isFirebaseConfigured) {
        try {
          await setDoc(doc(db, 'users', uid, 'subjects', id), newSubject);
        } catch (err) {
          console.error('Failed to write subject to Firestore:', err);
        }
      }
      return newSubject;
    },
    [uid]
  );

  const updateSubject = useCallback(
    async (id: string, updates: Partial<Subject>) => {
      setSubjects((prev) => {
        const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
        syncLocal('orbit_subjects', next);
        return next;
      });
      setHasUnsavedChanges(true);

      if (uid && isFirebaseConfigured) {
        try {
          await setDoc(doc(db, 'users', uid, 'subjects', id), updates, { merge: true });
        } catch (err) {
          console.error('Failed to update subject in Firestore:', err);
        }
      }
    },
    [uid]
  );

  const deleteSubject = useCallback(
    async (id: string) => {
      setSubjects((prev) => {
        const next = prev.filter((s) => s.id !== id);
        syncLocal('orbit_subjects', next);
        return next;
      });
      setHasUnsavedChanges(true);

      if (uid && isFirebaseConfigured) {
        try {
          await deleteDoc(doc(db, 'users', uid, 'subjects', id));
        } catch (err) {
          console.error('Failed to delete subject from Firestore:', err);
        }
      }
    },
    [uid]
  );

  // Explicit Save All Subjects to Cloud
  const saveAllSubjects = useCallback(
    async (customList?: Subject[]) => {
      const toSave = customList || subjects;
      syncLocal('orbit_subjects', toSave);

      if (!uid || !isFirebaseConfigured) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        return { success: true, count: toSave.length };
      }

      setIsSaving(true);
      try {
        const promises = toSave.map((s) =>
          setDoc(doc(db, 'users', uid, 'subjects', s.id), s, { merge: true })
        );
        await Promise.all(promises);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        return { success: true, count: toSave.length };
      } catch (err) {
        console.error('Error saving subjects batch:', err);
        return { success: false, count: 0, error: String(err) };
      } finally {
        setIsSaving(false);
      }
    },
    [subjects, uid]
  );

  // 2. Timetable Management & Explicit Save
  const addTimetableSlot = useCallback(
    async (slot: Omit<TimetableSlot, 'id'>) => {
      const id = 'tt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const newSlot: TimetableSlot = { ...slot, id };

      setTimetable((prev) => {
        const next = [...prev, newSlot];
        syncLocal('orbit_timetable', next);
        return next;
      });
      setHasUnsavedChanges(true);

      if (uid && isFirebaseConfigured) {
        try {
          await setDoc(doc(db, 'users', uid, 'timetable', id), newSlot);
        } catch (err) {
          console.error('Failed to write timetable slot to Firestore:', err);
        }
      }
      return newSlot;
    },
    [uid]
  );

  const updateTimetableSlot = useCallback(
    async (id: string, updates: Partial<TimetableSlot>) => {
      setTimetable((prev) => {
        const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
        syncLocal('orbit_timetable', next);
        return next;
      });
      setHasUnsavedChanges(true);

      if (uid && isFirebaseConfigured) {
        try {
          await setDoc(doc(db, 'users', uid, 'timetable', id), updates, { merge: true });
        } catch (err) {
          console.error('Failed to update timetable slot:', err);
        }
      }
    },
    [uid]
  );

  const deleteTimetableSlot = useCallback(
    async (id: string) => {
      setTimetable((prev) => {
        const next = prev.filter((s) => s.id !== id);
        syncLocal('orbit_timetable', next);
        return next;
      });
      setHasUnsavedChanges(true);

      if (uid && isFirebaseConfigured) {
        try {
          await deleteDoc(doc(db, 'users', uid, 'timetable', id));
        } catch (err) {
          console.error('Failed to delete timetable slot:', err);
        }
      }
    },
    [uid]
  );

  const duplicateDaySlots = useCallback(
    async (fromDay: number, toDay: number) => {
      const sourceSlots = timetable.filter((s) => s.dayOfWeek === fromDay);
      const newSlots: TimetableSlot[] = [];
      for (const [idx, s] of sourceSlots.entries()) {
        const id = `tt-${toDay}-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`;
        const cloned: TimetableSlot = {
          ...s,
          id,
          dayOfWeek: toDay,
        };
        newSlots.push(cloned);
      }

      setTimetable((prev) => {
        const next = [...prev, ...newSlots];
        syncLocal('orbit_timetable', next);
        return next;
      });
      setHasUnsavedChanges(true);

      if (uid && isFirebaseConfigured) {
        for (const slot of newSlots) {
          await setDoc(doc(db, 'users', uid, 'timetable', slot.id), slot);
        }
      }
    },
    [timetable, uid]
  );

  const saveAllTimetable = useCallback(
    async (customList?: TimetableSlot[]) => {
      const toSave = customList || timetable;
      syncLocal('orbit_timetable', toSave);

      if (!uid || !isFirebaseConfigured) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        return { success: true, count: toSave.length };
      }

      setIsSaving(true);
      try {
        const promises = toSave.map((t) =>
          setDoc(doc(db, 'users', uid, 'timetable', t.id), t, { merge: true })
        );
        await Promise.all(promises);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        return { success: true, count: toSave.length };
      } catch (err) {
        console.error('Error saving timetable batch:', err);
        return { success: false, count: 0, error: String(err) };
      } finally {
        setIsSaving(false);
      }
    },
    [timetable, uid]
  );

  // 3. Attendance Marking
  const markAttendance = useCallback(
    async (params: {
      date: string;
      slotId?: string;
      subjectId: string;
      kind: 'theory' | 'lab';
      status: AttendanceStatus;
      note?: string;
    }) => {
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
        let next: AttendanceRecord[];
        if (existingIdx >= 0) {
          next = [...prev];
          next[existingIdx] = newRecord;
        } else {
          next = [...prev, newRecord];
        }
        syncLocal('orbit_attendance', next);
        return next;
      });

      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'attendance', recordId), newRecord);
      }
    },
    [uid]
  );

  // 4. Metrics & Calculations
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
      const id = 'task-' + Date.now();
      const newTask: Task = { ...task, id };
      setTasks((prev) => {
        const next = [newTask, ...prev];
        syncLocal('orbit_tasks', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'tasks', id), newTask);
      }
    },
    [uid]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;
      const updatedDone = !target.done;
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, done: updatedDone } : t));
        syncLocal('orbit_tasks', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'tasks', id), { done: updatedDone }, { merge: true });
      }
    },
    [tasks, uid]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== id);
        syncLocal('orbit_tasks', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await deleteDoc(doc(db, 'users', uid, 'tasks', id));
      }
    },
    [uid]
  );

  // 6. Exam Management
  const addExam = useCallback(
    async (exam: Omit<Exam, 'id'>) => {
      const id = 'exam-' + Date.now();
      const newExam: Exam = { ...exam, id };
      setExams((prev) => {
        const next = [...prev, newExam];
        syncLocal('orbit_exams', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'exams', id), newExam);
      }
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
      const currentExam = exams.find((e) => e.id === examId);
      if (!currentExam) return;

      const updatedSubjects = currentExam.subjects.map((es) =>
        es.subjectId === subjectId ? { ...es, ...updates } : es
      );
      const updatedExam = { ...currentExam, subjects: updatedSubjects };

      setExams((prev) => {
        const next = prev.map((e) => (e.id === examId ? updatedExam : e));
        syncLocal('orbit_exams', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'exams', examId), updatedExam, { merge: true });
      }
    },
    [exams, uid]
  );

  const toggleExamSyllabusItem = useCallback(
    async (examId: string, subjectId: string, syllabusId: string) => {
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

      setExams((prev) => {
        const next = prev.map((e) => (e.id === examId ? updatedExam : e));
        syncLocal('orbit_exams', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'exams', examId), updatedExam, { merge: true });
      }
    },
    [exams, uid]
  );

  const deleteExam = useCallback(
    async (examId: string) => {
      setExams((prev) => {
        const next = prev.filter((e) => e.id !== examId);
        syncLocal('orbit_exams', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await deleteDoc(doc(db, 'users', uid, 'exams', examId));
      }
    },
    [uid]
  );

  // 7. Focus Session Logger
  const logFocusSession = useCallback(
    async (session: Omit<FocusSession, 'id'>) => {
      const id = 'fs-' + Date.now();
      const newSession: FocusSession = { ...session, id };
      setFocusSessions((prev) => {
        const next = [newSession, ...prev];
        syncLocal('orbit_focus', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'focusSessions', id), newSession);
      }
    },
    [uid]
  );

  // 8. Deadlines Management
  const addDeadline = useCallback(
    async (dl: Omit<Deadline, 'id'>) => {
      const id = 'dl-' + Date.now();
      const newDl: Deadline = { ...dl, id };
      setDeadlines((prev) => {
        const next = [...prev, newDl];
        syncLocal('orbit_deadlines', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'deadlines', id), newDl);
      }
    },
    [uid]
  );

  const updateDeadlineStatus = useCallback(
    async (id: string, status: 'todo' | 'in_progress' | 'submitted') => {
      setDeadlines((prev) => {
        const next = prev.map((d) => (d.id === id ? { ...d, status } : d));
        syncLocal('orbit_deadlines', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'deadlines', id), { status }, { merge: true });
      }
    },
    [uid]
  );

  const deleteDeadline = useCallback(
    async (id: string) => {
      setDeadlines((prev) => {
        const next = prev.filter((d) => d.id !== id);
        syncLocal('orbit_deadlines', next);
        return next;
      });
      if (uid && isFirebaseConfigured) {
        await deleteDoc(doc(db, 'users', uid, 'deadlines', id));
      }
    },
    [uid]
  );

  // 9. Streaks Update
  const updateStreaks = useCallback(
    async (streakUpdates: Partial<StreakRecord>) => {
      const merged = { ...streaks, ...streakUpdates };
      setStreaks(merged);
      syncLocal('orbit_streaks', merged);
      if (uid && isFirebaseConfigured) {
        await setDoc(doc(db, 'users', uid, 'streaks', 'current'), merged, { merge: true });
      }
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
    isSaving,
    hasUnsavedChanges,
    lastSaved,
    addSubject,
    updateSubject,
    deleteSubject,
    saveAllSubjects,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    duplicateDaySlots,
    saveAllTimetable,
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
