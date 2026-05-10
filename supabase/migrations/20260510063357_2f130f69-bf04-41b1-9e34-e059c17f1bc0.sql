ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS day15_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS day21_email_sent_at timestamptz;