CREATE OR REPLACE FUNCTION get_distinct_states()
RETURNS TABLE(state text)
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT state FROM public.people WHERE state IS NOT NULL;
$$;
