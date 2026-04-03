
CREATE TABLE public.support_flow_outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_state TEXT NOT NULL,
  tool_used TEXT NOT NULL,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.support_flow_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own outcomes"
ON public.support_flow_outcomes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outcomes"
ON public.support_flow_outcomes
FOR INSERT
WITH CHECK (auth.uid() = user_id);
