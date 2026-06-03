-- Add opted_out flag to people table
ALTER TABLE public.people
  ADD COLUMN IF NOT EXISTS opted_out boolean NOT NULL DEFAULT false;

-- Partial index — only indexes opted-out rows, keeping it tiny
CREATE INDEX IF NOT EXISTS people_opted_out_idx
  ON public.people (opted_out)
  WHERE opted_out = true;

-- opt_out_blocklist: durable record of opt-out requests by name/email
-- Used to re-apply opt-outs if the people table is reloaded from source data
CREATE TABLE IF NOT EXISTS opt_out_blocklist (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  text        NOT NULL,
  last_name   text        NOT NULL,
  address     text,
  email       text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS opt_out_blocklist_name_idx
  ON public.opt_out_blocklist (lower(first_name), lower(last_name));
