import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing. Please check your .env file.');
  console.log('SUPABASE_URL:', supabaseUrl || 'undefined');
  console.log('SUPABASE_KEY:', supabaseKey || 'undefined');
  throw new Error('Supabase configuration is incomplete');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
