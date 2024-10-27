const apiUrl = "https://fitnesstracker-41f0.onrender.com"; // Replace with your actual API URL

// Login functionality
document.getElementById("login-button").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById("login-message").innerText = data.message;
        document.getElementById("user-email").innerText = email;
        // Optionally navigate to a different section
        document.getElementById("add-workout-section").classList.remove("hidden");
    } else {
        document.getElementById("login-message").innerText = `Login failed: ${data.error}`;
    }
});

// Signup functionality
document.getElementById("signup-button").addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById("signup-message").innerText = response.ok ? data.message : `Signup failed: ${data.error}`;
});

// Add workout functionality
document.getElementById("add-workout-button").addEventListener("click", async () => {
    const exercise_name = document.getElementById("exercise-name").value;
    const sets = parseInt(document.getElementById("sets").value);
    const reps = parseInt(document.getElementById("reps").value);
    const weight = parseInt(document.getElementById("weight").value);
    const date = document.getElementById("date").value;

    const response = await fetch(`${apiUrl}/add-workout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercise_name, sets, reps, weight, date }),
        credentials: "include"
    });

    const data = await response.json();
    document.getElementById("add-workout-message").innerText = response.ok ? data.message : `Failed to add workout: ${data.error}`;
});

// Fetch user workouts
async function fetchUserWorkouts() {
    const response = await fetch(`${apiUrl}/user-workouts`, {
        method: "GET",
        credentials: "include" // Include credentials to send session cookies
    });

    if (response.ok) {
        const workouts = await response.json();
        const workoutList = document.getElementById("workout-list");
        workoutList.innerHTML = workouts.map(workout => `
            <li>${workout.exercise_name} - Sets: ${workout.sets}, Reps: ${workout.reps}, Weight: ${workout.weight}</li>
        `).join("");
    } else {
        alert("Failed to fetch workouts.");
    }
}

// Call this function when navigating to the profile section
document.getElementById("profile-section").addEventListener("click", fetchUserWorkouts);

// Logout functionality
document.getElementById("logout-button").addEventListener("click", async () => {
    const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include"
    });

    const data = await response.json();
    alert(data.message);
    // Optionally clear user email and hide sections
    document.getElementById("user-email").innerText = "";
    document.getElementById("add-workout-section").classList.add("hidden");
});
