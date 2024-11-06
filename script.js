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

    if (sectionId === "workout-history-section") {
        fetchWorkoutHistory();
    }
}

// Fetch workout history
async function fetchWorkoutHistory() {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage after login

    if (!token) {
        document.getElementById("workout-history-list").innerHTML = "<p>Please log in to view workout history.</p>";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/get-workouts`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.workouts) {
            displayWorkoutHistory(data.workouts);
        } else {
            document.getElementById("workout-history-list").innerHTML = "<p>No workout history found.</p>";
        }
    } catch (error) {
        document.getElementById("workout-history-list").innerHTML = `<p>Error fetching workout history: ${error.message}</p>`;
    }
}

// Display workout history
function displayWorkoutHistory(workouts) {
    const historyList = document.getElementById("workout-history-list");
    historyList.innerHTML = ""; // Clear any existing content

    workouts.forEach((workout) => {
        const listItem = document.createElement("div");
        listItem.className = "workout-history-item";
        listItem.innerHTML = `
            <table>
                <tr><td>Exercise</td><td>${workout.exercise_name}</td></tr>
                <tr><td>Sets</td><td>${workout.sets}</td></tr>
                <tr><td>Reps</td><td>${workout.reps}</td></tr>
                <tr><td>Weight</td><td>${workout.weight}</td></tr>
                <tr><td>Date</td><td>${new Date(workout.date).toLocaleDateString()}</td></tr>
            </table>
        `;
        historyList.appendChild(listItem);
    });
}

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
            localStorage.setItem("token", data.access_token); // Store the token in localStorage
            document.getElementById("login-status").textContent = `Logged in as ${email}`;
            const randomServer = serverNames[Math.floor(Math.random() * serverNames.length)];
            document.getElementById("server-name").textContent = `Server: ${randomServer}`;
            showSection('dashboard');
        } else {
            document.getElementById("login-status").textContent = `Login failed: ${data.error}`;
        }
    } catch (error) {
        document.getElementById("login-status").textContent = `Error: ${error.message}`;
    }
});

// Handle logout
document.getElementById("logout-button").addEventListener("click", () => {
    localStorage.removeItem("token");
    document.getElementById("login-status").textContent = "Logged Out";
    showSection('login-section');
});

