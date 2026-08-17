import { Task, Habit, SystemRoutine, FocusSession, Assignment, Internship, Hackathon, Project, Goal } from '../types';

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const calculateMomentumScore = (
  tasks: Task[],
  habits: Habit[],
  routines: SystemRoutine[],
  focusSessions: FocusSession[]
): number => {
  const todayStr = getTodayDateString();

  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || t.status === 'today');
  const completedTodayTasks = todayTasks.filter((t) => t.status === 'completed');
  const taskRatio = todayTasks.length > 0 ? completedTodayTasks.length / todayTasks.length : 0;

  const activeHabits = habits.filter((h) => h.status === 'active');
  const completedHabits = activeHabits.filter((h) => h.completionHistory[todayStr] === 'completed');
  const habitRatio = activeHabits.length > 0 ? completedHabits.length / activeHabits.length : 0;

  const completedRoutines = routines.filter((r) => r.isCompletedToday);
  const routineRatio = routines.length > 0 ? completedRoutines.length / routines.length : 0;

  const totalFocusMinsToday = focusSessions
    .filter((s) => s.timestamp.startsWith(todayStr))
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const focusRatio = Math.min(1, totalFocusMinsToday / 100);

  const weightedScore = Math.round(
    taskRatio * 35 + habitRatio * 35 + routineRatio * 15 + focusRatio * 15
  );

  return Math.min(100, Math.max(0, weightedScore));
};

export const calculateLifeScore = (
  habits: Habit[],
  tasks: Task[],
  goals: Goal[],
  focusSessions: FocusSession[]
): number => {
  const activeHabits = habits.filter((h) => h.status === 'active');
  const habitPct = activeHabits.length > 0
    ? activeHabits.reduce((acc, h) => acc + h.successPercent, 0) / activeHabits.length
    : 0;

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskPct = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const goalPct = goals.length > 0
    ? goals.reduce((acc, g) => acc + g.progressPercent, 0) / goals.length
    : 0;

  const totalFocusHrs = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60;
  const focusPct = Math.min(100, (totalFocusHrs / 30) * 100);

  if (habits.length === 0 && tasks.length === 0 && goals.length === 0 && focusSessions.length === 0) {
    return 0;
  }

  const rawLifeScore = Math.round(
    habitPct * 0.3 + taskPct * 0.25 + goalPct * 0.25 + focusPct * 0.2
  );

  return Math.min(100, Math.max(0, rawLifeScore));
};

export interface AnalyticsAggregate {
  weeklyProductivityScore: number;
  monthlyProductivityScore: number;
  yearlyProductivityScore: number;
  taskCompletionRate: number;
  habitCompletionRate: number;
  goalProgressAvg: number;
  studyHours: number;
  focusHours: number;
  codingHours: number;
  avgMood: string;
  waterIntakeLiters: number;
  avgSleepHours: number;
  assignmentCompletionRate: number;
  internshipAppliedCount: number;
  hackathonsCount: number;
  projectsCompletedPct: number;
}

export const calculateAggregateAnalytics = (
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[],
  assignments: Assignment[],
  internships: Internship[],
  hackathons: Hackathon[],
  projects: Project[]
): AnalyticsAggregate => {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const totalFocusMins = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const focusHrs = Math.round((totalFocusMins / 60) * 10) / 10;

  const activeHabits = habits.filter((h) => h.status === 'active');
  const habitAvgSuccess = activeHabits.length > 0
    ? Math.round(activeHabits.reduce((acc, h) => acc + h.successPercent, 0) / activeHabits.length)
    : 0;

  const gradedAsg = assignments.filter((a) => a.status === 'graded' || a.status === 'submitted').length;
  const asgRate = assignments.length > 0 ? Math.round((gradedAsg / assignments.length) * 100) : 0;

  const projAvgProgress = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.progressPercent, 0) / projects.length)
    : 0;

  const hasActivity = tasks.length > 0 || habits.length > 0 || focusSessions.length > 0;
  const currentMomentum = calculateMomentumScore(tasks, habits, [], focusSessions);

  return {
    weeklyProductivityScore: hasActivity ? currentMomentum : 0,
    monthlyProductivityScore: hasActivity ? Math.min(100, Math.round(currentMomentum * 0.95)) : 0,
    yearlyProductivityScore: hasActivity ? Math.min(100, Math.round(currentMomentum * 0.9)) : 0,
    taskCompletionRate: taskRate,
    habitCompletionRate: habitAvgSuccess,
    goalProgressAvg: 0,
    studyHours: 0,
    focusHours: focusHrs,
    codingHours: 0,
    avgMood: hasActivity ? 'Steady ⚡' : 'Baseline 🧘',
    waterIntakeLiters: 0,
    avgSleepHours: 0,
    assignmentCompletionRate: asgRate,
    internshipAppliedCount: internships.length,
    hackathonsCount: hackathons.length,
    projectsCompletedPct: projAvgProgress,
  };
};

export const exportToCSV = (filename: string, rows: object[]) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row: any) =>
        keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Array ? cell.join(';') : cell;
            cell = typeof cell === 'object' ? JSON.stringify(cell) : cell;
            cell = String(cell).replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
          })
          .join(separator)
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
