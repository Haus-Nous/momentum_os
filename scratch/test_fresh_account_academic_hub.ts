import { initialUserProfile } from '../src/utils/initialData';
import { calculateCGPA } from '../src/utils/academicHelpers';

console.log("=== FRESH ACCOUNT ACADEMIC HUB DATA AUDIT ===");

const freshProfile = { ...initialUserProfile };
const freshCourses: any[] = [];
const cgpaStats = calculateCGPA(freshCourses);
const targetGoal = freshProfile.cgpaGoal ? (freshProfile.cgpaGoal as number).toFixed(2) : '--';

console.log(`Fresh User Profile:`);
console.log(`- Name: "${freshProfile.name || 'Not set'}"`);
console.log(`- Role: "${freshProfile.role}"`);
console.log(`- XP: ${freshProfile.xp}`);
console.log(`- Coins: ${freshProfile.coins}`);
console.log(`- Streak Days: ${freshProfile.streakDays}`);
console.log(`- CGPA Goal: ${freshProfile.cgpaGoal || 'undefined'}`);

console.log(`\nAcademic Hub Display Verification for Fresh Account:`);
console.log(`- Current CGPA: "${cgpaStats.cgpa}" (Expected "--")`);
console.log(`- Target Goal: "${targetGoal}" (Expected "--")`);
console.log(`- Graded Courses: ${cgpaStats.gradedCourseCount} / ${freshCourses.length}`);

const isCgpaClean = cgpaStats.cgpa === '--';
const isTargetGoalClean = targetGoal === '--';
const isCoinsClean = freshProfile.coins === 0;

console.log(`\nVERIFICATION SUMMARY:`);
console.log(`- CGPA Clean ("--"): ${isCgpaClean ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log(`- Target Goal Clean ("--"): ${isTargetGoalClean ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log(`- Coins Clean (0): ${isCoinsClean ? 'PASSED ✅' : 'FAILED ❌'}`);
