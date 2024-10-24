// Import required libraries
const express = require('express');
const { createClient } = require('@supabase/supabase-js'); // Correct import for Supabase

// Initialize Express app
const app = express();
const port = 3000;

// Supabase credentials (replace these with your actual Supabase project URL and Key)
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd3NmbmRibmxwZXFhem56dHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MzczMjUsImV4cCI6MjA0NTExMzMyNX0.MvEiRJ-L9qpuQ7ma4PCBNbWYdQk6wInwnqvCCHvyuLE'; // Replace with your Supabase API Key

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello, world! Your server is up and running!');
});

// Start the server and listen on port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
