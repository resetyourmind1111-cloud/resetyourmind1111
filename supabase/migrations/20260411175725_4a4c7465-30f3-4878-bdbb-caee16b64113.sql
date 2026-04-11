
-- Add new columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS milestone_cards_shown jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pattern_checkin_cards_shown jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS comeback_card_shown boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_30day_activity timestamp with time zone,
  ADD COLUMN IF NOT EXISTS lorie_30day_shown boolean NOT NULL DEFAULT false;

-- Add new columns to daily_shifts
ALTER TABLE public.daily_shifts
  ADD COLUMN IF NOT EXISTS prompt_type text NOT NULL DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS day_number integer;
