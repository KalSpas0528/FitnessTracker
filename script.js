document.addEventListener("DOMContentLoaded", () => {
    // Show login section by default
    showSection("login-section");

    // Event listener for sidebar links using event delegation
    document.getElementById("sidebar").addEventListener("click", function (event) {
        const target = event.target.closest("a"); // Check if a link was clicked
        if (target) {
            event.preventDefault(); // Prevent default anchor behavior
            const targetId = target.getAttribute("href").substring(1); // Get section ID
            showSection(targetId); // Show the selected section
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

            // Show the dashboard and display previous workouts
            showSection("dashboard");
            displayWorkouts(responseData.workouts); // Call to display previous workouts
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
            body: JSON.stringify({ exercise_name, sets, reps, weight, date: new Date().toISOString() })
        });

        if (response.ok) {
            alert("Workout added!");
            await refreshWorkoutList(); // Refresh workout list after adding a workout
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
            showSection("login-section"); // Return to login after logout
        } else {
            alert("Logout failed.");
        }
    });
});

// Function to display workouts in the dashboard
async function refreshWorkoutList() {
    const workoutsResponse = await fetch("https://fitnesstracker-41f0.onrender.com/get-workouts", {
        method: "GET",
        credentials: "include" // Include credentials to maintain session
    });

    const workoutsData = await workoutsResponse.json();
    displayWorkouts(workoutsData.workouts); // Update workout list
}

// Function to display workouts
function displayWorkouts(workouts) {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear previous list

    workouts.forEach(workout => {
        workoutList.innerHTML += 
            `<li>Date: ${new Date(workout.date).toLocaleDateString()}, Exercise: ${workout.exercise_name}, Sets: ${workout.sets}, Reps: ${workout.reps}, Weight: ${workout.weight} lbs
            <button onclick="deleteWorkout(${workout.id}, this)">Delete</button></li>`;
    });
}

// Function to delete workout
async function deleteWorkout(workoutId, button) {
    const response = await fetch(`https://fitnesstracker-41f0.onrender.com/delete-workout/${workoutId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        alert("Workout deleted!");
        button.parentElement.remove(); // Remove the workout from the list
    } else {
        alert("Failed to delete workout.");
    }
}

// Function to show the selected section and hide others
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}
