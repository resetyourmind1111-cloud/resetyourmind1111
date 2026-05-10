ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS access_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS day15_modal_shown boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS day21_modal_shown boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS day15_remind_later_at timestamptz,
  ADD COLUMN IF NOT EXISTS tools_opened_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS resets_completed_count integer NOT NULL DEFAULT 0;