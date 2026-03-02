
CREATE TABLE public.permission_slips_accepted (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slip_text TEXT NOT NULL,
  category TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.permission_slips_accepted ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own accepted slips"
  ON public.permission_slips_accepted FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accepted slips"
  ON public.permission_slips_accepted FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accepted slips"
  ON public.permission_slips_accepted FOR DELETE
  USING (auth.uid() = user_id);
