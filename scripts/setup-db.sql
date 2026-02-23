-- Run this SQL in your Vercel Postgres dashboard to create the subscribers table.
-- Navigate to: Vercel Dashboard → Storage → Your Database → Query

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  confirmed BOOLEAN DEFAULT FALSE,
  confirm_token UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers(confirm_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(confirmed)
  WHERE confirmed = TRUE AND unsubscribed_at IS NULL;
