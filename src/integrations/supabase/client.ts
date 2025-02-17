
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kurpshcdafxbyqnzxvxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cnBzaGNkYWZ4Ynlxbnp4dnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDAwOTcsImV4cCI6MjA1MjYxNjA5N30.o4BJItNFU0VnRSm6vfgT8zFNPptrlV3FDAzZe7q1c4k';

// Criar uma única instância do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'supabase_auth_token',
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
});

// Exportar a instância única
export { supabase };
