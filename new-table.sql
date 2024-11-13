-- Create league_history table
CREATE TABLE league_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE,
    champion_name TEXT NOT NULL,
    champion_manager TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE league_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON league_history FOR ALL USING (true) WITH CHECK (true);

-- Insert historical data
INSERT INTO league_history (year, champion_name, champion_manager) VALUES
(2024, 'Current Season', 'In Progress'),
(2023, 'Thunder Cats', 'Mike Johnson'),
(2022, 'Grid Iron Giants', 'Sarah Smith'),
(2021, 'Fantasy Kings', 'David Brown'),
(2020, 'Touchdown Terrors', 'Emily Davis'),
(2019, 'Field Marshals', 'James Wilson'),
(2018, 'Red Zone Raiders', 'Lisa Anderson'),
(2017, 'Gridiron Legends', 'Tom Martinez'),
(2016, 'Touchdown Dynasty', 'Chris Taylor'),
(2015, 'Fantasy Phoenixes', 'Amanda White'),
(2014, 'Pigskin Pioneers', 'Robert Lee'),
(2013, 'Victory Vanguard', 'Jessica Chen'),
(2012, 'League Legends', 'Michael Scott'),
(2011, 'Field Generals', 'Daniel Kim'),
(2010, 'Champion Chiefs', 'Rachel Green');