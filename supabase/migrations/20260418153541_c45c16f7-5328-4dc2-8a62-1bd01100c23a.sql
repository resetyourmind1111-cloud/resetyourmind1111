ALTER TABLE public.assessment_results
  ADD COLUMN IF NOT EXISTS retake_type text NOT NULL DEFAULT 'initial';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS day6_cliffhanger_shown boolean NOT NULL DEFAULT false;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS day5_emotional_peak_completed boolean NOT NULL DEFAULT false;