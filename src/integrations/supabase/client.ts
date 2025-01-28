import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kurpshcdafxbyqnzxvxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cnBzaGNkYWZ4Ynlxbnp4dnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NDQ5NzgsImV4cCI6MjAyMjIyMDk3OH0.GR5CiYkHHO9JhkWk_hHc9DjqGMmqzHU3O_9bCGWSWbE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  },
});