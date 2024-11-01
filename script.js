const apiUrl = "https://fitnesstracker-41f0.onrender.com"; // URL for your API
let workouts = [];
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

// Confirmation message function
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = "confirmation-message";
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Delete a workout
function deleteWorkout(index) {
    workouts.splice(index, 1);
    displayWorkouts();
    showMessage("Workout deleted successfully!");
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
