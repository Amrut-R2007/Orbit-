import {
  UserProfile,
  Subject,
  TimetableSlot,
  AttendanceRecord,
  Task,
  CalendarEvent,
  Exam,
  FocusSession,
  Deadline,
  StreakRecord,
} from '@/lib/types';
import { SemesterRecord } from '@/lib/rvce-grading';

export const INITIAL_USER_PROFILE: UserProfile = {
  uid: 'demo-student-rvce',
  name: 'Amrut Patil',
  email: 'amrut.patil@rvce.edu.in',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  college: 'R.V. College of Engineering (RVCE), Bengaluru',
  branch: 'Computer Science & Engineering',
  semester: 4,
  attendanceTarget: 75,
  semStart: '2026-08-01',
  semEnd: '2026-12-15',
  theme: 'light',
  isOnboarded: true,
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-dsa',
    name: 'Data Structures & Algorithms',
    code: '22CS41',
    credits: 3,
    hasLab: true,
    labCredits: 1.5,
    faculty: 'Dr. Savitha S.',
    color: '#F4A261', // Peach-orange
    type: 'theory+lab',
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: '22CS42',
    credits: 3,
    hasLab: true,
    labCredits: 1.5,
    faculty: 'Prof. Ramesh K.',
    color: '#8B5CF6', // Violet
    type: 'theory+lab',
  },
  {
    id: 'sub-math',
    name: 'Discrete Mathematics & Graph Theory',
    code: '22MA41',
    credits: 4,
    hasLab: false,
    faculty: 'Dr. Radhika N.',
    color: '#10B981', // Emerald
    type: 'theory',
  },
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: '22CS43',
    credits: 3,
    hasLab: true,
    labCredits: 1,
    faculty: 'Prof. Anand Vardhan',
    color: '#3B82F6', // Blue
    type: 'theory+lab',
  },
  {
    id: 'sub-es',
    name: 'Embedded Systems & IoT',
    code: '22EC44',
    credits: 3,
    hasLab: false,
    faculty: 'Dr. Kiran M.',
    color: '#EC4899', // Pink
    type: 'theory',
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday (1)
  { id: 'tt-m1', subjectId: 'sub-dsa', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-m2', subjectId: 'sub-os', dayOfWeek: 1, startTime: '10:00', endTime: '11:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-m3', subjectId: 'sub-math', dayOfWeek: 1, startTime: '11:30', endTime: '12:30', kind: 'theory', room: 'CS-301' },
  { id: 'tt-m4', subjectId: 'sub-dsa', dayOfWeek: 1, startTime: '14:00', endTime: '16:00', kind: 'lab', room: 'Lab 4 (Network Lab)' },

  // Tuesday (2)
  { id: 'tt-t1', subjectId: 'sub-cn', dayOfWeek: 2, startTime: '09:00', endTime: '10:00', kind: 'theory', room: 'CS-302' },
  { id: 'tt-t2', subjectId: 'sub-math', dayOfWeek: 2, startTime: '10:00', endTime: '11:00', kind: 'theory', room: 'CS-302' },
  { id: 'tt-t3', subjectId: 'sub-os', dayOfWeek: 2, startTime: '11:30', endTime: '13:30', kind: 'lab', room: 'Systems Lab' },
  { id: 'tt-t4', subjectId: 'sub-es', dayOfWeek: 2, startTime: '14:30', endTime: '15:30', kind: 'theory', room: 'EC-105' },

  // Wednesday (3)
  { id: 'tt-w1', subjectId: 'sub-dsa', dayOfWeek: 3, startTime: '09:00', endTime: '10:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-w2', subjectId: 'sub-cn', dayOfWeek: 3, startTime: '10:00', endTime: '11:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-w3', subjectId: 'sub-es', dayOfWeek: 3, startTime: '11:30', endTime: '12:30', kind: 'theory', room: 'EC-105' },

  // Thursday (4)
  { id: 'tt-th1', subjectId: 'sub-os', dayOfWeek: 4, startTime: '09:00', endTime: '10:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-th2', subjectId: 'sub-dsa', dayOfWeek: 4, startTime: '10:00', endTime: '11:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-th3', subjectId: 'sub-cn', dayOfWeek: 4, startTime: '14:00', endTime: '16:00', kind: 'lab', room: 'Hardware Lab' },

  // Friday (5) - Today in current demo flow!
  { id: 'tt-f1', subjectId: 'sub-dsa', dayOfWeek: 5, startTime: '09:00', endTime: '10:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-f2', subjectId: 'sub-os', dayOfWeek: 5, startTime: '10:00', endTime: '11:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-f3', subjectId: 'sub-math', dayOfWeek: 5, startTime: '11:30', endTime: '12:30', kind: 'theory', room: 'CS-301' },
  { id: 'tt-f4', subjectId: 'sub-es', dayOfWeek: 5, startTime: '14:00', endTime: '15:00', kind: 'theory', room: 'EC-105' },

  // Saturday (6)
  { id: 'tt-s1', subjectId: 'sub-math', dayOfWeek: 6, startTime: '09:30', endTime: '11:00', kind: 'theory', room: 'CS-301' },
  { id: 'tt-s2', subjectId: 'sub-cn', dayOfWeek: 6, startTime: '11:15', endTime: '12:45', kind: 'theory', room: 'CS-301' },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // DSA (Theory: 22 attended out of 25 -> 88%)
  ...Array.from({ length: 22 }).map((_, i) => ({
    id: `att-dsa-p-${i}`,
    date: `2026-10-${String(Math.min(28, (i % 28) + 1)).padStart(2, '0')}`,
    subjectId: 'sub-dsa',
    kind: 'theory' as const,
    status: 'present' as const,
    updatedAt: new Date().toISOString(),
  })),
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `att-dsa-a-${i}`,
    date: `2026-10-0${i + 5}`,
    subjectId: 'sub-dsa',
    kind: 'theory' as const,
    status: 'absent' as const,
    updatedAt: new Date().toISOString(),
  })),

  // OS (Theory: 16 attended out of 23 -> 69.5%, BELOW 75% TARGET to demonstrate red warning & recovery calculator!)
  ...Array.from({ length: 16 }).map((_, i) => ({
    id: `att-os-p-${i}`,
    date: `2026-10-${String(Math.min(28, (i % 28) + 1)).padStart(2, '0')}`,
    subjectId: 'sub-os',
    kind: 'theory' as const,
    status: 'present' as const,
    updatedAt: new Date().toISOString(),
  })),
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: `att-os-a-${i}`,
    date: `2026-10-${String(10 + i).padStart(2, '0')}`,
    subjectId: 'sub-os',
    kind: 'theory' as const,
    status: 'absent' as const,
    note: 'Fever / Campus fest',
    updatedAt: new Date().toISOString(),
  })),

  // Math (19 / 20 -> 95%)
  ...Array.from({ length: 19 }).map((_, i) => ({
    id: `att-math-p-${i}`,
    date: `2026-10-${String(Math.min(28, (i % 28) + 1)).padStart(2, '0')}`,
    subjectId: 'sub-math',
    kind: 'theory' as const,
    status: 'present' as const,
    updatedAt: new Date().toISOString(),
  })),
  {
    id: `att-math-a-1`,
    date: `2026-10-14`,
    subjectId: 'sub-math',
    kind: 'theory',
    status: 'absent',
    updatedAt: new Date().toISOString(),
  },

  // DSA Lab (8 / 9 -> 88.8%)
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `att-dsalab-p-${i}`,
    date: `2026-10-${String(Math.min(28, (i % 28) + 1)).padStart(2, '0')}`,
    subjectId: 'sub-dsa',
    kind: 'lab' as const,
    status: 'present' as const,
    updatedAt: new Date().toISOString(),
  })),
  {
    id: `att-dsalab-a-1`,
    date: `2026-10-07`,
    subjectId: 'sub-dsa',
    kind: 'lab',
    status: 'absent',
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-cie1',
    type: 'CIE 1 (Continuous Internal Evaluation)',
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    subjects: [
      {
        id: 'es-1',
        subjectId: 'sub-dsa',
        syllabus: [
          { id: 'syl-1', title: 'Unit 1: Asymptotic Notation & Amortized Analysis', done: true },
          { id: 'syl-2', title: 'Unit 2: Balanced Search Trees (AVL, Red-Black)', done: true },
          { id: 'syl-3', title: 'Unit 3: Priority Queues & Binomial Heaps', done: true },
        ],
        expectedQuiz: 8,
        obtainedQuiz: 9, // +1 (Green)
        quizMax: 10,
        expectedExam: 38,
        obtainedExam: 42, // +4 (Green)
        examMax: 50,
      },
      {
        id: 'es-2',
        subjectId: 'sub-os',
        syllabus: [
          { id: 'syl-4', title: 'Unit 1: Process Management & CPU Scheduling', done: true },
          { id: 'syl-5', title: 'Unit 2: Inter-Process Communication & Mutexes', done: true },
          { id: 'syl-6', title: 'Unit 3: Deadlocks: Banker Algorithm', done: false },
        ],
        expectedQuiz: 9,
        obtainedQuiz: 7, // -2 (Red)
        quizMax: 10,
        expectedExam: 40,
        obtainedExam: 35, // -5 (Red)
        examMax: 50,
      },
      {
        id: 'es-3',
        subjectId: 'sub-math',
        syllabus: [
          { id: 'syl-7', title: 'Unit 1: Propositional & Predicate Logic', done: true },
          { id: 'syl-8', title: 'Unit 2: Combinatorics & Generating Functions', done: true },
        ],
        expectedQuiz: 9,
        obtainedQuiz: 10, // +1 (Green)
        quizMax: 10,
        expectedExam: 45,
        obtainedExam: 46, // +1 (Green)
        examMax: 50,
      },
    ],
  },
  {
    id: 'exam-cie2',
    type: 'CIE 2',
    startDate: '2026-11-12',
    endDate: '2026-11-18',
    subjects: [
      {
        id: 'es-4',
        subjectId: 'sub-dsa',
        syllabus: [
          { id: 'syl-9', title: 'Unit 4: Graph Algorithms (Dijkstra, Bellman-Ford)', done: true },
          { id: 'syl-10', title: 'Unit 5: Dynamic Programming & NP-Completeness', done: false },
        ],
        expectedQuiz: 9,
        quizMax: 10,
        expectedExam: 44,
        examMax: 50,
      },
    ],
  },
];

export const INITIAL_SEMESTERS: SemesterRecord[] = [
  {
    number: 1,
    sgpa: 9.15,
    courses: [
      { name: 'Mathematics I', credits: 4, marks: 92, grade: 'O', gradePoint: 10 },
      { name: 'Engineering Physics', credits: 4, marks: 84, grade: 'A+', gradePoint: 9 },
      { name: 'Basic Electrical Engg', credits: 3, marks: 81, grade: 'A+', gradePoint: 9 },
      { name: 'Elements of Civil Engg', credits: 3, marks: 74, grade: 'A', gradePoint: 8 },
      { name: 'Computer Programming', credits: 3, marks: 95, grade: 'O', gradePoint: 10 },
      { name: 'Physics & Programming Lab', credits: 2, marks: 94, grade: 'O', gradePoint: 10 },
    ],
  },
  {
    number: 2,
    sgpa: 8.85,
    courses: [
      { name: 'Mathematics II', credits: 4, marks: 85, grade: 'A+', gradePoint: 9 },
      { name: 'Engineering Chemistry', credits: 4, marks: 78, grade: 'A', gradePoint: 8 },
      { name: 'Basic Electronics', credits: 3, marks: 88, grade: 'A+', gradePoint: 9 },
      { name: 'Elements of Mech Engg', credits: 3, marks: 71, grade: 'A', gradePoint: 8 },
      { name: 'Object Oriented Programming', credits: 3, marks: 96, grade: 'O', gradePoint: 10 },
      { name: 'Chemistry & OOP Lab', credits: 2, marks: 91, grade: 'O', gradePoint: 10 },
    ],
  },
  {
    number: 3,
    sgpa: 8.92,
    courses: [
      { name: 'Linear Algebra & Calc', credits: 4, marks: 82, grade: 'A+', gradePoint: 9 },
      { name: 'Digital Logic Design', credits: 4, marks: 87, grade: 'A+', gradePoint: 9 },
      { name: 'Computer Organization', credits: 3, marks: 76, grade: 'A', gradePoint: 8 },
      { name: 'Data Structures in C', credits: 4, marks: 93, grade: 'O', gradePoint: 10 },
      { name: 'DLD & DS Lab', credits: 2, marks: 92, grade: 'O', gradePoint: 10 },
    ],
  },
  {
    number: 4, // Current in-progress semester
    courses: [
      { name: 'Data Structures & Algorithms', credits: 4.5, marks: 86, grade: 'A+', gradePoint: 9 },
      { name: 'Operating Systems', credits: 4.5, marks: 78, grade: 'A', gradePoint: 8 },
      { name: 'Discrete Mathematics', credits: 4, marks: 91, grade: 'O', gradePoint: 10 },
      { name: 'Computer Networks', credits: 4, marks: 80, grade: 'A+', gradePoint: 9 },
      { name: 'Embedded Systems & IoT', credits: 3, marks: 74, grade: 'A', gradePoint: 8 },
    ],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Red-Black Tree insertion assignment',
    date: new Date().toISOString().split('T')[0],
    subjectId: 'sub-dsa',
    done: false,
    priority: 'high',
    notes: 'Implement fixup algorithm and rotation cases',
  },
  {
    id: 'task-2',
    title: 'Revise Banker Algorithm deadlock avoidance for CIE 1 retest',
    date: new Date().toISOString().split('T')[0],
    subjectId: 'sub-os',
    done: true,
    priority: 'medium',
  },
  {
    id: 'task-3',
    title: 'Solve Combinatorics exercise problems 4.1 to 4.8',
    date: new Date().toISOString().split('T')[0],
    subjectId: 'sub-math',
    done: false,
    priority: 'low',
  },
];

export const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'dl-1',
    title: 'OS Lab: Multithreaded Matrix Multiplication Record Submission',
    subjectId: 'sub-os',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 'dl-2',
    title: 'DSA Mini-Project Architecture & GitHub Repository Link',
    subjectId: 'sub-dsa',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // In 3 days
    priority: 'high',
    status: 'todo',
  },
  {
    id: 'dl-3',
    title: 'Discrete Math Assignment 3: Pigeonhole Principle Proofs',
    subjectId: 'sub-math',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    priority: 'medium',
    status: 'todo',
  },
];

export const INITIAL_STREAKS: StreakRecord = {
  current: 8,
  longest: 14,
  lastDate: new Date().toISOString().split('T')[0],
  badges: [
    '7-Day Streak Master',
    '100% Attendance Week',
    'Syllabus Finisher',
    'Focus Zen (50+ Hours)',
  ],
};

export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'fs-1',
    subjectId: 'sub-dsa',
    startedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    durationMin: 50,
    type: 'focus',
  },
  {
    id: 'fs-2',
    subjectId: 'sub-os',
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    durationMin: 25,
    type: 'focus',
  },
];
