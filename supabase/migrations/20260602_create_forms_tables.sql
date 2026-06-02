-- opt_out_requests: stores removal requests from /opt-out
CREATE TABLE IF NOT EXISTS opt_out_requests (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text        NOT NULL,
  address     text        NOT NULL,
  city        text        NOT NULL,
  state       text        NOT NULL,
  zip         text        NOT NULL,
  email       text        NOT NULL,
  reason      text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  status      text        NOT NULL DEFAULT 'pending'
);

-- contact_submissions: stores messages from /contact
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  subject    text        NOT NULL,
  message    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
