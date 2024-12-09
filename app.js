import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing. Please check your .env file.');
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('SUPABASE_KEY:', supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('workouts').select('*').limit(1);
    if (error) throw error;
    res.json({ success: true, message: 'Supabase connection successful', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Supabase connection failed', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { supabase };

