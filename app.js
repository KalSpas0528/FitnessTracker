import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Root route for basic testing
app.get('/', (req, res) => {
  res.send('Welcome to the Fitness Tracker API!');
});

// Example API endpoint to test backend functionality
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running successfully!' });
});

// Another example: Fetch from Supabase (replace with actual table name)
app.get('/api/data', async (req, res) => {
  try {
    const { data, error } = await supabase.from('workouts').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from Supabase.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Supabase URL: ${supabaseUrl}`);
});
