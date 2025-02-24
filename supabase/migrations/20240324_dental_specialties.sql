
-- Create the dental_specialties table if it doesn't exist
CREATE TABLE IF NOT EXISTS dental_specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some common dental specialties if they don't exist
INSERT INTO dental_specialties (name)
SELECT name 
FROM (VALUES 
  ('Dentística'),
  ('Endodontia'),
  ('Implantodontia'),
  ('Ortodontia'),
  ('Periodontia'),
  ('Prótese Dentária'),
  ('Odontopediatria'),
  ('Cirurgia Bucomaxilofacial')
) as specs(name)
WHERE NOT EXISTS (
  SELECT 1 FROM dental_specialties WHERE name = specs.name
);

-- Enable RLS
ALTER TABLE dental_specialties ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access"
  ON dental_specialties
  FOR SELECT
  TO PUBLIC
  USING (true);

