const apiUrl = "https://fitnesstracker-41f0.onrender.com"; // Your actual API URL

// Section management
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// Clear workout list function
function clearWorkoutList() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear the displayed workouts
    document.getElementById("total-workouts").textContent = "0"; // Reset total workouts
    document.getElementById("total-weight").textContent = "0 lbs"; // Reset total weight
}

// Refresh workout list function
async function refreshWorkoutList() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${apiUrl}/get-workouts`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (response.ok) {
        const { workouts } = await response.json();
        const workoutList = document.getElementById("workout-list");
        clearWorkoutList(); // Clear previous workouts

        workouts.forEach(workout => {
            const workoutItem = document.createElement("li");
            workoutItem.textContent = `${workout.exercise_name} - ${workout.sets} sets, ${workout.reps} reps, ${workout.weight} lbs`;
            workoutList.appendChild(workoutItem);
        });

        document.getElementById("total-workouts").textContent = workouts.length.toString();
        const totalWeight = workouts.reduce((sum, workout) => sum + workout.weight, 0);
        document.getElementById("total-weight").textContent = `${totalWeight} lbs`;
    } else {
        const errorData = await response.json();
        alert(`Failed to fetch workouts: ${errorData.error}`);
    }
}

// Page load setup
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (isLoggedIn) {
        showSection("dashboard");
        refreshWorkoutList(); // Fetch and display workouts if logged in
        document.getElementById("add-workout").style.display = 'block'; // Show Add Workout button
    } else {
        showSection("login-section");
        document.getElementById("add-workout").style.display = 'none'; // Hide Add Workout button
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

        // Clear previous workouts before displaying new ones
        clearWorkoutList(); // Clear any existing workouts
        await refreshWorkoutList(); // Fetch and display the logged-in user's workouts
        showSection("dashboard");
        document.getElementById("add-workout").style.display = 'block'; // Show Add Workout button
    } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error}`);
    }
});

// Add workout form submission
document.getElementById("add-workout-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const exerciseName = document.getElementById("exercise-name").value;
    const sets = document.getElementById("sets").value;
    const reps = document.getElementById("reps").value;
    const weight = document.getElementById("weight").value;
    const date = document.getElementById("date").value;

    const token = sessionStorage.getItem("token");
    const response = await fetch(`${apiUrl}/add-workout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ exercise_name: exerciseName, sets, reps, weight, date })
    });

    if (response.ok) {
        alert("Workout added successfully!");
        clearWorkoutList(); // Clear and refresh workout list after adding
        await refreshWorkoutList();
    } else {
        const errorData = await response.json();
        alert(`Failed to add workout: ${errorData.error}`);
    }
});

// Logout function
document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear(); // Clear session storage
    alert("Logged out successfully!");

    clearWorkoutList(); // Clear the displayed workouts on logout
    document.getElementById("add-workout").style.display = 'none'; // Hide Add Workout button

    showSection("login-section");
});
