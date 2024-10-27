require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors({
    origin: "https://kalspas0528.github.io",
    credentials: true
}));
app.use(bodyParser.json());
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
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

    res.json({ message: "Signup successful", data });
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    req.session.user = data.user; // Store user data in session
    console.log("User logged in:", req.session.user); // Log user session
    res.json({ message: "Login successful", user: data.user });
});

// Add workout endpoint
app.post("/add-workout", async (req, res) => {
    if (!req.session.user) {
        console.log("Unauthorized access attempt:", req.session.user);
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

// Get user workouts
app.get("/user-workouts", async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: "Unauthorized - Please log in" });
    }

    const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", req.session.user.id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
});

// Logout endpoint
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
