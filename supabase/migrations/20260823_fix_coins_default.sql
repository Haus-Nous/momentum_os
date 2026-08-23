-- Momentum OS v2 Migration — Fix coins column default value on profiles table to 0 & handle persona metadata
-- 1. Ensure persona column exists on public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS persona TEXT DEFAULT 'academic';

-- 2. Update DEFAULT value on coins column in public.profiles
ALTER TABLE public.profiles ALTER COLUMN coins SET DEFAULT 0;

-- 3. Trigger function to auto-create profile row on auth.users signup with user metadata & coins = 0
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    role, 
    level, 
    xp, 
    xp_to_next_level, 
    coins, 
    streak_days, 
    freeze_tokens, 
    momentum_score,
    persona
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), 'New User'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'Systems Architect'),
    1,
    0,
    1000,
    0,
    0,
    2,
    0,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'persona', ''), 'academic')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    persona = EXCLUDED.persona;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
