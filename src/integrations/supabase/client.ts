
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kurpshcdafxbyqnzxvxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cnBzaGNkYWZ4Ynlxbnp4dnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDAwOTcsImV4cCI6MjA1MjYxNjA5N30.o4BJItNFU0VnRSm6vfgT8zFNPptrlV3FDAzZe7q1c4k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.error('Error getting auth data from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error setting auth data in localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing auth data from localStorage:', error);
        }
      },
    },
  },
});
