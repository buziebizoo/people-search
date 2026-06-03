-- Seed the opt-out blocklist with the site owner's entry.
-- address is NULL so the match is name-only, covering all sources (Supabase + Enformion).
INSERT INTO public.opt_out_blocklist (first_name, last_name, address, email)
VALUES ('Brandon', 'Zhu', NULL, 'brandon.h.zhu@gmail.com')
ON CONFLICT DO NOTHING;
