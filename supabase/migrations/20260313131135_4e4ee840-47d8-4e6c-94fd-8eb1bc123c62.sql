-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  stripe_product_id text,
  tier text NOT NULL DEFAULT 'RESET',
  status text NOT NULL DEFAULT 'incomplete',
  billing_interval text DEFAULT 'monthly',
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  founding_member boolean DEFAULT false,
  lifetime_locked_price boolean DEFAULT false,
  plan_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT unique_active_user_subscription UNIQUE (user_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON public.subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE public.founding_member_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spots_remaining integer NOT NULL DEFAULT 111,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.founding_member_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view spots remaining"
  ON public.founding_member_spots FOR SELECT
  USING (true);

CREATE POLICY "Service role can update spots"
  ON public.founding_member_spots FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO public.founding_member_spots (spots_remaining) VALUES (111);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();