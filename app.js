import { createClient } from '@supabase/supabase-js';

// Replace with your actual API URL and Key from Supabase
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co'; // Your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your API key

const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const signUpForm = document.getElementById("sign-up-form");
const logInForm = document.getElementById("log-in-form");
const workoutsList = document.getElementById("workouts-list");
const logoutButton = document.getElementById("logout-button");

// User Authentication Functions
async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
  } else {
    console.log("Sign up successful!", user);
    // Optionally, you can call fetchWorkouts after sign-up.
  }
}

async function logIn(email, password) {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
  } else {
    console.log("Login successful!", user);
    // After login, fetch workouts
    getWorkouts(user.id);
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("User signed out successfully!");
    workoutsList.innerHTML = ''; // Clear workout list after sign out
  }
}

// Workouts Management
async function getWorkouts(userId) {
  const { data, error } = await supabase
    .from('workouts')  // Workouts table
    .select('*')
    .eq('user_id', userId)  // Fetch only workouts for the logged-in user
    .order('date', { ascending: false });  // Sort workouts by date, descending

  if (error) {
    console.error("Error fetching workouts:", error.message);
  } else {
    displayWorkouts(data);  // Display workouts in the UI
  }
}

function displayWorkouts(workouts) {
  workoutsList.innerHTML = '';  // Clear previous workouts
  workouts.forEach(workout => {
    const workoutElement = document.createElement("div");
    workoutElement.classList.add("workout");
    workoutElement.innerHTML = `
      <p>Exercise: ${workout.exercise_name}</p>
      <p>Sets: ${workout.sets} | Reps: ${workout.reps}</p>
      <p>Date: ${new Date(workout.date).toLocaleDateString()}</p>
    `;
    workoutsList.appendChild(workoutElement);
  });
}

// Form Handlers
signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();  // Prevent form submission
  const email = event.target.email.value;
  const password = event.target.password.value;
  signUp(email, password);
});

logInForm.addEventListener("submit", (event) => {
  event.preventDefault();  // Prevent form submission
  const email = event.target.email.value;
  const password = event.target.password.value;
  logIn(email, password);
});

// Log out handler
logoutButton.addEventListener("click", signOut);

// Auth State Listener (if user is already logged in)
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    // User is logged in
    console.log("Logged in as:", session.user);
    getWorkouts(session.user.id); // Fetch workouts when logged in
  } else {
    // User is logged out
    console.log("User is logged out");
    workoutsList.innerHTML = ''; // Clear workouts when logged out
  }
});
