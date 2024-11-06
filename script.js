const apiUrl = "https://fitnesstracker-41f0.onrender.com"; // URL for your API
let workouts = [];
let mealLogs = [];  // Array to hold the logged meals

const exampleWorkouts = [
    { exercise_name: "Lat Pulldowns", sets: 3, reps: 10, weight: 75 },
    { exercise_name: "Hammer Curls", sets: 3, reps: 12, weight: 25 }
];
const motivationQuotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Success isn’t always about greatness. It’s about consistency.",
    "All progress takes place outside the comfort zone.",
    "Dream big and dare to fail.",
    "Hard work beats talent when talent doesn’t work hard."
];
const serverNames = ["Server A", "Server B", "Server C", "Server D"];

// Show selected section
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "motivation-section") {
        document.getElementById("motivation-content").textContent =
            motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
    }
}

// Display workouts on the dashboard
function displayWorkouts() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = "";
    workouts.forEach((workout, index) => {
        const listItem = document.createElement("div");
        listItem.className = "workout-item";
        listItem.innerHTML = `
            <table>
                <tr><td>Exercise</td><td>${workout.exercise_name}</td></tr>
                <tr><td>Sets</td><td>${workout.sets}</td></tr>
                <tr><td>Reps</td><td>${workout.reps}</td></tr>
                <tr><td>Weight</td><td>${workout.weight}</td></tr>
            </table>
            <button class="delete-button" onclick="deleteWorkout(${index})">Delete</button>
        `;
        workoutList.appendChild(listItem);
    });

    document.getElementById("total-workouts").textContent = workouts.length;
    const totalWeight = workouts.reduce((sum, workout) => sum + workout.weight * workout.sets * workout.reps, 0);
    document.getElementById("total-weight").textContent = totalWeight;
    updateChart();
}

// Display nutrient logs
function displayMealLogs() {
    const mealLogList = document.getElementById("meal-log-list");
    mealLogList.innerHTML = "";
    mealLogs.forEach((meal, index) => {
        const listItem = document.createElement("div");
        listItem.className = "meal-log-item";
        listItem.innerHTML = `
            <table>
                <tr><td>Food</td><td>${meal.foodName}</td></tr>
                <tr><td>Calories</td><td>${meal.calories}</td></tr>
                <tr><td>Protein</td><td>${meal.protein}</td></tr>
                <tr><td>Carbs</td><td>${meal.carbs}</td></tr>
                <tr><td>Fat</td><td>${meal.fat}</td></tr>
            </table>
            <button class="delete-button" onclick="deleteMeal(${index})">Delete</button>
        `;
        mealLogList.appendChild(listItem);
    });
}

// Delete a workout
function deleteWorkout(index) {
    workouts.splice(index, 1);
    displayWorkouts();
    showMessage("Workout deleted successfully!");
}

// Delete a meal log
function deleteMeal(index) {
    mealLogs.splice(index, 1);
    displayMealLogs();
    showMessage("Meal deleted successfully!");
}

// Confirmation message function
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = "confirmation-message";
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Handle workout form submission
document.getElementById("workout-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const exerciseName = document.getElementById("exercise-name").value;
    const sets = parseInt(document.getElementById("sets").value);
    const reps = parseInt(document.getElementById("reps").value);
    const weight = parseInt(document.getElementById("weight").value);

    const newWorkout = { exercise_name: exerciseName, sets: sets, reps: reps, weight: weight };
    workouts.push(newWorkout);
    displayWorkouts();
    showMessage("Workout added successfully!");
    this.reset();
});

// Handle meal log form submission
document.getElementById("meal-log-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const foodName = document.getElementById("food-name").value;
    const calories = parseInt(document.getElementById("calories").value);
    const protein = parseInt(document.getElementById("protein").value);
    const carbs = parseInt(document.getElementById("carbs").value);
    const fat = parseInt(document.getElementById("fat").value);

    const newMeal = { foodName, calories, protein, carbs, fat };
    mealLogs.push(newMeal);
    displayMealLogs();
    showMessage("Meal logged successfully!");
    this.reset();
});

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("login-status").textContent = `Logged in as ${email}`;
            const randomServer = serverNames[Math.floor(Math.random() * serverNames.length)];
            document.getElementById("server-name").textContent = `Server: ${randomServer}`;
            
            workouts = exampleWorkouts.concat(data.workouts || []);
            displayWorkouts();
            showSection('dashboard');
        } else {
            document.getElementById("login-status").textContent = `Login failed: ${data.error}`;
        }
    } catch (error) {
        document.getElementById("login-status").textContent = `Error: ${error.message}`;
    }
});

// Handle logout
document.getElementById("logout-button").addEventListener("click", function () {
    document.getElementById("login-status").textContent = "Logged Out";
    workouts = [];
    mealLogs = [];  // Clear meal logs on logout
    document.getElementById("workout-list").innerHTML = "";
    document.getElementById("total-workouts").textContent = "0";
    document.getElementById("total-weight").textContent = "0";

    if (workoutProgressChart) {
        workoutProgressChart.destroy();
    }

    showSection('login-section');
});

// Chart.js for workout progress
const ctx = document.getElementById("workoutProgressChart").getContext("2d");
let workoutProgressChart;

function updateChart() {
    const labels = workouts.map(workout => workout.exercise_name);
    const data = workouts.map(workout => workout.weight);

    if (workoutProgressChart) {
        workoutProgressChart.destroy();
    }

    workoutProgressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weights Lifted',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize with example workouts
window.onload = function () {
    workouts = exampleWorkouts;
    displayWorkouts();
    const randomServer = serverNames[Math.floor(Math.random() * serverNames.length)];
    document.getElementById("server-name").textContent = `Server: ${randomServer}`;
};
