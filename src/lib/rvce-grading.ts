export interface GradeDef {
  minMarks: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
  level: string;
}

export const RVCE_GRADING_SCALE: GradeDef[] = [
  { minMarks: 90, maxMarks: 100, grade: 'O', gradePoint: 10, level: 'Outstanding' },
  { minMarks: 80, maxMarks: 89, grade: 'A+', gradePoint: 9, level: 'Excellent' },
  { minMarks: 70, maxMarks: 79, grade: 'A', gradePoint: 8, level: 'Very Good' },
  { minMarks: 60, maxMarks: 69, grade: 'B+', gradePoint: 7, level: 'Good' },
  { minMarks: 55, maxMarks: 59, grade: 'B', gradePoint: 6, level: 'Above Average' },
  { minMarks: 50, maxMarks: 54, grade: 'C', gradePoint: 5, level: 'Average' },
  { minMarks: 40, maxMarks: 49, grade: 'P', gradePoint: 4, level: 'Pass' },
  { minMarks: 0, maxMarks: 39, grade: 'F', gradePoint: 0, level: 'Fail' },
];

export interface CourseGradeEntry {
  subjectId?: string;
  name: string;
  credits: number;
  marks?: number;
  grade: string;
  gradePoint: number;
  attempt?: 1 | 2 | 3; // 1 = regular, 2 = (*), 3 = (**)
  withdrawn?: boolean; // W grade
}

export interface SemesterRecord {
  number: number;
  courses: CourseGradeEntry[];
  sgpa?: number;
}

/**
 * Converts numeric marks (0-100) to RVCE grade letter, grade point, and level
 */
export function marksToGrade(marks: number): { grade: string; gradePoint: number; level: string } {
  const clamped = Math.max(0, Math.min(100, Math.round(marks)));
  for (const item of RVCE_GRADING_SCALE) {
    if (clamped >= item.minMarks && clamped <= item.maxMarks) {
      return { grade: item.grade, gradePoint: item.gradePoint, level: item.level };
    }
  }
  return { grade: 'F', gradePoint: 0, level: 'Fail' };
}

/**
 * SGPA Calculation:
 * SGPA = Σ(course credits × grade points) / Σ(course credits),
 * over all registered courses in that semester, excluding transitional grades (W).
 */
export function calculateSGPA(courses: CourseGradeEntry[]): {
  sgpa: number;
  totalCredits: number;
  earnedPoints: number;
  formulaString: string;
} {
  const eligibleCourses = courses.filter((c) => !c.withdrawn && c.grade !== 'W');

  if (eligibleCourses.length === 0) {
    return { sgpa: 0, totalCredits: 0, earnedPoints: 0, formulaString: 'No eligible courses registered' };
  }

  let totalCredits = 0;
  let earnedPoints = 0;
  const terms: string[] = [];

  for (const c of eligibleCourses) {
    totalCredits += c.credits;
    earnedPoints += c.credits * c.gradePoint;
    terms.push(`(${c.credits} × ${c.gradePoint})`);
  }

  if (totalCredits === 0) {
    return { sgpa: 0, totalCredits: 0, earnedPoints: 0, formulaString: '0 credits registered' };
  }

  const rawSgpa = earnedPoints / totalCredits;
  const roundedSgpa = Math.round(rawSgpa * 100) / 100;
  const formulaString = `SGPA = [${terms.join(' + ')}] / ${totalCredits} = ${earnedPoints} / ${totalCredits} = ${roundedSgpa.toFixed(2)}`;

  return {
    sgpa: roundedSgpa,
    totalCredits,
    earnedPoints,
    formulaString,
  };
}

/**
 * CGPA Calculation:
 * CGPA = Σ(course credits × grade points) / Σ(course credits),
 * over all registered courses up to that semester, excluding F grades and W grades.
 */
export function calculateCGPA(semesters: SemesterRecord[]): {
  cgpa: number;
  totalCredits: number;
  earnedPoints: number;
  equivalentPercentage: number;
  formulaString: string;
} {
  let totalCredits = 0;
  let earnedPoints = 0;
  const terms: string[] = [];

  for (const sem of semesters) {
    for (const c of sem.courses) {
      // Exclude W and F grades
      if (c.withdrawn || c.grade === 'W' || c.grade === 'F' || c.gradePoint === 0) {
        continue;
      }
      totalCredits += c.credits;
      earnedPoints += c.credits * c.gradePoint;
      terms.push(`(${c.credits} × ${c.gradePoint})`);
    }
  }

  if (totalCredits === 0) {
    return {
      cgpa: 0,
      totalCredits: 0,
      earnedPoints: 0,
      equivalentPercentage: 0,
      formulaString: 'No graded credits accumulated',
    };
  }

  const rawCgpa = earnedPoints / totalCredits;
  const roundedCgpa = Math.round(rawCgpa * 100) / 100;
  const equivalentPercentage = Math.round(roundedCgpa * 10 * 100) / 100;
  const formulaString = `CGPA = [Σ Credits × Grade Points (excl. F, W)] / Σ Credits = ${earnedPoints} / ${totalCredits} = ${roundedCgpa.toFixed(2)}`;

  return {
    cgpa: roundedCgpa,
    totalCredits,
    earnedPoints,
    equivalentPercentage,
    formulaString,
  };
}

/**
 * What-If Target Mode:
 * Computes required SGPA for the current/upcoming semester with `currentSemCredits`
 * to achieve a `targetCGPA` given past cumulative credits and past cumulative grade points.
 */
export function calculateRequiredSGPA(
  pastCredits: number,
  pastPoints: number,
  currentSemCredits: number,
  targetCGPA: number
): {
  requiredSGPA: number;
  isAchievable: boolean;
  explanation: string;
} {
  if (currentSemCredits <= 0) {
    return {
      requiredSGPA: 0,
      isAchievable: false,
      explanation: 'Current semester must have at least 1 credit.',
    };
  }

  const totalFutureCredits = pastCredits + currentSemCredits;
  const requiredTotalPoints = targetCGPA * totalFutureCredits;
  const requiredCurrentPoints = requiredTotalPoints - pastPoints;
  const neededSGPA = requiredCurrentPoints / currentSemCredits;
  const rounded = Math.round(neededSGPA * 100) / 100;

  if (rounded > 10.0) {
    return {
      requiredSGPA: rounded,
      isAchievable: false,
      explanation: `Mathematically unreachable (requires ${rounded.toFixed(2)}, maximum possible SGPA is 10.00).`,
    };
  }

  if (rounded <= 0) {
    return {
      requiredSGPA: 0,
      isAchievable: true,
      explanation: `Already well on track! Even with minimum pass (0.00), target is met.`,
    };
  }

  return {
    requiredSGPA: rounded,
    isAchievable: true,
    explanation: `You need an SGPA of at least ${rounded.toFixed(2)} across your ${currentSemCredits} credits this semester.`,
  };
}
