// File: app.js

const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(bodyParser.json());
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use((req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true; // Mark user as logged in if session exists
    } else {
        res.locals.isLoggedIn = false;
    }
    next();
});

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        res.status(400).json({ message: "Signup failed", error });
    } else {
        res.status(200).json({ message: "Signup successful" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
        res.status(400).json({ message: "Login failed", error });
    } else {
        req.session.user = data.user;
        res.status(200).json({ message: "Login successful" });
    }
});

app.post("/add-workout", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
    }

    const { name, sets, reps, weight } = req.body;
    const { data, error } = await supabase.from("workouts").insert([
        {
            user_id: req.session.user.id,
            name,
            sets,
            reps,
            weight,
        },
    ]);

    if (error) {
        res.status(500).json({ message: "Failed to add workout", error });
    } else {
        res.status(200).json({ message: "Workout added successfully" });
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ message: "Logout failed" });
        } else {
            res.status(200).json({ message: "Logout successful" });
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
