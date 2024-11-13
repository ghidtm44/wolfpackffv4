-- Create teams table
CREATE TABLE teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    manager TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create team_standings table
CREATE TABLE team_standings (
    id UUID PRIMARY KEY REFERENCES teams(id),
    name TEXT NOT NULL,
    manager TEXT NOT NULL,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create weekly_results table
CREATE TABLE weekly_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id),
    opponent_id UUID REFERENCES teams(id),
    week INTEGER NOT NULL,
    points DECIMAL(10,2) NOT NULL,
    opponent_points DECIMAL(10,2) NOT NULL,
    top_player BOOLEAN DEFAULT false,
    top_points BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create weekly_writeups table
CREATE TABLE weekly_writeups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    week INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_writeups ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable all access for all users" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON team_standings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON weekly_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON weekly_writeups FOR ALL USING (true) WITH CHECK (true);