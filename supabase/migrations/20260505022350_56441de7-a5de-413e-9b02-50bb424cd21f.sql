
CREATE TABLE public.pending_founding_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  stripe_customer_id text,
  stripe_session_id text,
  stripe_payment_intent_id text,
  amount_paid integer,
  paid_at timestamptz NOT NULL DEFAULT now(),
  claimed boolean NOT NULL DEFAULT false,
  claimed_by_user_id uuid,
  claimed_at timestamptz,
  source text DEFAULT 'stripe_payment_link',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pending_founding_email ON public.pending_founding_members (lower(email));

ALTER TABLE public.pending_founding_members ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check by exact email (needed at signup to claim founding status)
CREATE POLICY "Anyone can read pending founding members"
  ON public.pending_founding_members FOR SELECT
  USING (true);

-- Service role handles all writes (webhook + claim trigger run as service role / security definer)
CREATE POLICY "Service role manages pending founding members"
  ON public.pending_founding_members FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Trigger: when a profile is created, if email matches a pending founding member, claim it
CREATE OR REPLACE FUNCTION public.claim_pending_founding_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
  pending_id uuid;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
  IF user_email IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT id INTO pending_id
  FROM public.pending_founding_members
  WHERE lower(email) = lower(user_email)
    AND claimed = false
  LIMIT 1;

  IF pending_id IS NOT NULL THEN
    NEW.subscription_tier := 'founding';
    NEW.user_source := COALESCE(NEW.user_source, 'live-reset');
    NEW.onboarding_complete := true;

    UPDATE public.pending_founding_members
       SET claimed = true,
           claimed_by_user_id = NEW.user_id,
           claimed_at = now()
     WHERE id = pending_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS claim_founding_on_profile_insert ON public.profiles;
CREATE TRIGGER claim_founding_on_profile_insert
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.claim_pending_founding_member();
