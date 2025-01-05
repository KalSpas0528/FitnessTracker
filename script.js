window.showDashboard = showDashboard;
window.showAddWorkout = showAddWorkout;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.showNutrition = showNutrition;
window.showMotivation = showMotivation;
window.showChatWithTitanAI = showChatWithTitanAI;
window.logout = logout;

// Global variables
let workouts = [];
let nutritionData = [];
let model;
let chatMessages = []; // Added global variable for chat messages

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

    const workoutGrid = document.createElement('div');
    workoutGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    workouts.forEach((workout, index) => {
        const workoutCard = document.createElement("div");
        workoutCard.className = "workout-item card bg-white p-4 rounded shadow";
        workoutCard.innerHTML = `
            <h3 class="font-bold text-lg mb-2">${workout.exercise_name}</h3>
            <p class="text-sm mb-1">Sets: ${workout.sets}</p>
            <p class="text-sm mb-1">Reps: ${workout.reps}</p>
            <p class="text-sm mb-1">Weight: ${workout.weight} lbs</p>
            <p class="text-sm mb-2">Date: ${new Date(workout.date).toLocaleDateString()}</p>
            <button class="btn btn-danger mt-2 text-sm px-2 py-1" onclick="deleteWorkout(${workout.id})">Delete</button>
        `;
        workoutGrid.appendChild(workoutCard);
    });

    workoutList.appendChild(workoutGrid);

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
    console.log('showDashboard function called');
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2">
                <div class="card">
                    <h3 class="card-title">Recent Workouts</h3>
                    <div id="workout-list" class="overflow-y-auto max-h-96"></div>
                </div>
            </div>
            <div class="lg:col-span-1">
                <div class="card mb-4">
                    <h3 class="card-title">Workout Summary</h3>
                    <p>Total Workouts: <span id="total-workouts"></span></p>
                    <p>Total Weight Lifted: <span id="total-weight"></span> lbs</p>
                </div>
                <div class="card">
                    <h3 class="card-title">Workout Progress</h3>
                    <canvas id="workoutProgressChart"></canvas>
                </div>
            </div>
        </div>
    `;
    displayWorkouts();
}

// Show add workout form
function showAddWorkout() {
    console.log('showAddWorkout function called');
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
    console.log('showLoginForm function called');
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
    console.log('showSignupForm function called');
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
    console.log('logout function called');
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

// Nutrition tracking
function showNutrition() {
    console.log('showNutrition function called');
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Nutrition Tracking</h2>
        <form id="nutrition-form" class="mb-4">
            <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                <input type="text" id="food-item" placeholder="Food Item" class="form-input" required>
                <input type="number" id="calories" placeholder="Calories" class="form-input" required>
                <input type="number" id="protein" placeholder="Protein (g)" class="form-input" required>
                <input type="number" id="carbs" placeholder="Carbs (g)" class="form-input" required>
                <input type="number" id="fat" placeholder="Fat (g)" class="form-input" required>
                <input type="date" id="food-date" class="form-input" required>
            </div>
            <button type="submit" class="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Food</button>
        </form>
        <div id="nutrition-list" class="space-y-2"></div>
    `;
    document.getElementById('nutrition-form').addEventListener('submit', handleAddNutrition);
    displayNutritionData();
}

function handleAddNutrition(event) {
    event.preventDefault();
    const foodItem = document.getElementById('food-item').value;
    const calories = document.getElementById('calories').value;
    const protein = document.getElementById('protein').value;
    const carbs = document.getElementById('carbs').value;
    const fat = document.getElementById('fat').value;
    const date = document.getElementById('food-date').value;

    nutritionData.push({ foodItem, calories, protein, carbs, fat, date });
    event.target.reset();
    displayNutritionData();
}

function displayNutritionData() {
    const nutritionList = document.getElementById('nutrition-list');
    nutritionList.innerHTML = '';
    nutritionData.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'bg-white p-2 rounded shadow flex justify-between items-center';
        itemElement.innerHTML = `
            <div>
                <p><strong>${item.foodItem}</strong> (${item.date})</p>
                <p>Calories: ${item.calories}, Protein: ${item.protein}g, Carbs: ${item.carbs}g, Fat: ${item.fat}g</p>
            </div>
            <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600" onclick="deleteNutritionItem(${index})">Delete</button>
        `;
        nutritionList.appendChild(itemElement);
    });
}

function deleteNutritionItem(index) {
    nutritionData.splice(index, 1);
    displayNutritionData();
}

// Motivation quotes
const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "The only way to do great work is to love what you do."
];

function showMotivation() {
    console.log('showMotivation function called');
    const mainContent = document.getElementById('main-content');
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Daily Motivation</h2>
        <div class="bg-white p-6 rounded shadow text-center">
            <p class="text-xl italic">"${randomQuote}"</p>
        </div>
        <button id="new-quote" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">New Quote</button>
    `;
    document.getElementById('new-quote').addEventListener('click', showMotivation);
}

// Chat with Titan AI
function showChatWithTitanAI() {
    console.log('showChatWithTitanAI function called');
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Chat with Titan AI</h2>
        <div id="chat-messages" class="bg-white p-4 rounded shadow mb-4 h-64 overflow-y-auto"></div>
        <form id="chat-form" class="flex">
            <input type="text" id="chat-input" placeholder="Type your message..." class="flex-grow form-input mr-2" required>
            <button type="submit" class="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">Send</button>
        </form>
    `;
    document.getElementById('chat-form').addEventListener('submit', handleChatSubmit);
    
    // Load saved messages
    const chatMessagesElement = document.getElementById('chat-messages');
    chatMessages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'mb-2';
        messageElement.innerHTML = `<strong>${message.sender}:</strong> ${message.text}`;
        chatMessagesElement.appendChild(messageElement);
    });
    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

// Update the handleChatSubmit function to use the TensorFlow.js model
async function handleChatSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const message = input.value;
    input.value = '';

    addMessageToChat('You', message);

    try {
        // Use the TensorFlow.js model to generate a response
        const response = await window.handleChatResponse(message);
        addMessageToChat('Titan AI', response);
    } catch (error) {
        console.error('Error in chat:', error);
        addMessageToChat('Titan AI', "I'm sorry, I encountered an error. Please try again.");
    }
}

function addMessageToChat(sender, message) {
    const chatMessagesElement = document.getElementById('chat-messages'); // Corrected variable name
    const messageElement = document.createElement('div');
    messageElement.className = 'mb-2';
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessagesElement.appendChild(messageElement);
    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;

    // Save the message
    chatMessages.push({ sender, text: message });
}

// Initialize the application
async function init() {
    if (window.initModel) {
        await window.initModel();
        console.log('TensorFlow.js model initialized');
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        updateUIAfterLogin(user.email);
    } else {
        document.getElementById('loginStatus').textContent = 'Not logged in';
    }
    showDashboard();

    // Initialize and train the AI model
    if (window.trainModel) {
        await window.trainModel();
        console.log('TensorFlow.js model trained');
    }

    // Add event listeners to sidebar buttons
    document.getElementById('dashboardBtn').addEventListener('click', () => {
        showDashboard();
        console.log('Dashboard button clicked');
    });
    document.getElementById('addWorkoutBtn').addEventListener('click', () => {
        showAddWorkout();
        console.log('Add Workout button clicked');
    });
    document.getElementById('nutritionBtn').addEventListener('click', () => {
        showNutrition();
        console.log('Nutrition button clicked');
    });
    document.getElementById('motivationBtn').addEventListener('click', () => {
        showMotivation();
        console.log('Motivation button clicked');
    });
    document.getElementById('chatBtn').addEventListener('click', () => {
        showChatWithTitanAI();
        console.log('Chat button clicked');
    });
    document.getElementById('loginBtn').addEventListener('click', () => {
        showLoginForm();
        console.log('Login button clicked');
    });
    document.getElementById('signupBtn').addEventListener('click', () => {
        showSignupForm();
        console.log('Signup button clicked');
    });
    document.getElementById('logoutBtn').addEventListener('click', () => {
        logout();
        console.log('Logout button clicked');
    });
}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

window.deleteWorkout = deleteWorkout;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleAddNutrition = handleAddNutrition;
window.displayNutritionData = displayNutritionData;
window.deleteNutritionItem = deleteNutritionItem;
window.handleChatSubmit = handleChatSubmit;
window.addMessageToChat = addMessageToChat;

