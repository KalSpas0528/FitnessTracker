import "dotenv/config"; // Automatically loads environment variables
import express from "express";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Set up CORS
app.use(cors({
    origin: "https://kalspas0528.github.io", // Your frontend URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(bodyParser.json());
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Set to true if using HTTPS in production
            sameSite: "lax" // Prevents some cross-site cookie issues
        }
    })
);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the PowerTitan API!");
});

// Sign-up endpoint
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Signup successful", user: data.user });
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    req.session.user = data.user; // Store user information in the session
    res.json({ message: "Login successful", user: data.user });
});

// Test session endpoint
app.get('/check-session', (req, res) => {
    res.json({ sessionUser: req.session.user || "No user in session" });
});

// Add workout endpoint
app.post("/add-workout", async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: "Unauthorized - Please log in" });
    }

    const { exercise_name, sets, reps, weight, date } = req.body;
    const { data, error } = await supabase.from("workouts").insert([{
        user_id: req.session.user.id,
        exercise_name,
        sets,
        reps,
        weight,
        date
    }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Workout added successfully", workout: data });
});

// Get workouts endpoint
app.get("/get-workouts", async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: "Unauthorized - Please log in" });
    }

    const { user } = req.session;
    const { data: workouts, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ workouts });
});

// Delete workout endpoint
app.delete("/delete-workout/:id", async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: "Unauthorized - Please log in" });
    }

    const workoutId = parseInt(req.params.id);
    const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId)
        .eq("user_id", req.session.user.id); // Ensure the workout belongs to the logged-in user

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(204).send(); // No content to return
});

// Logout endpoint
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
