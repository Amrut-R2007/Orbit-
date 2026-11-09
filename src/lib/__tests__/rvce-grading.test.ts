import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  marksToGrade,
  calculateSGPA,
  calculateCGPA,
  calculateRequiredSGPA,
  type CourseGradeEntry,
  type SemesterRecord,
} from '../rvce-grading.ts';

describe('RVCE Grading Scale & Logic', () => {
  it('correctly maps mark ranges to RVCE grade letter and points', () => {
    assert.deepStrictEqual(marksToGrade(95), { grade: 'O', gradePoint: 10, level: 'Outstanding' });
    assert.deepStrictEqual(marksToGrade(82), { grade: 'A+', gradePoint: 9, level: 'Excellent' });
    assert.deepStrictEqual(marksToGrade(74), { grade: 'A', gradePoint: 8, level: 'Very Good' });
    assert.deepStrictEqual(marksToGrade(65), { grade: 'B+', gradePoint: 7, level: 'Good' });
    assert.deepStrictEqual(marksToGrade(57), { grade: 'B', gradePoint: 6, level: 'Above Average' });
    assert.deepStrictEqual(marksToGrade(52), { grade: 'C', gradePoint: 5, level: 'Average' });
    assert.deepStrictEqual(marksToGrade(45), { grade: 'P', gradePoint: 4, level: 'Pass' });
    assert.deepStrictEqual(marksToGrade(32), { grade: 'F', gradePoint: 0, level: 'Fail' });
  });

  it('correctly tests all critical boundary marks (39/40, 49/50, 54/55, 89/90)', () => {
    // 39 vs 40 boundary (Fail vs Pass)
    assert.deepStrictEqual(marksToGrade(39), { grade: 'F', gradePoint: 0, level: 'Fail' });
    assert.deepStrictEqual(marksToGrade(40), { grade: 'P', gradePoint: 4, level: 'Pass' });

    // 49 vs 50 boundary (Pass vs Average)
    assert.deepStrictEqual(marksToGrade(49), { grade: 'P', gradePoint: 4, level: 'Pass' });
    assert.deepStrictEqual(marksToGrade(50), { grade: 'C', gradePoint: 5, level: 'Average' });

    // 54 vs 55 boundary (Average vs Above Average)
    assert.deepStrictEqual(marksToGrade(54), { grade: 'C', gradePoint: 5, level: 'Average' });
    assert.deepStrictEqual(marksToGrade(55), { grade: 'B', gradePoint: 6, level: 'Above Average' });

    // 89 vs 90 boundary (Excellent vs Outstanding)
    assert.deepStrictEqual(marksToGrade(89), { grade: 'A+', gradePoint: 9, level: 'Excellent' });
    assert.deepStrictEqual(marksToGrade(90), { grade: 'O', gradePoint: 10, level: 'Outstanding' });
  });

  it('calculates SGPA correctly and excludes transitional W grades from denominator and numerator', () => {
    const courses: CourseGradeEntry[] = [
      { name: 'Course 1', credits: 4, grade: 'O', gradePoint: 10 },    // 40
      { name: 'Course 2', credits: 4, grade: 'A+', gradePoint: 9 },   // 36
      { name: 'Course 3', credits: 3, grade: 'A', gradePoint: 8 },    // 24
      { name: 'Course 4 (Withdrawn)', credits: 3, grade: 'W', gradePoint: 0, withdrawn: true }, // Excluded!
    ];

    const result = calculateSGPA(courses);
    // Eligible credits = 4 + 4 + 3 = 11
    // Total points = 40 + 36 + 24 = 100
    // SGPA = 100 / 11 = 9.090909... -> 9.09
    assert.strictEqual(result.totalCredits, 11);
    assert.strictEqual(result.earnedPoints, 100);
    assert.strictEqual(result.sgpa, 9.09);
  });

  it('calculates CGPA correctly and excludes F grades and W grades', () => {
    const semesters: SemesterRecord[] = [
      {
        number: 1,
        courses: [
          { name: 'C1', credits: 4, grade: 'O', gradePoint: 10 }, // 40
          { name: 'C2', credits: 4, grade: 'A', gradePoint: 8 },  // 32
        ],
      },
      {
        number: 2,
        courses: [
          { name: 'C3', credits: 4, grade: 'A+', gradePoint: 9 }, // 36
          { name: 'C4 (Failed)', credits: 4, grade: 'F', gradePoint: 0 }, // Excluded from CGPA!
          { name: 'C5 (Withdrawn)', credits: 2, grade: 'W', gradePoint: 0, withdrawn: true }, // Excluded!
        ],
      },
    ];

    const result = calculateCGPA(semesters);
    // CGPA eligible credits = 4 + 4 + 4 = 12
    // Points = 40 + 32 + 36 = 108
    // CGPA = 108 / 12 = 9.00
    // Equivalent % = 9.00 * 10 = 90.00
    assert.strictEqual(result.totalCredits, 12);
    assert.strictEqual(result.earnedPoints, 108);
    assert.strictEqual(result.cgpa, 9.0);
    assert.strictEqual(result.equivalentPercentage, 90.0);
  });

  it('handles empty semesters and edge cases gracefully without NaN', () => {
    // Empty courses list
    const emptySGPA = calculateSGPA([]);
    assert.strictEqual(emptySGPA.sgpa, 0);
    assert.strictEqual(emptySGPA.totalCredits, 0);
    assert.strictEqual(emptySGPA.earnedPoints, 0);

    // Only withdrawn courses
    const allWithdrawn = calculateSGPA([
      { name: 'W1', credits: 3, grade: 'W', gradePoint: 0, withdrawn: true },
      { name: 'W2', credits: 4, grade: 'W', gradePoint: 0, withdrawn: true },
    ]);
    assert.strictEqual(allWithdrawn.sgpa, 0);
    assert.strictEqual(allWithdrawn.totalCredits, 0);

    // Empty semesters for CGPA
    const emptyCGPA = calculateCGPA([]);
    assert.strictEqual(emptyCGPA.cgpa, 0);
    assert.strictEqual(emptyCGPA.totalCredits, 0);
    assert.strictEqual(emptyCGPA.equivalentPercentage, 0);
  });

  it('verifies rounding to 2 decimal places with precision', () => {
    // 50 points across 6 credits = 8.333333... -> 8.33
    const c1: CourseGradeEntry[] = [
      { name: 'Course A', credits: 3, grade: 'A+', gradePoint: 9 }, // 27
      { name: 'Course B', credits: 3, grade: 'B', gradePoint: 6 },  // 18
      { name: 'Course C', credits: 1, grade: 'C', gradePoint: 5 },  // 5
    ];
    // 50 / 7 = 7.142857... -> 7.14
    const res = calculateSGPA(c1);
    assert.strictEqual(res.sgpa, 7.14);
  });

  it('evaluates What-If Target Mode correctly', () => {
    // Current past credits = 60, past points = 510 (CGPA = 8.5)
    // Upcoming semester credits = 20
    // Target CGPA = 8.75
    // Total future credits = 80 -> Required points = 80 * 8.75 = 700
    // Needed points = 700 - 510 = 190
    // Required SGPA = 190 / 20 = 9.5
    const result = calculateRequiredSGPA(60, 510, 20, 8.75);
    assert.strictEqual(result.isAchievable, true);
    assert.strictEqual(result.requiredSGPA, 9.5);

    // Unreachable test (> 10)
    const impossible = calculateRequiredSGPA(60, 480, 20, 9.8);
    assert.strictEqual(impossible.isAchievable, false);
  });
});
