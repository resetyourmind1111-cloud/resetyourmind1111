
-- Add onboarding_complete flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;

-- Create onboarding_responses table
CREATE TABLE public.onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  emotional_state text[] DEFAULT '{}',
  blocked_area text,
  worth_score integer,
  limiting_belief text,
  new_belief text,
  abundance_evidence text,
  future_self_answer text,
  primary_focus text,
  secondary_focus text,
  recommended_tools text[] DEFAULT '{}',
  completed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own onboarding responses"
ON public.onboarding_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding responses"
ON public.onboarding_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding responses"
ON public.onboarding_responses FOR UPDATE
USING (auth.uid() = user_id);
