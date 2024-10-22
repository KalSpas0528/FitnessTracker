import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co';  // Replace with your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // Replace with your anon public key
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const signUpForm = document.getElementById("sign-up-form");
const logInForm = document.getElementById("log-in-form");
const workoutsList = document.getElementById("workout-list");
const logoutButton = document.getElementById("logout-button");
const addWorkoutForm = document.getElementById("add-workout-form");
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
    link.addEventListener('click', function(event) {
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
addWorkoutForm.addEventListener("submit", async (event) => {
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

    const { error } = await supabase.from('workouts').insert(workout);

    if (error) {
        console.error("Error adding workout:", error.message);
    } else {
        getWorkouts(currentUser.id);  // Refresh workout list after adding
        addWorkoutForm.reset();  // Clear form after submission
    }
});

// Delete a workout (optional functionality)
async function deleteWorkout(workoutId) {
    const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);

    if (error) {
        console.error("Error deleting workout:", error.message);
    } else {
        getWorkouts(currentUser.id);  // Refresh workout list after deletion
    }
}

// Handle sign-up form
if (signUpForm) {
    signUpForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        signUp(email, password);
    });
}

// Handle log-in form
if (logInForm) {
    logInForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        logIn(email, password);
    });
}

// Log out handler
if (logoutButton) {
    logoutButton.addEventListener("click", signOut);
}

// Auth State Listener to handle persistent sessions
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        currentUser = session.user;
        toggleSectionVisibility();
        getWorkouts(session.user.id);  // Fetch workouts when logged in
    } else {
        currentUser = null;
        toggleSectionVisibility();
        workoutsList.innerHTML = '';  // Clear workouts when logged out
    }
});
