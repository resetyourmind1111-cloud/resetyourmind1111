
-- Create thirty_day_progress table
CREATE TABLE public.thirty_day_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  phase text NOT NULL,
  morning_response text,
  evening_response text,
  marked_complete boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_number)
);

ALTER TABLE public.thirty_day_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON public.thirty_day_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.thirty_day_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.thirty_day_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own progress" ON public.thirty_day_progress FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_thirty_day_progress_updated_at
  BEFORE UPDATE ON public.thirty_day_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create lesson_completions table
CREATE TABLE public.lesson_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  track_name text NOT NULL,
  lesson_number integer NOT NULL CHECK (lesson_number >= 1 AND lesson_number <= 5),
  lesson_title text NOT NULL,
  journal_response text,
  action_step_complete boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, track_name, lesson_number)
);

ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own completions" ON public.lesson_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own completions" ON public.lesson_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own completions" ON public.lesson_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own completions" ON public.lesson_completions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_lesson_completions_updated_at
  BEFORE UPDATE ON public.lesson_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
