
-- Update Mercado Pago credentials with the new values
UPDATE system_settings 
SET value = 'APP_USR-609050106721186-021911-eae43656d661dca581ec088d09694fd5-2268930884' 
WHERE key = 'MP_ACCESS_TOKEN';

UPDATE system_settings 
SET value = 'APP_USR-711c6c25-bab3-4517-8ecf-c258c5ee4691' 
WHERE key = 'MP_PUBLIC_KEY';

UPDATE system_settings 
SET value = '609050106721186' 
WHERE key = 'MP_CLIENT_ID';

UPDATE system_settings 
SET value = 'U9h1nfkIboFJDiVS8AD4QW3sQwo2kvrd' 
WHERE key = 'MP_CLIENT_SECRET';

-- Insert records if they don't exist
INSERT INTO system_settings (key, value, is_protected)
SELECT 'MP_ACCESS_TOKEN', 'APP_USR-609050106721186-021911-eae43656d661dca581ec088d09694fd5-2268930884', true
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE key = 'MP_ACCESS_TOKEN');

INSERT INTO system_settings (key, value, is_protected)
SELECT 'MP_PUBLIC_KEY', 'APP_USR-711c6c25-bab3-4517-8ecf-c258c5ee4691', false
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE key = 'MP_PUBLIC_KEY');

INSERT INTO system_settings (key, value, is_protected)
SELECT 'MP_CLIENT_ID', '609050106721186', false
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE key = 'MP_CLIENT_ID');

INSERT INTO system_settings (key, value, is_protected)
SELECT 'MP_CLIENT_SECRET', 'U9h1nfkIboFJDiVS8AD4QW3sQwo2kvrd', true
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE key = 'MP_CLIENT_SECRET');
