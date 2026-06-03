-- Restructure opt_out_requests for token-based email-verification flow.
-- Old form columns are made nullable so existing rows are preserved.
ALTER TABLE public.opt_out_requests
  ALTER COLUMN address         DROP NOT NULL,
  ALTER COLUMN city            DROP NOT NULL,
  ALTER COLUMN state           DROP NOT NULL,
  ALTER COLUMN zip             DROP NOT NULL,
  ALTER COLUMN reason          DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS person_id        text,
  ADD COLUMN IF NOT EXISTS token            text,
  ADD COLUMN IF NOT EXISTS token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS ip_address       text;

-- Fast token lookup (partial index — only non-null tokens)
CREATE UNIQUE INDEX IF NOT EXISTS opt_out_requests_token_idx
  ON public.opt_out_requests (token)
  WHERE token IS NOT NULL;
