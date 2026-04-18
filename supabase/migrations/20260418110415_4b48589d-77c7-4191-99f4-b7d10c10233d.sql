ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak_grace_used_date date,
  ADD COLUMN IF NOT EXISTS last_active_date date,
  ADD COLUMN IF NOT EXISTS day6_gift_shown boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS day6_bonus_oracle_used boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS streak_milestones_shown jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS today_recommendation_used_date date;