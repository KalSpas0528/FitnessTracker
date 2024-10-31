const apiUrl = "https://fitnesstracker-41f0.onrender.com";

// Section management
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// Page load setup
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (isLoggedIn) {
        showSection("dashboard");
        refreshWorkoutList();
    } else {
        showSection("login-section");
    }

    // Sidebar navigation handling
    document.querySelectorAll("aside nav ul li a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const sectionId = e.target.getAttribute("data-section");
            showSection(sectionId);
        });
    });
});

// Sign-up form submission
document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        alert("Signup successful! You can now log in.");
        showSection("login-section");
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

    const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const responseData = await response.json();
        alert("Login successful!");
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("token", responseData.access_token);
        await displayWorkouts(responseData.workouts); // Pass the workouts to a new function
        showSection("dashboard");
    } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error}`);
    }
});

// Function to display workouts
async function displayWorkouts(workouts) {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear previous workouts

    workouts.forEach((workout) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${workout.exercise_name} - ${workout.sets} sets of ${workout.reps} reps, ${workout.weight} lbs`;
        workoutList.appendChild(listItem);
    });

    // Update total workouts and weight
    document.getElementById("total-workouts").textContent = workouts.length;
    const totalWeight = workouts.reduce((total, workout) => total + (workout.weight * workout.sets * workout.reps), 0);
    document.getElementById("total-weight").textContent = `${totalWeight} lbs`;
}

// Add workout form submission
document.getElementById("workout-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const exercise_name = document.getElementById("exercise-name").value;
    const sets = document.getElementById("sets").value;
    const reps = document.getElementById("reps").value;
    const weight = document.getElementById("weight").value;

    const token = sessionStorage.getItem("token");
    const response = await fetch(`${apiUrl}/add-workout`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ exercise_name, sets, reps, weight })
    });

    if (response.ok) {
        const responseData = await response.json();
        alert("Workout added successfully!");
        await displayWorkouts(responseData.workout); // Optionally update the list
    } else {
        const errorData = await response.json();
        alert(`Failed to add workout: ${errorData.error}`);
    }
});

// Logout function
document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear(); // Clear session storage
    alert("Logged out successfully!");

    // Clear the workout list on logout
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear the displayed workouts
    document.getElementById("total-workouts").textContent = "0"; // Reset total workouts
    document.getElementById("total-weight").textContent = "0 lbs"; // Reset total weight

    showSection("login-section");
});

// Refresh workout list for dashboard
async function refreshWorkoutList() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${apiUrl}/get-workouts`, {
        method: "GET",
        headers: { 
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        const responseData = await response.json();
        await displayWorkouts(responseData.workouts);
    } else {
        alert("Failed to fetch workouts.");
    }
}
