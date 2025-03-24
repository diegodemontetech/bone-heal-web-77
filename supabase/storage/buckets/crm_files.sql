
DO $$
BEGIN
    -- Check if bucket exists
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'crm_files'
    ) THEN
        -- Create the bucket if it doesn't exist
        INSERT INTO storage.buckets (id, name, public, avif_autodetection)
        VALUES ('crm_files', 'crm_files', true, false);
        
        -- Set up a policy to allow users to read objects
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'crm_files');
        
        -- Set up a policy to allow authenticated users to upload objects
        CREATE POLICY "Authenticated users can upload"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'crm_files');
        
        -- Set up a policy to allow users to update their own objects
        CREATE POLICY "Users can update their own objects"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'crm_files' AND owner = auth.uid());
        
        -- Set up a policy to allow users to delete their own objects
        CREATE POLICY "Users can delete their own objects"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'crm_files' AND owner = auth.uid());
    END IF;
END $$;
