import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co'; // Replace with your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with your anon public key
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const signUpForm = document.getElementById("sign-up-form");
const logInForm = document.getElementById("log-in-form");
const workoutsList = document.getElementById("workout-list");
const logoutButton = document.getElementById("logout-button");
const addWorkoutForm1 = document.getElementById("add-workout-form"); // First form in index.html
const addWorkoutForm2 = document.getElementById("add-workout-form-2"); // Second form in add-workouts.html
const sidebarLinks = document.querySelectorAll('#sidebar nav ul li a');

// Variables to store user session
let currentUser = null;

// Function to show or hide sections based on login status
function toggleSectionVisibility() {
    if (currentUser) {
        document.getElementById('add-workout').classList.remove('hidden');
        document.getElementById('account').classList.remove('hidden');
    } else {
        document.getElementById('add-workout').classList.add('hidden');
        document.getElementById('account').classList.add('hidden');
    }
}

// Handle Sidebar Navigation Links
sidebarLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const target = this.getAttribute('href').substring(1);
        showSection(target);
    });
});

// Show the target section
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// User Authentication Functions
async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        console.error("Error signing up:", error.message);
    } else {
        console.log("Sign up successful!", user);
    }
}

async function logIn(email, password) {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error("Error logging in:", error.message);
    } else {
        console.log("Login successful!", user);
        currentUser = user;
        toggleSectionVisibility();
        getWorkouts(user.id);  // Fetch workouts after login
    }
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error.message);
    } else {
        console.log("User signed out successfully!");
        currentUser = null;
        workoutsList.innerHTML = '';
        toggleSectionVisibility();
    }
}

// Fetch and display workouts for the logged-in user
async function getWorkouts(userId) {
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

    if (error) {
        console.error("Error fetching workouts:", error.message);
    } else {
        displayWorkouts(data);
    }
}

// Display the fetched workouts in the UI
function displayWorkouts(workouts) {
    workoutsList.innerHTML = '';
    workouts.forEach(workout => {
        const workoutElement = document.createElement("li");
        workoutElement.innerHTML = `
            Date: ${new Date(workout.date).toLocaleDateString()}, 
            Exercise: ${workout.exercise_name}, 
            Sets: ${workout.sets}, 
            Reps: ${workout.reps}, 
            Weight: ${workout.weight} lbs
            <button onclick="deleteWorkout(${workout.id})">Delete</button>`;
        workoutsList.appendChild(workoutElement);
    });
}

// Add a new workout (only if user is logged in)
async function addWorkout(workout) {
    const { error } = await supabase.from('workouts').insert(workout);

    if (error) {
        console.error("Error adding workout:", error.message);
    } else {
        getWorkouts(currentUser.id);  // Refresh workout list after adding
    }
}

// Handle workout form submissions
addWorkoutForm1?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) {
        alert("You must be logged in to add a workout!");
        return;
    }

    const workout = {
        user_id: currentUser.id,
        exercise_name: document.getElementById("exercise-name").value,
        sets: parseInt(document.getElementById("sets").value),
        reps: parseInt(document.getElementById("reps").value),
        weight: parseInt(document.getElementById("weight").value),
        date: document.getElementById("workout-date").value
    };

    await addWorkout(workout);
    addWorkoutForm1.reset();  // Clear form after submission
});

// Handle second workout form submission
addWorkoutForm2?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) {
        alert("You must be logged in to add a workout!");
        return;
    }

    const workout = {
        user_id: currentUser.id,
        exercise_name: document.getElementById("exercise-name-2").value,
        sets: parseInt(document.getElementById("sets-2").value),
        reps: parseInt(document.getElementById("reps-2").value),
        weight: parseInt(document.getElementById("weight-2").value),
        date: document.getElementById("workout-date-2").value
    };

    await addWorkout(workout);
    addWorkoutForm2.reset();  // Clear form after submission
});

// Delete a workout by ID
async function deleteWorkout(workoutId) {
    const { error } = await supabase.from('workouts').delete().eq('id', workoutId);
    if (error) {
        console.error("Error deleting workout:", error.message);
    } else {
        getWorkouts(currentUser.id); // Refresh workout list after deletion
    }
}

// Check if the user is logged in when the app loads
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        currentUser = session.user;
        toggleSectionVisibility();
        getWorkouts(currentUser.id);  // Fetch workouts on load
    } else {
        currentUser = null;
        toggleSectionVisibility();
    }
});