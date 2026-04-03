CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  daily_affirmation_enabled BOOLEAN NOT NULL DEFAULT true,
  daily_affirmation_time TIME NOT NULL DEFAULT '08:00:00',
  checkin_reminder_enabled BOOLEAN NOT NULL DEFAULT true,
  checkin_reminder_time TIME NOT NULL DEFAULT '18:00:00',
  quiet_phase_alerts_enabled BOOLEAN NOT NULL DEFAULT true,
  streak_protection_enabled BOOLEAN NOT NULL DEFAULT true,
  milestone_celebrations_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification preferences"
ON public.notification_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
ON public.notification_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
ON public.notification_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();