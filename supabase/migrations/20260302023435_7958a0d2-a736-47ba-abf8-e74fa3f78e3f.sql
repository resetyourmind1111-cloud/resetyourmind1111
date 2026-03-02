
-- Add body type fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS body_type TEXT,
ADD COLUMN IF NOT EXISTS body_type_completed_at TIMESTAMP WITH TIME ZONE;
