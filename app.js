const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();
const port = 3000; // Change port from 4000 to 3000

// Supabase credentials (store sensitive information securely in environment variables)
const supabaseUrl = process.env.SUPABASE_URL || 'https://pswsfndbnlpeqaznztss.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd3NmbmRibmxwZXFhem56dHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MzczMjUsImV4cCI6MjA0NTExMzMyNX0.MvEiRJ-L9qpuQ7ma4PCBNbWYdQk6wInwnqvCCHvyuLE'; // replace with your actual key securely

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
    origin: 'https://kalspas0528.github.io', // Allow requests from your GitHub Pages domain
    credentials: true // Allow cookies to be sent with requests
}));
app.use(bodyParser.json());
app.use(
    session({
        secret: 'your_secret_key', // replace with a strong secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

// Define a route for the root path
app.get('/', (req, res) => {
    res.send('Welcome to the PowerTitan API!'); // Response for root URL
});

// Sign-up endpoint
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    
    req.session.user = data.user;
    res.json({ message: 'Login successful', user: data.user });
});

// Add workout endpoint
app.post('/add-workout', async (req, res) => {
    if (!req.session.user) return res.status(403).json({ error: 'Unauthorized' });

    const { exercise_name, sets, reps, weight, date } = req.body;
    const { data, error } = await supabase.from('workouts').insert([
        {
            user_id: req.session.user.id,
            exercise_name,
            sets,
            reps,
            weight,
            date
        }
    ]);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Workout added successfully', workout: data });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
