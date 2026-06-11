
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  session_id text NOT NULL,
  event text NOT NULL,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  path text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_events_event_created_idx ON public.analytics_events (event, created_at DESC);
CREATE INDEX analytics_events_user_created_idx ON public.analytics_events (user_id, created_at DESC);
CREATE INDEX analytics_events_session_created_idx ON public.analytics_events (session_id, created_at DESC);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins can read analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true));
