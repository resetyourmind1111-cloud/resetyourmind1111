
-- Add new profile columns
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS buddy_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_visit_circle boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- ============================================================
-- circle_posts
-- ============================================================
CREATE TABLE public.circle_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_type text NOT NULL DEFAULT 'win',
  content text NOT NULL,
  image_url text,
  is_pinned boolean NOT NULL DEFAULT false,
  is_admin_post boolean NOT NULL DEFAULT false,
  is_anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view circle posts"
  ON public.circle_posts FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create their own circle posts"
  ON public.circle_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own circle posts"
  ON public.circle_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own circle posts"
  ON public.circle_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_circle_posts_updated_at
  BEFORE UPDATE ON public.circle_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- circle_reactions
-- ============================================================
CREATE TABLE public.circle_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.circle_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, reaction_type)
);

ALTER TABLE public.circle_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view circle reactions"
  ON public.circle_reactions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can add their own circle reactions"
  ON public.circle_reactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own circle reactions"
  ON public.circle_reactions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- circle_comments
-- ============================================================
CREATE TABLE public.circle_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.circle_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circle_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view circle comments"
  ON public.circle_comments FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create their own circle comments"
  ON public.circle_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own circle comments"
  ON public.circle_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- circle_members
-- ============================================================
CREATE TABLE public.circle_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text NOT NULL,
  bio text,
  thermostat_type text,
  primary_trap text,
  human_design_type text,
  hormone_profile text,
  days_in_circle integer NOT NULL DEFAULT 0,
  show_in_directory boolean NOT NULL DEFAULT true,
  show_thermostat boolean NOT NULL DEFAULT true,
  show_primary_trap boolean NOT NULL DEFAULT true,
  show_human_design boolean NOT NULL DEFAULT true,
  joined_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view circle members"
  ON public.circle_members FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create their own circle member profile"
  ON public.circle_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own circle member profile"
  ON public.circle_members FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- accountability_buddies
-- ============================================================
CREATE TABLE public.accountability_buddies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 uuid NOT NULL,
  user_id_2 uuid NOT NULL,
  paired_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true,
  thirty_day_start date
);

ALTER TABLE public.accountability_buddies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own buddy pairings"
  ON public.accountability_buddies FOR SELECT TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- ============================================================
-- circle_dms
-- ============================================================
CREATE TABLE public.circle_dms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circle_dms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own DMs"
  ON public.circle_dms FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send DMs"
  ON public.circle_dms FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update DMs they received"
  ON public.circle_dms FOR UPDATE TO authenticated
  USING (auth.uid() = recipient_id);

-- ============================================================
-- circle_reports
-- ============================================================
CREATE TABLE public.circle_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  post_id uuid REFERENCES public.circle_posts(id) ON DELETE SET NULL,
  comment_id uuid REFERENCES public.circle_comments(id) ON DELETE SET NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circle_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON public.circle_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- ============================================================
-- circle_events
-- ============================================================
CREATE TABLE public.circle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL DEFAULT 'live_session',
  event_date timestamptz NOT NULL,
  replay_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circle_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view circle events"
  ON public.circle_events FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- circle_event_rsvps
-- ============================================================
CREATE TABLE public.circle_event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.circle_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

ALTER TABLE public.circle_event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view RSVPs"
  ON public.circle_event_rsvps FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can RSVP"
  ON public.circle_event_rsvps FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their RSVP"
  ON public.circle_event_rsvps FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_dms;
