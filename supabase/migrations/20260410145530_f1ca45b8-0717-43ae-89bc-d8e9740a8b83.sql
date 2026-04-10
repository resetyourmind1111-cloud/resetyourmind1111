
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS primary_wound text,
ADD COLUMN IF NOT EXISTS stuck_duration text,
ADD COLUMN IF NOT EXISTS tried_before jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reset_goal text,
ADD COLUMN IF NOT EXISTS reset_plan_generated boolean NOT NULL DEFAULT false;
