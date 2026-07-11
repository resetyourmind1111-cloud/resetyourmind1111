
-- 1. redemption_codes table
CREATE TABLE public.redemption_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  grants_tier text NOT NULL DEFAULT 'embody',
  access_days integer NOT NULL DEFAULT 30,
  max_redemptions integer,
  redemption_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.redemption_codes TO authenticated;
GRANT ALL ON public.redemption_codes TO service_role;

ALTER TABLE public.redemption_codes ENABLE ROW LEVEL SECURITY;

-- Admins can manage codes
CREATE POLICY "Admins manage redemption codes"
ON public.redemption_codes
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true));

CREATE TRIGGER update_redemption_codes_updated_at
BEFORE UPDATE ON public.redemption_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Profile columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS redeemed_code text,
  ADD COLUMN IF NOT EXISTS redeemed_at timestamptz,
  ADD COLUMN IF NOT EXISTS code_access_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS access_source text,
  ADD COLUMN IF NOT EXISTS redemption_source text; -- 'workshop_page' | 'manual'

-- 3. Update privilege escalation trigger to allow redemption function to bypass
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  caller_is_admin boolean;
  is_service_role boolean;
  bypass_flag text;
BEGIN
  is_service_role := (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role';
  IF is_service_role THEN
    RETURN NEW;
  END IF;

  bypass_flag := current_setting('app.bypass_privilege_check', true);
  IF bypass_flag = 'on' THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(OLD.is_admin, false) INTO caller_is_admin
  WHERE OLD.user_id = auth.uid();

  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin AND COALESCE(caller_is_admin, false) = false THEN
    RAISE EXCEPTION 'Not authorized to modify is_admin';
  END IF;

  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    RAISE EXCEPTION 'Not authorized to modify subscription_tier';
  END IF;

  IF NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id THEN
    RAISE EXCEPTION 'Not authorized to modify stripe_customer_id';
  END IF;

  RETURN NEW;
END;
$function$;

-- 4. Redemption function
CREATE OR REPLACE FUNCTION public.redeem_code(_code text, _source text DEFAULT 'manual')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := auth.uid();
  _norm text := upper(trim(_code));
  _rc public.redemption_codes%ROWTYPE;
  _prof public.profiles%ROWTYPE;
  _expires timestamptz;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You must be signed in to redeem a code.');
  END IF;

  SELECT * INTO _rc FROM public.redemption_codes WHERE upper(code) = _norm LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'That code isn''t recognized.');
  END IF;

  IF NOT _rc.active THEN
    RETURN jsonb_build_object('success', false, 'error', 'This code is no longer active.');
  END IF;

  IF _rc.expires_at IS NOT NULL AND now() > _rc.expires_at THEN
    RETURN jsonb_build_object('success', false, 'error', 'This code has expired.');
  END IF;

  IF _rc.max_redemptions IS NOT NULL AND _rc.redemption_count >= _rc.max_redemptions THEN
    RETURN jsonb_build_object('success', false, 'error', 'This code has reached its redemption limit.');
  END IF;

  SELECT * INTO _prof FROM public.profiles WHERE user_id = _uid;
  IF _prof.redeemed_code IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You''ve already redeemed a code on this account.');
  END IF;

  _expires := now() + (_rc.access_days || ' days')::interval;

  PERFORM set_config('app.bypass_privilege_check', 'on', true);

  UPDATE public.profiles
    SET subscription_tier = _rc.grants_tier,
        access_source = 'code_redemption',
        redeemed_code = _rc.code,
        redeemed_at = now(),
        code_access_expires_at = _expires,
        redemption_source = _source
    WHERE user_id = _uid;

  PERFORM set_config('app.bypass_privilege_check', 'off', true);

  UPDATE public.redemption_codes
    SET redemption_count = redemption_count + 1
    WHERE id = _rc.id;

  RETURN jsonb_build_object(
    'success', true,
    'tier', _rc.grants_tier,
    'expires_at', _expires,
    'label', _rc.label
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_code(text, text) TO authenticated;

-- 5. Seed RECHARGE code
INSERT INTO public.redemption_codes (code, label, grants_tier, access_days, max_redemptions, expires_at)
VALUES ('RECHARGE', 'Restore & Recharge™ Workshop — July 11, 2026', 'embody', 30, NULL, '2026-08-11T23:59:59Z')
ON CONFLICT (code) DO NOTHING;
