
-- Add new columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_moment_complete boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_moment_response text,
  ADD COLUMN IF NOT EXISTS day3_card_shown boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notification_time time,
  ADD COLUMN IF NOT EXISTS notifications_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS lorie_welcome_shown boolean NOT NULL DEFAULT false;

-- Create daily_shifts table
CREATE TABLE public.daily_shifts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  prompt text NOT NULL,
  response text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shifts" ON public.daily_shifts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own shifts" ON public.daily_shifts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shifts" ON public.daily_shifts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shifts" ON public.daily_shifts FOR DELETE USING (auth.uid() = user_id);

-- Create notifications_schedule table
CREATE TABLE public.notifications_schedule (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  day_number integer NOT NULL,
  scheduled_time timestamp with time zone NOT NULL,
  sent boolean NOT NULL DEFAULT false,
  message_title text NOT NULL,
  message_body text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications_schedule FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notifications" ON public.notifications_schedule FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications_schedule FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public.notifications_schedule FOR DELETE USING (auth.uid() = user_id);
