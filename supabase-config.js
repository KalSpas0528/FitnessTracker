import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing. Please check your .env file.');
  throw new Error('Supabase configuration is incomplete');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

