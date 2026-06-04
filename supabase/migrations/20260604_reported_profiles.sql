CREATE TABLE IF NOT EXISTS public.reported_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  age integer,
  city text,
  state text,
  dating_apps text[],
  phone text,
  experience text NOT NULL,
  red_flags text[],
  image_url text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);
ALTER TABLE public.reported_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon can submit reports" ON public.reported_profiles
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon can read approved reports" ON public.reported_profiles
  FOR SELECT TO anon USING (status = 'approved');
