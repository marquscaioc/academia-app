-- =============================================
-- 00039: fixed-window rate limits for Edge Functions
-- Edge Functions are stateless, so counters live here. Only the service role (the functions' admin
-- client) can touch them: RLS is enabled with no policies and EXECUTE is granted to service_role only.
-- consume_rate_limit() increments atomically (INSERT … ON CONFLICT) and returns whether the call is
-- still within the limit for the current window.
-- =============================================

CREATE TABLE IF NOT EXISTS public.edge_rate_limits (
  key text NOT NULL,
  window_start timestamptz NOT NULL,
  hits integer NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);
CREATE INDEX IF NOT EXISTS idx_edge_rate_limits_window ON public.edge_rate_limits(window_start);

ALTER TABLE public.edge_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.edge_rate_limits FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start timestamptz;
  v_hits integer;
BEGIN
  IF coalesce(p_key, '') = '' OR p_limit < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'invalid rate limit arguments' USING ERRCODE = '22023';
  END IF;
  v_start := to_timestamp(floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds);

  INSERT INTO public.edge_rate_limits (key, window_start, hits)
  VALUES (p_key, v_start, 1)
  ON CONFLICT (key, window_start) DO UPDATE SET hits = public.edge_rate_limits.hits + 1
  RETURNING hits INTO v_hits;

  -- Keep the table small: windows older than a day are never read again.
  DELETE FROM public.edge_rate_limits WHERE window_start < now() - interval '1 day';

  RETURN v_hits <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) TO service_role;
