
-- Meditations catalog
CREATE TABLE IF NOT EXISTS public.meditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL UNIQUE,
  library text NOT NULL,
  audio_url text,
  tier_required text NOT NULL DEFAULT 'reset',
  sort_order integer NOT NULL DEFAULT 0,
  duration_label text,
  is_coming_soon boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view meditations"
ON public.meditations FOR SELECT TO authenticated USING (true);

CREATE TRIGGER meditations_updated_at
BEFORE UPDATE ON public.meditations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Completion tracking
CREATE TABLE IF NOT EXISTS public.meditation_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  meditation_id uuid REFERENCES public.meditations(id) ON DELETE CASCADE,
  meditation_title text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.meditation_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own meditation completions"
ON public.meditation_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert their own meditation completions"
ON public.meditation_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_meditation_completions_user ON public.meditation_completions(user_id);

-- Notify-me requests for Coming Soon meditations
CREATE TABLE IF NOT EXISTS public.meditation_notify_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  meditation_title text NOT NULL,
  library text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, meditation_title)
);

ALTER TABLE public.meditation_notify_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own notify requests"
ON public.meditation_notify_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert their own notify requests"
ON public.meditation_notify_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete their own notify requests"
ON public.meditation_notify_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Seed the 10 Mind Library meditations
INSERT INTO public.meditations (title, library, audio_url, tier_required, sort_order) VALUES
('Permission Granted — Foundation Practice', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Permission%20Granted%20Foundational%20Practice%20qImX9B2ATljjb6OIwvdp.mp3',
 'trial', 1),
('Morning Permission — Daily Morning Practice', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Daily%20morning%20practice%20yswtFiPPJc1gQfHtPqcr.mp3',
 'trial', 2),
('Evening Release — Daily Evening Practice', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Evening%20release%207Kf1mYKG3grBBXSU4nry.mp3',
 'trial', 3),
('Permission to Rest and Sleep', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Permission%20to%20rest%20and%20sleep%20p7NORrqXGKOXxSVp4qDQ.mp3',
 'reset', 4),
('Permission to Say No', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Permission%20to%20say%20no%20Z7aRw6JEnZb6TtTHNemz-1.mp3',
 'reset', 5),
('Permission to Want More', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Permission%20to%20Want%20More%20PH1ypyjG1G6lYgnzSGu0-1.mp3',
 'reset', 6),
('Permission to Choose Yourself', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Permission%20to%20Choose%20Yourself%20h1PvqDMNf3AOWuWbwQIC-1.mp3',
 'reset', 7),
('Permission to Heal the Mother Wound', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Permission%20to%20Heal%20the%20Mother%20wound%20oTbxhkir0ZPF5rbUSuuo.mp3',
 'reset', 8),
('Permission to Receive', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Permission%20to%20receiveXoh9MYAWQr5yHBUlRNXC.mp3',
 'reset', 9),
('Permission to Be Seen', 'Mind Library',
 'https://yolulmwfrjhnxykghvpg.supabase.co/storage/v1/object/public/Meditations/Permission%20to%20be%20seen%20wNz7Z10eOI2Ccqw1FDtV-2.mp3',
 'reset', 10)
ON CONFLICT (title) DO UPDATE SET
  audio_url = EXCLUDED.audio_url,
  library = EXCLUDED.library,
  tier_required = EXCLUDED.tier_required,
  sort_order = EXCLUDED.sort_order;
