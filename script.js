const apiUrl = "https://fitnesstracker-41f0.onrender.com";
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

function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "motivation-section") {
        document.getElementById("motivation-content").textContent =
            motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
    }
}

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
                <tr><td>Weight</td><td>${workout.weight} lbs</td></tr>
            </table>
            <button class="delete-button" onclick="deleteWorkout(${index})">Delete</button>
        `;
        workoutList.appendChild(listItem);
    });
    document.getElementById("total-workouts").textContent = workouts.length;
    const totalWeight = workouts.reduce((sum, workout) => sum + workout.weight * workout.sets, 0);
    document.getElementById("total-weight").textContent = `${totalWeight} lbs`;
    
    // Update the workout progress chart
    updateWorkoutProgressChart();
}

// Function to initialize and update the chart
function updateWorkoutProgressChart() {
    const ctx = document.getElementById('workoutProgressChart').getContext('2d');

    const labels = workouts.map(workout => workout.exercise_name);
    const data = workouts.map(workout => workout.weight * workout.reps * workout.sets); // Weight lifted per exercise

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weight Lifted',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
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

// Event listener for adding workouts
document.getElementById("workout-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const newWorkout = {
        exercise_name: document.getElementById("exercise-name").value,
        sets: parseInt(document.getElementById("sets").value),
        reps: parseInt(document.getElementById("reps").value),
        weight: parseInt(document.getElementById("weight").value),
    };
    workouts.push(newWorkout);
    displayWorkouts();
    event.target.reset();
});

// Delete workout function
function deleteWorkout(index) {
    workouts.splice(index, 1);
    displayWorkouts();
}

// Event listener for login form
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    // Simulated login logic
    if (email && password) {
        document.getElementById("login-status").textContent = "Logged In";
        showSection("dashboard");
        workouts = exampleWorkouts; // Load example workouts
        displayWorkouts();
    }
});

// Logout function
document.getElementById("logout-button").addEventListener("click", function() {
    document.getElementById("login-status").textContent = "Logged Out";
    workouts = [];
    displayWorkouts();
    showSection("login-section");
});

// Initial load
showSection("login-section");