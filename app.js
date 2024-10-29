// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5500', // Adjust this to your frontend origin
    credentials: true
}));

// Sample data store
let workouts = []; // You would normally use a database

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Perform login logic (check credentials)
    res.json({ success: true, workouts: workouts });
});

// Signup Endpoint
app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    // Perform signup logic (add user to database)
    res.json({ success: true });
});

// Add Workout Endpoint
app.post('/add-workout', (req, res) => {
    const { exercise_name, sets, reps, weight, date } = req.body;
    const newWorkout = { id: workouts.length + 1, exercise_name, sets, reps, weight, date };
    workouts.push(newWorkout);
    res.status(201).json({ success: true, workout: newWorkout });
});

// Get Workouts Endpoint
app.get('/get-workouts', (req, res) => {
    res.json({ workouts: workouts });
});

// Delete Workout Endpoint
app.delete('/delete-workout/:id', (req, res) => {
    const workoutId = parseInt(req.params.id);
    workouts = workouts.filter(workout => workout.id !== workoutId);
    res.status(204).send(); // No content to return
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
