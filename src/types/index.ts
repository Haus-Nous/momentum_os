export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type EnergyLevel = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'doing' | 'blocked' | 'waiting' | 'completed' | 'cancelled';
export type TaskBucket = 'inbox' | 'today' | 'upcoming' | 'this_week' | 'this_month' | 'completed' | 'archived';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  urgency?: number;
  energyLevel: EnergyLevel;
  category?: string;
  timeEstimateMinutes: number;
  timeSpentMinutes: number;
  dueDate?: string;
  dueTime?: string;
  projectId?: string;
  tags: string[];
  subtasks: Subtask[];
  dependencies: string[];
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  completedAt?: string;
  notes?: string;
  attachments?: string[];
}

export interface BurndownPoint {
  day: string;
  ideal: number;
  actual: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  progressPercent: number;
  riskLevel?: 'low' | 'medium' | 'high';
  velocity?: number; // tasks/week
  burndownData?: BurndownPoint[];
}

export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type HabitCategory = 'fitness' | 'study' | 'reading' | 'coding' | 'meditation' | 'finance' | 'health' | 'sleep' | 'career' | 'custom';
export type HabitDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type HabitStatus = 'active' | 'paused' | 'archived';
export type DayCompletionStatus = 'completed' | 'skipped' | 'missed';

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  customFrequencyDays?: number;
  reminderTime?: string;
  priority: Priority;
  difficulty: HabitDifficulty;
  targetCount: number;
  unit: string;
  currentStreak: number;
  bestStreak: number;
  successPercent: number;
  missPercent: number;
  skipCount: number;
  status: HabitStatus;
  completionHistory: Record<string, DayCompletionStatus>;
  color: string;
  icon: string;
  xpValue: number;
  notes?: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  durationMinutes: number;
  isCompleted: boolean;
  frictionReductionTip?: string;
}

export interface SystemRoutine {
  id: string;
  title: string;
  tagline: string;
  targetTimeOfDay: 'morning' | 'deep_work' | 'evening' | 'anytime';
  items: RoutineItem[];
  icon: string;
  color: string;
  isCompletedToday: boolean;
  lastCompletedAt?: string;
}

export type FocusMode = 'pomodoro' | 'short_break' | 'long_break' | 'flowmodoro';

export interface FocusSession {
  id: string;
  durationMinutes: number;
  mode: FocusMode;
  taskTitle?: string;
  timestamp: string;
  treeType: 'pine' | 'oak' | 'sakura' | 'cyber_tree' | 'crystal';
}

export type MoodType = 'peak' | 'good' | 'neutral' | 'low';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedNoteIds: string[];
  folder: 'journal' | 'systems' | 'decisions' | 'general';
  mood?: MoodType;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date?: string;
  category: 'task' | 'deep_work' | 'routine' | 'meeting' | 'assignment' | 'hackathon' | 'competition' | 'rest';
  color: string;
  taskId?: string;
}

export type LifeModule = 'academic' | 'career' | 'fitness' | 'finance' | 'creative';

export interface UserProfile {
  name: string;
  role: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streakDays: number;
  freezeTokens: number;
  momentumScore: number;
  lastActiveDate?: string;
  bestWeeklyMomentumScore?: number;
  weeklyHistory?: { date: string; score: number }[];
  enabledModules?: LifeModule[];
  customModuleLabels?: Record<string, string>;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade?: string;
  professor?: string;
  attendancePercent?: number;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  subjectName?: string;
  professorName?: string;
  dueDate: string;
  dueTime?: string;
  status: 'pending' | 'submitted' | 'graded';
  priority: Priority;
  weightPercent: number;
  gradeScore?: number;
  submissionLink?: string;
  notes?: string;
  progressPercent?: number;
  reminderDate?: string;
}

export type InternshipStatus = 'wishlist' | 'applied' | 'assessment' | 'interview' | 'offer' | 'rejected';

export interface Internship {
  id: string;
  company: string;
  role: string;
  status: InternshipStatus;
  applyDate: string;
  deadlineDate?: string;
  salary?: string;
  location: string;
  resumeVersion?: string;
  portfolioLink?: string;
  notes?: string;
}

export interface Hackathon {
  id: string;
  title: string;
  theme?: string;
  organizer: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  submissionDeadline?: string;
  projectTitle: string;
  teamMembers?: string[];
  techStack?: string[];
  status: 'upcoming' | 'registering' | 'building' | 'submitted' | 'won';
  prizePool?: string;
  link?: string;
  progressPercent?: number;
  ideaDescription?: string;
}

export interface Competition {
  id: string;
  title: string;
  platform: string;
  date: string;
  status: 'upcoming' | 'registered' | 'completed';
  rank?: number;
  score?: number;
}

export interface ResearchPaper {
  id: string;
  title: string;
  journal: string;
  submissionDate: string;
  status: 'drafting' | 'under_review' | 'accepted' | 'published';
  coAuthors: string[];
  pdfLink?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  skills: string[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export type GoalHorizon = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'life';

export interface Goal {
  id: string;
  title: string;
  vision?: string;
  why?: string;
  horizon: GoalHorizon;
  category: 'career' | 'academic' | 'fitness' | 'financial' | 'personal';
  targetDate: string;
  priority: Priority;
  progressPercent: number;
  milestones: Milestone[];
  reward?: string;
  motivationNote?: string;
  linkedProjectIds: string[];
}

export type BadgeCategory = 'coding_beast' | 'study_warrior' | 'internship_hunter' | 'hackathon_hero' | 'consistency_king' | 'goal_crusher' | 'quick_learner';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  badgeCategory?: BadgeCategory;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'achievement' | 'deadline' | 'system';
}

export interface SystemSettings {
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  dailyFocusGoalMins: number;
  dailyTaskGoalCount: number;
  autoBackup: boolean;
  aiProviderMode?: 'groq' | 'heuristic';
}
