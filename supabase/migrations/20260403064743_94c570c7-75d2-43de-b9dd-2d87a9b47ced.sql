-- Add journey columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_source text DEFAULT 'organic',
  ADD COLUMN IF NOT EXISTS journey_start_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS journey_current_day integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS worth_score_day1 integer,
  ADD COLUMN IF NOT EXISTS worth_score_day24 integer;

-- Add unique constraint on thirty_day_progress for upsert support
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'thirty_day_progress_user_day_unique'
  ) THEN
    ALTER TABLE public.thirty_day_progress
      ADD CONSTRAINT thirty_day_progress_user_day_unique UNIQUE (user_id, day_number);
  END IF;
END $$;