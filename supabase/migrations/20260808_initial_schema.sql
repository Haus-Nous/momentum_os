-- Momentum OS v2 — Initial Database Schema Migration
-- Enables Row Level Security (RLS) on every table referenced by auth.users(id)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Systems Architect',
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  xp_to_next_level INT DEFAULT 1000,
  coins INT DEFAULT 420,
  streak_days INT DEFAULT 0,
  freeze_tokens INT DEFAULT 2,
  momentum_score INT DEFAULT 0,
  enabled_modules JSONB DEFAULT '["academic", "career", "fitness", "finance", "creative"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  description TEXT,
  progress_percent INT DEFAULT 0,
  risk_level TEXT DEFAULT 'low',
  velocity INT DEFAULT 0,
  burndown_data JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  urgency INT DEFAULT 0,
  energy_level TEXT DEFAULT 'medium',
  category TEXT,
  time_estimate_minutes INT DEFAULT 30,
  time_spent_minutes INT DEFAULT 0,
  due_date TEXT,
  due_time TEXT,
  project_id TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  subtasks JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_interval TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

-- 4. Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'custom',
  frequency TEXT DEFAULT 'daily',
  custom_frequency_days INT,
  reminder_time TEXT,
  priority TEXT DEFAULT 'medium',
  difficulty TEXT DEFAULT 'medium',
  target_count INT DEFAULT 1,
  unit TEXT DEFAULT 'times',
  current_streak INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  success_percent INT DEFAULT 100,
  miss_percent INT DEFAULT 0,
  skip_count INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  completion_history JSONB DEFAULT '{}'::jsonb,
  color TEXT,
  icon TEXT,
  xp_value INT DEFAULT 50,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- 5. System Routines Table
CREATE TABLE IF NOT EXISTS public.routines (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tagline TEXT,
  target_time_of_day TEXT DEFAULT 'anytime',
  items JSONB DEFAULT '[]'::jsonb,
  icon TEXT,
  color TEXT,
  is_completed_today BOOLEAN DEFAULT FALSE,
  last_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own routines" ON public.routines FOR ALL USING (auth.uid() = user_id);

-- 6. Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  linked_note_ids JSONB DEFAULT '[]'::jsonb,
  folder TEXT DEFAULT 'general',
  mood TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);

-- 7. Calendar Events Table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  date TEXT,
  category TEXT DEFAULT 'task',
  color TEXT,
  task_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own calendar events" ON public.calendar_events FOR ALL USING (auth.uid() = user_id);

-- 8. Focus Sessions Table
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL,
  mode TEXT NOT NULL,
  task_title TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  tree_type TEXT DEFAULT 'cyber_tree'
);

ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own focus sessions" ON public.focus_sessions FOR ALL USING (auth.uid() = user_id);

-- 9. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  credits INT DEFAULT 3,
  grade TEXT,
  professor TEXT,
  attendance_percent INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own courses" ON public.courses FOR ALL USING (auth.uid() = user_id);

-- 10. Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  course_id TEXT NOT NULL,
  subject_name TEXT,
  professor_name TEXT,
  due_date TEXT NOT NULL,
  due_time TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  weight_percent INT DEFAULT 10,
  grade_score INT,
  submission_link TEXT,
  notes TEXT,
  progress_percent INT DEFAULT 0,
  reminder_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own assignments" ON public.assignments FOR ALL USING (auth.uid() = user_id);

-- 11. Internships Table
CREATE TABLE IF NOT EXISTS public.internships (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'applied',
  apply_date TEXT NOT NULL,
  deadline_date TEXT,
  salary TEXT,
  location TEXT,
  resume_version TEXT,
  portfolio_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own internships" ON public.internships FOR ALL USING (auth.uid() = user_id);

-- 12. Hackathons Table
CREATE TABLE IF NOT EXISTS public.hackathons (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  theme TEXT,
  organizer TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  registration_deadline TEXT,
  submission_deadline TEXT,
  project_title TEXT,
  team_members JSONB DEFAULT '[]'::jsonb,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'upcoming',
  prize_pool TEXT,
  link TEXT,
  progress_percent INT DEFAULT 0,
  idea_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own hackathons" ON public.hackathons FOR ALL USING (auth.uid() = user_id);

-- 13. Competitions Table
CREATE TABLE IF NOT EXISTS public.competitions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming',
  rank INT,
  score INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own competitions" ON public.competitions FOR ALL USING (auth.uid() = user_id);

-- 14. Research Papers Table
CREATE TABLE IF NOT EXISTS public.research_papers (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  journal TEXT NOT NULL,
  submission_date TEXT NOT NULL,
  status TEXT DEFAULT 'drafting',
  co_authors JSONB DEFAULT '[]'::jsonb,
  pdf_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own research papers" ON public.research_papers FOR ALL USING (auth.uid() = user_id);

-- 15. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_url TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own certifications" ON public.certifications FOR ALL USING (auth.uid() = user_id);

-- 16. Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  vision TEXT,
  why TEXT,
  horizon TEXT DEFAULT 'monthly',
  category TEXT DEFAULT 'personal',
  target_date TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  progress_percent INT DEFAULT 0,
  milestones JSONB DEFAULT '[]'::jsonb,
  reward TEXT,
  motivation_note TEXT,
  linked_project_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- 17. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  xp_reward INT DEFAULT 100,
  badge_category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id);

-- 18. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  type TEXT DEFAULT 'system'
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
