// Remove the import statement at the top
// import { initModel, trainModel, predictNextWeight } from './ai-logic.js';

// Global variables
let workouts = [];
let nutritionData = [];
let model;

// API URL
const apiUrl = "https://fitnesstracker-41f0.onrender.com";

// Show selected section
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove("hidden");
    }
}

// Display workouts on the dashboard
async function displayWorkouts() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = "";
    
    // Fetch workouts from Supabase
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching workouts:', error);
        return;
    }

    workouts = data;

    workouts.forEach((workout, index) => {
        const listItem = document.createElement("div");
        listItem.className = "workout-item card";
        listItem.innerHTML = `
            <h3 class="font-bold">${workout.exercise_name}</h3>
            <p>Sets: ${workout.sets}</p>
            <p>Reps: ${workout.reps}</p>
            <p>Weight: ${workout.weight} lbs</p>
            <p>Date: ${new Date(workout.date).toLocaleDateString()}</p>
            <button class="btn btn-danger mt-2" onclick="deleteWorkout(${workout.id})">Delete</button>
        `;
        workoutList.appendChild(listItem);
    });

    updateWorkoutSummary();
    updateWorkoutChart();
}

// Update workout summary
function updateWorkoutSummary() {
    const totalWorkouts = workouts.length;
    const totalWeight = workouts.reduce((sum, workout) => sum + workout.weight * workout.sets * workout.reps, 0);
    document.getElementById("total-workouts").textContent = totalWorkouts;
    document.getElementById("total-weight").textContent = totalWeight;
}

// Update workout chart
function updateWorkoutChart() {
    const ctx = document.getElementById("workoutProgressChart");
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: workouts.map(w => w.exercise_name),
                datasets: [{
                    label: 'Weight (lbs)',
                    data: workouts.map(w => w.weight),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Delete a workout
async function deleteWorkout(id) {
    const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting workout:', error);
        showMessage("Error deleting workout");
    } else {
        await displayWorkouts();
        showMessage("Workout deleted successfully!");
    }
}

// Show confirmation message
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded";
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Show dashboard
function showDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="card">
                <h3 class="card-title">Recent Workouts</h3>
                <div id="workout-list"></div>
            </div>
            <div class="card">
                <h3 class="card-title">Workout Summary</h3>
                <p>Total Workouts: <span id="total-workouts"></span></p>
                <p>Total Weight Lifted: <span id="total-weight"></span> lbs</p>
            </div>
            <div class="card">
                <h3 class="card-title">Workout Progress</h3>
                <canvas id="workoutProgressChart"></canvas>
            </div>
        </div>
    `;
    displayWorkouts();
}

// Show add workout form
function showAddWorkout() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Add New Workout</h2>
        <form id="workout-form" class="card">
            <div class="mb-4">
                <label for="exercise-name" class="block text-gray-700 text-sm font-bold mb-2">Exercise Name:</label>
                <input type="text" id="exercise-name" class="form-input" required>
            </div>
            <div class="mb-4">
                <label for="sets" class="block text-gray-700 text-sm font-bold mb-2">Sets:</label>
                <input type="number" id="sets" class="form-input" required>
            </div>
            <div class="mb-4">
                <label for="reps" class="block text-gray-700 text-sm font-bold mb-2">Reps:</label>
                <input type="number" id="reps" class="form-input" required>
            </div>
            <div class="mb-4">
                <label for="weight" class="block text-gray-700 text-sm font-bold mb-2">Weight (lbs):</label>
                <input type="number" id="weight" class="form-input" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Workout</button>
        </form>
    `;
    document.getElementById('workout-form').addEventListener('submit', handleAddWorkout);
}

// Handle add workout form submission
async function handleAddWorkout(event) {
  event.preventDefault();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    showMessage("Please log in to add a workout");
    return;
  }

  const exerciseName = document.getElementById('exercise-name').value;
  const sets = parseInt(document.getElementById('sets').value);
  const reps = parseInt(document.getElementById('reps').value);
  const weight = parseInt(document.getElementById('weight').value);

  const { data, error } = await supabase
    .from('workouts')
    .insert([
      { 
        exercise_name: exerciseName, 
        sets, 
        reps, 
        weight, 
        user_id: user.id,
        date: new Date()
      }
    ]);

  if (error) {
    console.error('Error adding workout:', error);
    showMessage("Error adding workout: " + error.message);
  } else {
    await displayWorkouts();
    showMessage("Workout added successfully!");
    event.target.reset();

    // Predict next weight
    if (window.predictWorkout) {
      const predictedWeight = await window.predictWorkout(sets, reps);
      showMessage(`AI suggests ${predictedWeight} lbs for your next ${exerciseName}`);
    }
  }
}

// Show login form
function showLoginForm() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Login</h2>
        <form id="loginForm" class="space-y-4">
            <div>
                <label for="loginEmail" class="block mb-1">Email:</label>
                <input type="email" id="loginEmail" class="w-full p-2 border rounded" required>
            </div>
            <div>
                <label for="loginPassword" class="block mb-1">Password:</label>
                <input type="password" id="loginPassword" class="w-full p-2 border rounded" required>
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Login
            </button>
        </form>
    `;
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Show signup form
function showSignupForm() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Sign Up</h2>
        <form id="signupForm" class="space-y-4">
            <div>
                <label for="signupEmail" class="block mb-1">Email:</label>
                <input type="email" id="signupEmail" class="w-full p-2 border rounded" required>
            </div>
            <div>
                <label for="signupPassword" class="block mb-1">Password:</label>
                <input type="password" id="signupPassword" class="w-full p-2 border rounded" required>
            </div>
            <button type="submit" class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Sign Up
            </button>
        </form>
    `;
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        showMessage('Login failed: ' + error.message);
    } else {
        updateUIAfterLogin(data.user.email);
        showMessage('Logged in successfully!');
        showDashboard();
    }
}

// Handle signup form submission
async function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        showMessage('Signup failed: ' + error.message);
    } else {
        showMessage('Signup successful! Please check your email to confirm your account.');
        showLoginForm();
    }
}

// Update UI after successful login
function updateUIAfterLogin(email) {
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('signupBtn').classList.add('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    document.getElementById('loginStatus').textContent = `Logged in as ${email}`;
}

// Handle logout
async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        showMessage('Error logging out: ' + error.message);
    } else {
        document.getElementById('loginBtn').classList.remove('hidden');
        document.getElementById('signupBtn').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.add('hidden');
        document.getElementById('loginStatus').textContent = 'Not logged in';
        workouts = [];
        nutritionData = [];
        showMessage('Logged out successfully!');
        showDashboard();
    }
}

// Show nutrition page
function showNutrition() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Nutrition Tracking</h2>
        <p>Nutrition tracking feature coming soon!</p>
    `;
}

// Show motivation page
function showMotivation() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Daily Motivation</h2>
        <p>Your daily motivation feature is coming soon!</p>
    `;
}

// Show chat with Titan AI
function showChatWithTitanAI() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Chat with Titan AI</h2>
        <p>Titan AI chat feature is coming soon!</p>
    `;
}

// Initialize the application
async function init() {
    if (window.initModel) {
        await window.initModel();
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        updateUIAfterLogin(user.email);
    } else {
        document.getElementById('loginStatus').textContent = 'Not logged in';
    }
    showDashboard();
}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Make functions globally available
window.showDashboard = showDashboard;
window.showAddWorkout = showAddWorkout;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.showNutrition = showNutrition;
window.showMotivation = showMotivation;
window.showChatWithTitanAI = showChatWithTitanAI;
window.logout = logout;
window.deleteWorkout = deleteWorkout;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;

