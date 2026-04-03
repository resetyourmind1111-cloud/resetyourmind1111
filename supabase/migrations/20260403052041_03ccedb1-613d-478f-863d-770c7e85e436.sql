
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_reason text,
  ADD COLUMN IF NOT EXISTS welcome_banner_dismissed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS founder_banner_dismissed_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trial_reflection_saved boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_tool_1 text,
  ADD COLUMN IF NOT EXISTS trial_tool_2 text;
