CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
