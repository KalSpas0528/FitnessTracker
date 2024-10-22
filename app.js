// Initialize Supabase client
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd3NmbmRibmxwZXFhem56dHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MzczMjUsImV4cCI6MjA0NTExMzMyNX0.MvEiRJ-L9qpuQ7ma4PCBNbWYdQk6wInwnqvCCHvyuLE';

const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// DOM Elements
const signUpForm = document.getElementById("sign-up-form");
const logInForm = document.getElementById("log-in-form");
const workoutsList = document.getElementById("workouts-list");
const logoutButton = document.getElementById("logout-button");
const addWorkoutForm = document.getElementById("add-workout-form"); // Form for adding workouts

// User Authentication Functions
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
    alert("Signup failed: " + error.message);
  } else {
    console.log("Sign up successful!", data.user);
    alert("Sign up successful!");
  }
}

async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
    alert("Login failed: " + error.message);
  } else {
    console.log("Login successful!", data.user);
    alert("Login successful!");
    getWorkouts(data.user.id); // Fetch workouts after login
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("User signed out successfully!");
    workoutsList.innerHTML = ''; // Clear workout list after sign out
    alert("You have been signed out.");
  }
}

// Workouts Management
async function getWorkouts(userId) {
  const { data, error } = await supabase
    .from('workouts') // Workouts table
    .select('*')
    .eq('user_id', userId) // Fetch only workouts for the logged-in user
    .order('date', { ascending: false }); // Sort workouts by date, descending

  if (error) {
    console.error("Error fetching workouts:", error.message);
  } else {
    displayWorkouts(data); // Display workouts in the UI
  }
}

// Display Workouts
function displayWorkouts(workouts) {
  workoutsList.innerHTML = ''; // Clear previous workouts
  workouts.forEach(workout => {
    const workoutElement = document.createElement("div");
    workoutElement.classList.add("workout");
    workoutElement.innerHTML = `
      <p>Exercise: ${workout.exercise_name}</p>
      <p>Sets: ${workout.sets} | Reps: ${workout.reps}</p>
      <p>Weight: ${workout.weight} lbs</p>
      <p>Date: ${new Date(workout.date).toLocaleDateString()}</p>
    `;
    workoutsList.appendChild(workoutElement);
  });
}

// Add New Workout
async function addWorkout(userId, workoutData) {
  const { data, error } = await supabase
    .from('workouts')
    .insert([
      { user_id: userId, ...workoutData }
    ]);

  if (error) {
    console.error("Error adding workout:", error.message);
    alert("Failed to add workout: " + error.message);
  } else {
    console.log("Workout added successfully:", data);
    alert("Workout added successfully!");
    getWorkouts(userId); // Refresh workouts list
  }
}

// Form Handlers
signUpForm?.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  const email = event.target.email.value;
  const password = event.target.password.value;
  signUp(email, password);
});

logInForm?.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  const email = event.target.email.value;
  const password = event.target.password.value;
  logIn(email, password);
});

addWorkoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission
  const session = supabase.auth.session();
  
  if (!session) {
    alert("You need to be logged in to add a workout.");
    return;
  }

  const userId = session.user.id;
  const workoutData = {
    exercise_name: event.target["exercise-name"].value,
    sets: event.target.sets.value,
    reps: event.target.reps.value,
    weight: event.target.weight.value,
    date: event.target["workout-date"].value
  };

  // Validate workout data
  if (!workoutData.exercise_name || workoutData.sets <= 0 || workoutData.reps <= 0 || workoutData.weight <= 0 || !workoutData.date) {
    alert("Please fill in all fields correctly.");
    return;
  }

  await addWorkout(userId, workoutData);
  addWorkoutForm.reset(); // Reset the form after submission
});

// Log out handler
logoutButton?.addEventListener("click", signOut);

// Auth State Listener (if user is already logged in)
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    console.log("Logged in as:", session.user);
    getWorkouts(session.user.id); // Fetch workouts when logged in
  } else {
    console.log("User is logged out");
    workoutsList.innerHTML = ''; // Clear workouts when logged out
  }
});
