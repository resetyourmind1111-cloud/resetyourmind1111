
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_sessions integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_thermostat_date date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS monthly_ceremonies_completed jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longterm_cards_shown jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS share_milestones boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whats_next_shown boolean NOT NULL DEFAULT false;
