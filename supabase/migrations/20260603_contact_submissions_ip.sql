ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS ip_address text;
