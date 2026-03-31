CREATE TABLE public.user_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  daily_state text NOT NULL,
  routed_to_module text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checkins"
ON public.user_checkins FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkins"
ON public.user_checkins FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
