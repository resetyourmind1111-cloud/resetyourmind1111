
CREATE TABLE public.sacred_circle_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  content text NOT NULL,
  post_type text NOT NULL DEFAULT 'user_post',
  milestone_type text,
  display_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sacred_circle_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view posts"
ON public.sacred_circle_posts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create their own posts"
ON public.sacred_circle_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
ON public.sacred_circle_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TABLE public.sacred_circle_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  post_id uuid NOT NULL REFERENCES public.sacred_circle_posts(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, post_id)
);

ALTER TABLE public.sacred_circle_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view reactions"
ON public.sacred_circle_reactions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can add their own reactions"
ON public.sacred_circle_reactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions"
ON public.sacred_circle_reactions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for live feed updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.sacred_circle_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sacred_circle_reactions;
