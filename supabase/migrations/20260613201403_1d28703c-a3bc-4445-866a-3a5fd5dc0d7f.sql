
CREATE TABLE public.whats_my_pattern_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern text NOT NULL,
  why text,
  showing_up jsonb,
  protecting text,
  small_shift text,
  recommended_tool text,
  first_step text,
  answers jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whats_my_pattern_results TO authenticated;
GRANT ALL ON public.whats_my_pattern_results TO service_role;

ALTER TABLE public.whats_my_pattern_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own pattern results"
  ON public.whats_my_pattern_results FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert their own pattern results"
  ON public.whats_my_pattern_results FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update their own pattern results"
  ON public.whats_my_pattern_results FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete their own pattern results"
  ON public.whats_my_pattern_results FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_whats_my_pattern_results_updated_at
  BEFORE UPDATE ON public.whats_my_pattern_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_whats_my_pattern_results_user_created
  ON public.whats_my_pattern_results (user_id, created_at DESC);
