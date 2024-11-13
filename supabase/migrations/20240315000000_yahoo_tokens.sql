-- Create yahoo_tokens table for storing OAuth tokens
CREATE TABLE yahoo_tokens (
    id TEXT PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE yahoo_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read tokens
CREATE POLICY "Allow authenticated users to read tokens" ON yahoo_tokens
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update tokens
CREATE POLICY "Allow authenticated users to update tokens" ON yahoo_tokens
    FOR ALL
    USING (auth.role() = 'authenticated');