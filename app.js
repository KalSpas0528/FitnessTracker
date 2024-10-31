// app.js
import "dotenv/config"; // Automatically loads environment variables
import express from "express";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Set up CORS
app.use(cors({
    origin: "https://kalspas0528.github.io", // Your frontend URL
    credentials: true
}));

app.use(bodyParser.json());

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(403).json({ error: "Unauthorized - Please log in" });

    jwt.verify(token, process.env.SUPABASE_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Token invalid" });
        req.user = user; // Attach user info to request
        next();
    });
}

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

// Login endpoint (returns JWT token and workouts)
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    // Fetch the user's workouts
    const { data: workouts, error: workoutsError } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", data.user.id); // Using user ID from Supabase

    if (workoutsError) {
        return res.status(500).json({ error: workoutsError.message });
    }

    res.json({ 
        message: "Login successful", 
        user: data.user, 
        access_token: data.session.access_token,
        workouts // Include workouts in the response
    });
});

// Add workout endpoint (requires JWT auth)
app.post("/add-workout", authenticateToken, async (req, res) => {
    const { exercise_name, sets, reps, weight, date } = req.body;

    const { data, error } = await supabase
        .from("workouts")
        .insert([{
            user_id: req.user.sub, // User ID from token payload
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

// Get workouts endpoint (requires JWT auth)
app.get("/get-workouts", authenticateToken, async (req, res) => {
    const { data: workouts, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", req.user.sub);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ workouts });
});

// Update workout endpoint (requires JWT auth)
app.put("/update-workout/:id", authenticateToken, async (req, res) => {
    const workoutId = parseInt(req.params.id);
    const { exercise_name, sets, reps, weight, date } = req.body;

    const { data, error } = await supabase
        .from("workouts")
        .update({
            exercise_name,
            sets,
            reps,
            weight,
            date
        })
        .eq("id", workoutId)
        .eq("user_id", req.user.sub); // Ensure the workout belongs to the logged-in user

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Workout updated successfully", workout: data });
});

// Delete workout endpoint (requires JWT auth)
app.delete("/delete-workout/:id", authenticateToken, async (req, res) => {
    const workoutId = parseInt(req.params.id);

    const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId)
        .eq("user_id", req.user.sub); // Ensure the workout belongs to the logged-in user

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(204).send(); // No content to return
});

// Logout endpoint (frontend can clear the token from storage)
app.post("/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
