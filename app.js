const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();
const port = 4000; // You can change this to 3000 if needed

// Supabase credentials
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co';
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd3NmbmRibmxwZXFhem56dHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MzczMjUsImV4cCI6MjA0NTExMzMyNX0.MvEiRJ-L9qpuQ7ma4PCBNbWYdQk6wInwnqvCCHvyuLE';  // replace with actual key
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests
app.use(
    session({
        secret: 'your-strong-secret-key-here', // replace with a strong secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true if using HTTPS
    })
);

// Sign-up endpoint
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return res.status(400).json({ error: error.message });
    }

    req.session.user = data.user; // Store user info in session
    res.json({ message: 'Login successful', user: data.user });
});

// Add workout endpoint
app.post('/add-workout', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

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

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json({ message: 'Workout added successfully', workout: data });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Health check endpoint (optional)
app.get('/health', (req, res) => {
    res.json({ message: 'Server is running smoothly!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
