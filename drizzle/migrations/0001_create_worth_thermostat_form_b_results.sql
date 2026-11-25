CREATE TABLE public.worth_thermostat_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  email text NOT NULL,
  raw_score integer NOT NULL,
  percentage integer NOT NULL,
  result_type text NOT NULL,
  reflection text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT worth_form_b_name CHECK (length(btrim(first_name)) BETWEEN 1 AND 100),
  CONSTRAINT worth_form_b_email CHECK (length(email) <= 255 AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  CONSTRAINT worth_form_b_raw CHECK (raw_score BETWEEN 25 AND 125),
  CONSTRAINT worth_form_b_percentage CHECK (percentage = round(raw_score::numeric / 125 * 100)),
  CONSTRAINT worth_form_b_type CHECK (result_type = CASE WHEN percentage < 40 THEN 'The Settler' WHEN percentage < 60 THEN 'The Seeker' WHEN percentage < 80 THEN 'The Boundary Builder' ELSE 'The Rising Queen / King' END),
  CONSTRAINT worth_form_b_reflection CHECK (reflection IS NULL OR length(reflection) <= 5000)
);
GRANT INSERT ON public.worth_thermostat_results TO anon, authenticated;
GRANT ALL ON public.worth_thermostat_results TO service_role;
ALTER TABLE public.worth_thermostat_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants submit valid Gift 2 results" ON public.worth_thermostat_results AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (
  email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND result_type IN ('The Settler', 'The Seeker', 'The Boundary Builder', 'The Rising Queen / King')
);
CREATE FUNCTION public.save_worth_thermostat_reflection(_id uuid, _reflection text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _reflection IS NOT NULL AND length(_reflection) > 5000 THEN
    RAISE EXCEPTION 'Reflection is too long';
  END IF;
  UPDATE public.worth_thermostat_results SET reflection = nullif(btrim(_reflection), '') WHERE id = _id;
END;
$$;
REVOKE ALL ON FUNCTION public.save_worth_thermostat_reflection(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_worth_thermostat_reflection(uuid, text) TO anon, authenticated, service_role;