CREATE TABLE public.abundance_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  email text NOT NULL,
  tier text NOT NULL,
  program_consent boolean NOT NULL DEFAULT false,
  marketing_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.abundance_registrations TO anon, authenticated;
GRANT ALL ON public.abundance_registrations TO service_role;
ALTER TABLE public.abundance_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register" ON public.abundance_registrations AS PERMISSIVE FOR INSERT TO anon, authenticated
WITH CHECK (program_consent = true AND length(first_name) BETWEEN 1 AND 100 AND length(email) BETWEEN 3 AND 255 AND tier IN ('experience','reset','personalized'));