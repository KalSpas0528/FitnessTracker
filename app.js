// Import required libraries
const express = require('express');
const { createClient } = require('@supabase/supabase-js'); // Correct import for Supabase

// Initialize Express app
const app = express();
const port = 4000;

// Supabase credentials (replace these with your actual Supabase project URL and Key)
const supabaseUrl = 'https://your-supabase-url.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'your-supabase-api-key'; // Replace with your Supabase API Key

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello, world! Your server is up and running!');
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
