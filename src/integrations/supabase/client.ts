// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kurpshcdafxbyqnzxvxu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cnBzaGNkYWZ4Ynlxbnp4dnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDAwOTcsImV4cCI6MjA1MjYxNjA5N30.o4BJItNFU0VnRSm6vfgT8zFNPptrlV3FDAzZe7q1c4k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);