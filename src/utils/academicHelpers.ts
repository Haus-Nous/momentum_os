import { Course } from '../types';

export const INDIAN_GRADE_POINTS: Record<string, { points: number; label: string }> = {
  'O': { points: 10.0, label: 'O (10.0 - Outstanding)' },
  'A+': { points: 9.0, label: 'A+ (9.0 - Excellent)' },
  'A': { points: 8.0, label: 'A (8.0 - Very Good)' },
  'B+': { points: 7.0, label: 'B+ (7.0 - Good)' },
  'B': { points: 6.0, label: 'B (6.0 - Above Average)' },
  'C': { points: 5.0, label: 'C (5.0 - Average)' },
  'P': { points: 4.0, label: 'P (4.0 - Pass)' },
  'F': { points: 0.0, label: 'F (0.0 - Fail)' },
};

export function calculateCGPA(courses: Course[]): { 
  cgpa: string; 
  totalCredits: number; 
  gradedCredits: number; 
  gradedCourseCount: number;
} {
  let totalGradePoints = 0;
  let gradedCredits = 0;
  let totalCredits = 0;
  let gradedCourseCount = 0;

  courses.forEach((course) => {
    const credits = Number(course.credits) || 0;
    totalCredits += credits;

    if (course.grade && course.grade.trim() !== '') {
      const normalizedGrade = course.grade.trim().toUpperCase();
      let gradePoint: number | undefined;

      if (INDIAN_GRADE_POINTS[normalizedGrade] !== undefined) {
        gradePoint = INDIAN_GRADE_POINTS[normalizedGrade].points;
      } else if (!isNaN(Number(course.grade))) {
        gradePoint = Math.min(10, Math.max(0, Number(course.grade)));
      }

      if (gradePoint !== undefined) {
        totalGradePoints += gradePoint * credits;
        gradedCredits += credits;
        gradedCourseCount++;
      }
    }
  });

  if (gradedCredits === 0) {
    return { cgpa: '--', totalCredits, gradedCredits: 0, gradedCourseCount: 0 };
  }

  const cgpa = (totalGradePoints / gradedCredits).toFixed(2);
  return { cgpa, totalCredits, gradedCredits, gradedCourseCount };
}
