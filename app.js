import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS before using it
app.use(cors({ origin: 'https://kalspas0528.github.io' }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  console.log('SUPABASE_URL:', supabaseUrl || 'undefined');
  console.log('SUPABASE_KEY:', supabaseKey || 'undefined');
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

// Fetch data from Supabase (replace with actual table name)
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
