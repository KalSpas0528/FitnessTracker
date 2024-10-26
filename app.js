// Load environment variables
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

// Initialize express app
const app = express();
const port = 3000; // Local development port

// Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL || 'https://pswsfndbnlpeqaznztss.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd3NmbmRibmxwZXFhem56dHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MzczMjUsImV4cCI6MjA0NTExMzMyNX0.MvEiRJ-L9qpuQ7ma4PCBNbWYdQk6wInwnqvCCHvyuLE';  // replace with secure key
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware setup
app.use(cors({
    origin: 'https://kalspas0528.github.io', // Allow requests from your GitHub Pages domain
    credentials: true // Allow cookies to be sent with requests
}));
app.use(bodyParser.json());
app.use(
    session({
        secret: 'your_secret_key', // replace with a strong secret for production
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true if running over HTTPS in production
    })
);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the PowerTitan API!');
});

// Sign-up endpoint
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Signup Error:", error.message);
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Signup successful', data });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login Error:", error.message);
        return res.status(400).json({ error: error.message });
    }

    req.session.user = data.user;
    res.json({ message: 'Login successful', user: data.user });
});

// Add workout endpoint
app.post('/add-workout', async (req, res) => {
    if (!req.session.user) {
        console.warn("Unauthorized access to add workout");
        return res.status(403).json({ error: 'Unauthorized - Please log in' });
    }

    const { exercise_name, sets, reps, weight, date } = req.body;
    const { data, error } = await supabase.from('workouts').insert([{
        user_id: req.session.user.id,
        exercise_name,
        sets,
        reps,
        weight,
        date
    }]);

    if (error) {
        console.error("Add Workout Error:", error.message);
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Workout added successfully', workout: data });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Start the server
const PORT = process.env.PORT || port;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
