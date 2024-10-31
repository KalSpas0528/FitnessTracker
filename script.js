document.addEventListener("DOMContentLoaded", () => {
    // Show login section by default
    showSection("login-section");

    // Check if user is logged in (based on session storage)
    if (sessionStorage.getItem("loggedIn")) {
        showSection("add-workout"); // Direct to Add Workout if already logged in
        refreshWorkoutList(); // Refresh workout list to show existing workouts
        updateLoginStatus(true); // Update login status
    }

    // Event listener for sidebar links using event delegation
    document.getElementById("sidebar").addEventListener("click", function (event) {
        const target = event.target.closest("a"); // Check if a link was clicked
        if (target) {
            event.preventDefault(); // Prevent default anchor behavior
            const targetId = target.getAttribute("data-section"); // Get section ID
            showSection(targetId); // Show the selected section
            if (targetId === "dashboard") {
                refreshWorkoutList(); // Refresh workout list when viewing the dashboard
            }
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

            // Store login state in session storage
            sessionStorage.setItem("loggedIn", true);
            showSection("add-workout"); // Redirect to Add Workout section
            updateLoginStatus(true); // Update login status
        } else {
            const errorData = await response.json();
            alert(`Login failed: ${errorData.error}`);
        }
    });

    // Signup form submission
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
            alert("Signup successful!");
            showSection("login-section"); // Return to login after successful signup
        } else {
            const errorData = await response.json();
            alert(`Signup failed: ${errorData.error}`);
        }
    });

    // Workout form submission
    document.getElementById("workout-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const exercise_name = document.getElementById("exercise-name").value;
        const sets = document.getElementById("sets").value;
        const reps = document.getElementById("reps").value;
        const weight = document.getElementById("weight").value;

        const response = await fetch("https://fitnesstracker-41f0.onrender.com/add-workout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Ensure credentials are included
            body: JSON.stringify({ exercise_name, sets, reps, weight, date: new Date().toISOString() })
        });

        if (response.ok) {
            alert("Workout added!");
            await refreshWorkoutList(); // Refresh workout list after adding a workout
            showSection("dashboard"); // Optionally, redirect to the dashboard after adding workout
        } else {
            const errorData = await response.json();
            alert(`Failed to add workout: ${errorData.error}`);
        }
    });

    // Logout functionality
    document.getElementById("logout-button").addEventListener("click", async () => {
        const response = await fetch("https://fitnesstracker-41f0.onrender.com/logout", { method: "POST" });
        if (response.ok) {
            alert("Logged out!");
            sessionStorage.removeItem("loggedIn"); // Clear login state
            showSection("login-section"); // Return to login after logout
            updateLoginStatus(false); // Update login status
        } else {
            alert("Logout failed.");
        }
    });
});

// Function to update login status display
function updateLoginStatus(isLoggedIn) {
    const loginStatusDiv = document.getElementById("login-status");
    if (isLoggedIn) {
        loginStatusDiv.textContent = "You are logged in.";
        loginStatusDiv.classList.remove("hidden");
    } else {
        loginStatusDiv.textContent = "You are logged out.";
        loginStatusDiv.classList.remove("hidden");
    }
}

// Function to display workouts in the dashboard
async function refreshWorkoutList() {
    const workoutsResponse = await fetch("https://fitnesstracker-41f0.onrender.com/get-workouts", {
        method: "GET",
        credentials: "include" // Include credentials to maintain session
    });

    const workoutsData = await workoutsResponse.json();
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear previous workouts

    if (workoutsResponse.ok) {
        workoutsData.workouts.forEach(workout => {
            const workoutItem = document.createElement("li");
            workoutItem.textContent = `${workout.exercise_name} - ${workout.sets} sets, ${workout.reps} reps, ${workout.weight} lbs`;
            workoutList.appendChild(workoutItem);
        });
    } else {
        alert(`Failed to load workouts: ${workoutsData.error}`);
    }
}

// Function to switch between different sections
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        section.style.display = "none"; // Hide all sections
    });
    document.getElementById(sectionId).style.display = "block"; // Show the targeted section
}
