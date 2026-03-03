
-- Fix profiles policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Fix thirty_day_progress policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Users can view their own progress" ON public.thirty_day_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.thirty_day_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.thirty_day_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.thirty_day_progress;

CREATE POLICY "Users can view their own progress" ON public.thirty_day_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.thirty_day_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.thirty_day_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own progress" ON public.thirty_day_progress FOR DELETE USING (auth.uid() = user_id);
