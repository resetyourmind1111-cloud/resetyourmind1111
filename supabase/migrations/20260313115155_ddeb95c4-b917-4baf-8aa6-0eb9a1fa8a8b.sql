
CREATE TABLE public.nervous_system_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  primary_state text NOT NULL,
  secondary_state text,
  scores_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  triggered_by text,
  reset_completed boolean NOT NULL DEFAULT false,
  journal_entry text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.nervous_system_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checkins" ON public.nervous_system_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own checkins" ON public.nervous_system_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own checkins" ON public.nervous_system_checkins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own checkins" ON public.nervous_system_checkins FOR DELETE USING (auth.uid() = user_id);
