-- =====================================================
-- 1) ASSESSMENT RESULTS: remove public exposure
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own results" ON public.assessment_results;
DROP POLICY IF EXISTS "Users can update their own results" ON public.assessment_results;

-- Only authenticated users can view their own results
CREATE POLICY "Users can view their own results"
ON public.assessment_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all results (for support / analytics)
CREATE POLICY "Admins can view all assessment results"
ON public.assessment_results
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
  )
);

-- Update remains owner-scoped, but require authenticated
CREATE POLICY "Users can update their own results"
ON public.assessment_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- 2) PROFILES: prevent privilege escalation via UPDATE
-- =====================================================
-- Trigger blocks non-admin users from changing protected columns
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_is_admin boolean;
  is_service_role boolean;
BEGIN
  -- Service role (used by edge functions/webhooks) is allowed to change anything
  is_service_role := (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role';
  IF is_service_role THEN
    RETURN NEW;
  END IF;

  -- Check whether caller is an existing admin (read OLD row, not NEW, to avoid bootstrap exploit)
  SELECT COALESCE(OLD.is_admin, false) INTO caller_is_admin
  WHERE OLD.user_id = auth.uid();

  -- Block changes to is_admin unless caller was already admin
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin AND COALESCE(caller_is_admin, false) = false THEN
    RAISE EXCEPTION 'Not authorized to modify is_admin';
  END IF;

  -- Block changes to subscription/billing fields by regular users
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    RAISE EXCEPTION 'Not authorized to modify subscription_tier';
  END IF;

  IF NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id THEN
    RAISE EXCEPTION 'Not authorized to modify stripe_customer_id';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_privilege_escalation();