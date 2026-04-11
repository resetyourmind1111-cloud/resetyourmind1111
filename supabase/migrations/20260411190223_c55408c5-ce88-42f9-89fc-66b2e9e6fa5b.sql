
-- Create app_settings table
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read
CREATE POLICY "Anyone authenticated can read app settings"
  ON public.app_settings FOR SELECT TO authenticated
  USING (true);

-- Only admins can update
CREATE POLICY "Admins can update app settings"
  ON public.app_settings FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Seed founding_mode = true
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('founding_mode', 'true');
