
-- Add trial_start_date to profiles
ALTER TABLE public.profiles 
ADD COLUMN trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Backfill existing profiles
UPDATE public.profiles SET trial_start_date = created_at WHERE trial_start_date IS NULL;
