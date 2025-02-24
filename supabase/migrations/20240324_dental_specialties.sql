
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
