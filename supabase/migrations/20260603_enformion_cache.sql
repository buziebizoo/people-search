CREATE TABLE IF NOT EXISTS public.enformion_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  person_data jsonb,
  marriage_data jsonb,
  divorce_data jsonb,
  ofac_data jsonb,
  license_data jsonb,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '90 days'
);
CREATE INDEX IF NOT EXISTS enformion_cache_key_idx ON public.enformion_cache(cache_key);
CREATE INDEX IF NOT EXISTS enformion_cache_expires_idx ON public.enformion_cache(expires_at);
