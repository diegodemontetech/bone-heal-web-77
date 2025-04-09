
-- Create system_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  is_protected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on key field for faster lookups
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

-- Insert Mercado Pago default credentials if not already present
INSERT INTO system_settings (key, value, is_protected)
VALUES 
  ('MP_ACCESS_TOKEN', 'APP_USR-609050106721186-021911-eae43656d661dca581ec088d09694fd5-2268930884', true),
  ('MP_PUBLIC_KEY', 'APP_USR-711c6c25-bab3-4517-8ecf-c258c5ee4691', false),
  ('MP_CLIENT_ID', '609050106721186', false),
  ('MP_CLIENT_SECRET', 'U9h1nfkIboFJDiVS8AD4QW3sQwo2kvrd', true)
ON CONFLICT (key) DO NOTHING;
