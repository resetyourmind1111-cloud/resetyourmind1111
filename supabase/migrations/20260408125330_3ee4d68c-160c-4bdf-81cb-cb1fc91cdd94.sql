-- Create user_usage table
CREATE TABLE public.user_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

-- Enable RLS
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own usage"
  ON public.user_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON public.user_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.user_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Increment function using upsert
CREATE OR REPLACE FUNCTION public.increment_user_usage()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  INSERT INTO public.user_usage (user_id, date, session_count)
  VALUES (auth.uid(), CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET session_count = user_usage.session_count + 1
  RETURNING session_count INTO current_count;
  
  RETURN current_count;
END;
$$;