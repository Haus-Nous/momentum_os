import { 
  Task, Habit, SystemRoutine, Note, CalendarEvent, UserProfile, Project, FocusSession,
  Course, Assignment, Internship, Hackathon, Competition, Goal, Achievement, SystemNotification, SystemSettings,
  ResearchPaper, Certification
} from '../types';

export const initialUserProfile: UserProfile = {
  name: "",
  role: "Systems Architect",
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  coins: 100,
  streakDays: 0,
  freezeTokens: 1,
  momentumScore: 0,
};

export const initialProjects: Project[] = [];
export const initialTasks: Task[] = [];
export const initialHabits: Habit[] = [];
export const initialRoutines: SystemRoutine[] = [];
export const initialNotes: Note[] = [];
export const initialCalendarEvents: CalendarEvent[] = [];
export const initialFocusSessions: FocusSession[] = [];
export const initialCourses: Course[] = [];
export const initialAssignments: Assignment[] = [];
export const initialInternships: Internship[] = [];
export const initialHackathons: Hackathon[] = [];
export const initialCompetitions: Competition[] = [];
export const initialResearchPapers: ResearchPaper[] = [];
export const initialCertifications: Certification[] = [];
export const initialGoals: Goal[] = [];
export const initialAchievements: Achievement[] = [];
export const initialNotifications: SystemNotification[] = [];

export const initialSettings: SystemSettings = {
  theme: 'dark',
  soundEnabled: true,
  notificationsEnabled: true,
  dailyFocusGoalMins: 100,
  dailyTaskGoalCount: 5,
  autoBackup: true,
};

