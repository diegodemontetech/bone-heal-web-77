
CREATE OR REPLACE FUNCTION get_system_settings(setting_keys TEXT[])
RETURNS TABLE (
  key TEXT,
  value TEXT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT key, value
  FROM system_settings
  WHERE key = ANY(setting_keys);
$$;
