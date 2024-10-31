// Frontend: script.js

// Section management
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => (section.style.display = "none"));
    document.getElementById(sectionId).style.display = "block";
}

// Check if user is logged in on page load
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (isLoggedIn) {
        showSection("add-workout");
        refreshWorkoutList();
    } else {
        showSection("login");
    }
});

// Sign-up form submission
document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch("https://fitnesstracker-41f0.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        alert("Signup successful! You can now log in.");
        showSection("login");
    } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.error}`);
    }
});

// Login form submission
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("https://fitnesstracker-41f0.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const responseData = await response.json();
        alert("Login successful!");
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("token", responseData.access_token); // Save JWT token here
        showSection("add-workout");
    } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error}`);
    }
});

// Add workout form submission
document.getElementById("workout-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const exercise_name = document.getElementById("exercise-name").value;
    const sets = document.getElementById("sets").value;
    const reps = document.getElementById("reps").value;
    const weight = document.getElementById("weight").value;
    const token = sessionStorage.getItem("token"); // Retrieve token

    const response = await fetch("https://fitnesstracker-41f0.onrender.com/add-workout", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Send token with request
        },
        body: JSON.stringify({ exercise_name, sets, reps, weight, date: new Date().toISOString() })
    });

    if (response.ok) {
        alert("Workout added!");
        await refreshWorkoutList();
        showSection("dashboard");
    } else {
        const errorData = await response.json();
        alert(`Failed to add workout: ${errorData.error}`);
    }
});

// Fetch and display workouts
async function refreshWorkoutList() {
    const token = sessionStorage.getItem("token"); // Retrieve token

    const response = await fetch("https://fitnesstracker-41f0.onrender.com/get-workouts", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}` // Send token with request
        }
    });

    if (response.ok) {
        const data = await response.json();
        const workouts = data.workouts;
        const workoutList = document.getElementById("workout-list");
        workoutList.innerHTML = "";

        workouts.forEach((workout) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${workout.exercise_name} - ${workout.sets} sets of ${workout.reps} reps, ${workout.weight} lbs`;
            workoutList.appendChild(listItem);
        });
    } else {
        const errorData = await response.json();
        alert(`Failed to retrieve workouts: ${errorData.error}`);
    }
}

// Logout button click handler
document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("token"); // Clear JWT token from session storage
    showSection("login");
    alert("Logged out successfully!");
});
