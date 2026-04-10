
-- Table: identity_trap_results
CREATE TABLE public.identity_trap_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  primary_trap TEXT NOT NULL,
  secondary_trap TEXT,
  quiz_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.identity_trap_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trap results"
  ON public.identity_trap_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trap results"
  ON public.identity_trap_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trap results"
  ON public.identity_trap_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trap results"
  ON public.identity_trap_results FOR DELETE
  USING (auth.uid() = user_id);

-- Table: pattern_interrupts
CREATE TABLE public.pattern_interrupts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trap_name TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pattern_interrupts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pattern interrupts"
  ON public.pattern_interrupts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pattern interrupts"
  ON public.pattern_interrupts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pattern interrupts"
  ON public.pattern_interrupts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pattern interrupts"
  ON public.pattern_interrupts FOR DELETE
  USING (auth.uid() = user_id);

-- Table: pattern_progress
CREATE TABLE public.pattern_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  self_trust_streak INTEGER NOT NULL DEFAULT 0,
  total_interrupts INTEGER NOT NULL DEFAULT 0,
  honest_nos INTEGER NOT NULL DEFAULT 0,
  actions_before_certainty INTEGER NOT NULL DEFAULT 0,
  recodes_completed INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pattern_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pattern progress"
  ON public.pattern_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pattern progress"
  ON public.pattern_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pattern progress"
  ON public.pattern_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pattern progress"
  ON public.pattern_progress FOR DELETE
  USING (auth.uid() = user_id);
