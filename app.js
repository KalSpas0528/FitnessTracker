//app.js
// Import the necessary libraries
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the "public" directory
app.use(session({
    secret: 'your-session-secret', // Replace with a secure secret
    resave: false,
    saveUninitialized: true
}));

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile('path/to/your/login.html'); // Adjust the path to your login page
});

// Handle login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { user, error } = await supabase.auth.signIn({ email, password });

    if (error) {
        console.error('Login error:', error.message);
        return res.status(401).send('Login failed: ' + error.message);
    }

    req.session.user = user; // Store user information in session
    res.redirect('/dashboard'); // Redirect to dashboard after login
});

// Serve the dashboard
app.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.sendFile('path/to/your/dashboard.html'); // Adjust the path to your dashboard page
});

// Handle adding workouts
app.post('/add-workout', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized - Please log in');
    }

    const { exercise_name, sets, reps, weight } = req.body;
    const { data, error } = await supabase
        .from('workouts')
        .insert([
            {
                user_id: req.session.user.id, // Use the authenticated user's ID
                exercise_name,
                sets,
                reps,
                weight,
            }
        ]);

    if (error) {
        console.error('Failed to add workout:', error.message);
        return res.status(500).send('Failed to add workout: ' + error.message);
    }

    res.send('Workout added successfully!');
});

// Handle logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err.message);
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/login'); // Redirect to login after logout
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
