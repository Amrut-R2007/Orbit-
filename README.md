# Orbit by ByteCraft Studio 🌿 (v2)

Orbit is a production-ready, mobile-first academic web application engineered for college students to track **academic productivity, lecture and laboratory attendance, and semester progression**.

Built under the **ByteCraft Studio** umbrella with a distinctive tropical botanical line-art visual identity (monstera, palm frond, taro, and hatched foliage) featuring dynamic SVG theme recoloring (Warm Cream & Peach in light mode, Midnight Charcoal & Violet in dark mode).

---

## 🌟 What's New in v2

### 1. Distinct Signature Page Transitions by Route
Every section route change triggers its own unique botanical transition component (600–900ms):
- **Dashboard (`/dashboard`)**: *Sunrise Bloom* — leaves unfurl outward from the center like a flower opening with an expanding radial glow.
- **Subjects (`/subjects`)**: *Book-Leaf Flip* — a large Monstera leaf flips like a turning page from the edge.
- **Timetable (`/timetable`)**: *Vine Sweep* — an SVG vine draws itself across the viewport with sprouting foliage.
- **Master Calendar (`/calendar`)**: *Leaf-Fall Curtain* — small leaves tumble from the top, tiling the screen before blowing away.
- **Exams (`/exams`)**: *Palm-Frond Wipe* — two palm fronds sweep in from opposite sides, meet, and part like doors.
- **Attendance Predictor (`/predictor`)**: *Ripple Orbit* — concentric expanding orbit rings with leaves riding the perimeter.
- **SGPA / CGPA (`/gpa`)**: *Growth Rings* — tree-ring concentric circles expand while an upward stem sprouts leaves.
- **Focus Timer (`/focus`)**: *Breeze Fade* — a calm diagonal gust moves blurred leaves in a quiet, tranquil fade.
- **Deadlines (`/deadlines`)**: *Snap-In* — brisk rush of foliage from the bottom right with spring overshoot.
- **Streaks & Badges (`/streaks`)**: *Confetti Burst* — celebratory radial explosion of leaf-shaped confetti.
- **Settings (`/settings`)**: *Simple Slide* — minimalist outline leaf tracing cleanly along the edge.
- *Rules*: Directional transitions reverse when navigating backward; lighter on mobile; `prefers-reduced-motion` uses an instant 200ms fade.

### 2. Ambient Background Motion Layer
Fixed non-interactive background layer (`pointer-events: none`, behind content, WCAG AA contrast) with slow, calming motion:
- **Dashboard**: Slow leaves drifting from top-right corner.
- **Subjects**: Swaying grass blades with soft wind parallax.
- **Timetable**: Creeping edge vines with tiny unfurling leaves.
- **Calendar**: Soft petals floating diagonally across the screen.
- **Exams**: Corner palm fronds swaying gently.
- **Attendance Predictor**: Faint rotating concentric orbit rings with an orbiting leaf.
- **SGPA / CGPA**: Slow-growing stems rising from the corner.
- **Focus Timer**: Ultra-calm motionless leaves with soft breathing glow.
- **Deadlines**: Gently drifting leaves providing subtle momentum.
- **Streaks & Badges**: Occasional sparkles and leaf glints.
- **Settings**: Static or minimal sway.
- *Controls*: Cursor repulsion (leaves lean away from pointer / device tilt on mobile); Settings toggle (`Full` / `Reduced` / `Off`); automatically paused when tab is inactive.

---

## 📚 Core Modules Overview

1. **Dashboard Overview**
   - Dynamic greeting with date and prominent daily streak badge.
   - **Today's Classes** generated directly from active weekday's timetable with one-tap **Present / Absent / Cancelled** buttons.
   - Surfaced active submissions and priority tasks.
   - Quick stats row: overall attendance %, under-target flag, upcoming exam countdown, tasks completed.

2. **Subjects & Dual Streams**
   - Course CRUD with credits tally.
   - **"Has Lab" Toggle**: Independently tracks Theory lectures and Laboratory blocks under one card with dual percentage gauges and bunk buffers.

3. **Timetable Builder**
   - Mon–Sat weekly grid supporting multi-hour lecture and lab slots.
   - **Copy Day**: Duplicate any day's timetable schedule to another weekday.
   - Feeds both the Dashboard and the Master Calendar.

4. **Master Calendar (Retroactive Attendance)**
   - Monthly calendar with attendance status cells (Green = all attended, Red = absences, Amber = holiday, Blue = tasks, Rose = deadlines).
   - Date inspector sheet for retroactive status marking with excuse notes and whole-day holiday declarations.

5. **Attendance Predictor (Bunk Calculator)**
   - Dual live sliders ("Classes to Skip" and "Classes to Attend") feeding an animated SVG gauge.
   - Clear recommendations: Safe Bunk Buffer and Consecutive Recovery Targets.

6. **Exams & CIE Syllabus Tracker**
   - CIE 1, CIE 2, and Semester End Exams with unit checklist progress bar.
   - **Strict Green/Red Marks Rule**: Highlights marks in green if obtained &gt; expected (`+3`), red if lower (`-2`), and neutral grey while pending.
   - Performance bar chart summary with Recharts.

7. **RVCE SGPA / CGPA Engine**
   - Implements autonomous **RVCE Autonomous Scheme**:
     - Grade letters `O (10)`, `A+ (9)`, `A (8)`, `B+ (7)`, `B (6)`, `C (5)`, `P (4)`, `F (0)`.
     - **Transitional W (Withdrawn) excluded** from SGPA calculation.
     - **F (Fail) excluded from cumulative CGPA credits/points**.
     - Equivalent Percentage = `CGPA × 10`.
     - Second attempt `(*)` and three or more attempts `(**)` tracking.
   - **What-If Planner**: Calculates required SGPA needed this semester to achieve a target CGPA.
   - Substituted mathematical formula live preview.
   - Unit tests covering all boundaries (`npm test`).

8. **Focus Timer (Pomodoro)**
   - 25/5 and 50/10 presets linked to specific subjects.
   - Background-safe wall-clock timestamps (maintains accuracy in background tabs).
   - 528 Hz synthesized Web Audio bell chime.
   - Study analytics: study hours by subject chart and session logs.

9. **Deadlines & Smart Reminders**
   - Assignments and lab records with urgency badges (*Overdue*, *Due Today*, *Due Tomorrow*).
   - Firebase Cloud Messaging web push background handler (`public/firebase-messaging-sw.js`).

10. **Streaks & Badges**
    - Daily attendance, task, and focus streaks.
    - Badges with celebratory peach/purple leaf confetti particles.

11. **PWA Support**
    - `manifest.json` and `sw.js` for offline campus installation.

---

## 🚀 Running the App

```bash
# 1. Install dependencies
npm install

# 2. Run unit test suite
npm test

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔥 Firebase Setup & Firestore Structure

### Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### Document Collections Schema
```
users/{uid}
  profile: { name, email, college, branch, semester, attendanceTarget, semStart, semEnd, theme, motion: "full"|"reduced"|"off", notifications: { classes, attendance, exams, deadlines }, fcmToken }

users/{uid}/subjects/{subjectId}
  { name, code, credits, hasLab: boolean, labCredits?, faculty?, color, type: "theory" | "theory+lab" }

users/{uid}/timetable/{slotId}
  { subjectId, dayOfWeek (0-6), startTime, endTime, kind: "theory" | "lab", room? }

users/{uid}/attendance/{yyyy-MM-dd_slotId}
  { date, subjectId, kind: "theory" | "lab", status: "present" | "absent" | "cancelled" | "holiday", note?, updatedAt }

users/{uid}/tasks/{taskId}
  { title, date, subjectId?, done, priority, notes? }

users/{uid}/events/{eventId}
  { title, date, startTime?, endTime?, type, subjectId? }

users/{uid}/semesters/{semId} (1 to 8)
  { number, sgpa?, courses: [{ subjectId?, name, credits, marks?, grade, gradePoint, attempt: 1|2|3, withdrawn: boolean }] }

users/{uid}/focusSessions/{sessionId}
  { subjectId?, startedAt, durationMin, type: "focus" | "break" }

users/{uid}/deadlines/{deadlineId}
  { title, subjectId?, dueDate, priority, status: "todo" | "in_progress" | "submitted" }

users/{uid}/streaks/{type}
  { current, longest, lastDate, badges: string[] }

users/{uid}/exams/{examId}
  { type, startDate?, endDate?, subjects: [{ subjectId, syllabus, expectedQuiz, obtainedQuiz, quizMax, expectedExam, obtainedExam, examMax }] }
```

---

## 🍃 Designed by ByteCraft Studio
*Orbit your semester in calm, focused tranquility.*
