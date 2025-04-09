
-- Add Mercado Pago preference fields to the orders table if they don't exist
DO $$
BEGIN
    -- Check if mp_preference_id column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='orders' AND column_name='mp_preference_id') THEN
        ALTER TABLE orders ADD COLUMN mp_preference_id TEXT;
    END IF;

    -- Check if mp_payment_id column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='orders' AND column_name='mp_payment_id') THEN
        ALTER TABLE orders ADD COLUMN mp_payment_id TEXT;
    END IF;

    -- Check if payment_details column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name='orders' AND column_name='payment_details') THEN
        ALTER TABLE orders ADD COLUMN payment_details JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Create index on mp_preference_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_mp_preference_id ON orders(mp_preference_id);
CREATE INDEX IF NOT EXISTS idx_orders_mp_payment_id ON orders(mp_payment_id);
