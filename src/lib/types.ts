export interface UserNotifications {
  classes: boolean;
  attendance: boolean;
  exams: boolean;
  deadlines: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  college: string;
  branch: string;
  semester: number;
  attendanceTarget: number; // e.g. 75
  semStart: string; // YYYY-MM-DD
  semEnd: string; // YYYY-MM-DD
  theme?: 'light' | 'dark' | 'system';
  motion?: 'full' | 'reduced' | 'off';
  notifications?: UserNotifications;
  fcmToken?: string;
  isOnboarded?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  hasLab: boolean;
  labCredits?: number;
  faculty?: string;
  color: string;
  type: 'theory' | 'theory+lab';
}

export interface TimetableSlot {
  id: string;
  subjectId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // "09:00"
  endTime: string; // "10:00" or "12:00" for labs
  kind: 'theory' | 'lab';
  room?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'cancelled' | 'holiday';

export interface AttendanceRecord {
  id: string; // e.g. "2026-10-30_slot123"
  date: string; // "YYYY-MM-DD"
  slotId?: string;
  subjectId: string;
  kind: 'theory' | 'lab';
  status: AttendanceStatus;
  note?: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  subjectId?: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  type: 'assignment' | 'exam' | 'event' | 'deadline';
  subjectId?: string;
}

export interface SyllabusItem {
  id: string;
  title: string;
  done: boolean;
}

export interface ExamSubjectRecord {
  id: string;
  subjectId: string;
  syllabus: SyllabusItem[];
  expectedQuiz: number;
  obtainedQuiz?: number;
  quizMax: number;
  expectedExam: number;
  obtainedExam?: number;
  examMax: number;
  date?: string;
}

export interface Exam {
  id: string;
  type: string; // "CIE 1" | "CIE 2" | "Semester End Exam" | "Lab Internal" | custom
  startDate?: string;
  endDate?: string;
  subjects: ExamSubjectRecord[];
}

export interface FocusSession {
  id: string;
  subjectId?: string;
  startedAt: string;
  durationMin: number;
  type: 'focus' | 'break';
}

export interface Deadline {
  id: string;
  title: string;
  subjectId?: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'submitted';
}

export interface StreakRecord {
  current: number;
  longest: number;
  lastDate: string;
  badges: string[];
}

export interface SemesterCourseRecord {
  subjectId?: string;
  name: string;
  credits: number;
  marks?: number;
  grade: string;
  gradePoint: number;
  attempt: 1 | 2 | 3;
  withdrawn: boolean;
}

export interface SemesterDoc {
  id?: string;
  number: number;
  sgpa?: number;
  courses: SemesterCourseRecord[];
}
