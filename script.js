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

    // If the motivation section is selected, show a random quote
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

// Delete a workout
function deleteWorkout(index) {
    workouts.splice(index, 1);
    displayWorkouts();
}

// Handle workout form submission
document.getElementById("workout-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const exerciseName = document.getElementById("exercise-name").value;
    const sets = document.getElementById("sets").value;
    const reps = document.getElementById("reps").value;
    const weight = document.getElementById("weight").value;

    workouts.push({ exercise_name: exerciseName, sets: parseInt(sets), reps: parseInt(reps), weight: parseInt(weight) });
    displayWorkouts();
    this.reset();
});

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("login-status").textContent = "Logged In"; // Update login status
    const randomServer = serverNames[Math.floor(Math.random() * serverNames.length)]; // Random server name
    document.getElementById("server-name").textContent = `Server: ${randomServer}`; // Display server name
    
    // Initialize workouts with example workouts
    workouts = [...exampleWorkouts]; // Populate workouts with example workouts

    showSection('dashboard'); // Show the dashboard after login
    displayWorkouts(); // Update the dashboard with example workouts
});

// Chart.js implementation for workout progress
const ctx = document.getElementById("workoutProgressChart").getContext("2d");
let workoutProgressChart;

// Update the chart with the latest workout data
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
