// Function to log in the user
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("https://fitnesstracker-41f0.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: "include" // Include credentials to maintain session
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        // Show the dashboard
        document.getElementById("dashboard").classList.remove("hidden");
    } else {
        alert(`Login failed: ${data.error}`);
    }
}

// Function to add a workout
async function addWorkout(event) {
    event.preventDefault();

    const exercise_name = document.getElementById("exercise-name").value;
    const sets = document.getElementById("sets").value;
    const reps = document.getElementById("reps").value;
    const weight = document.getElementById("weight").value;
    const date = new Date().toISOString(); // Set current date/time

    const response = await fetch("https://fitnesstracker-41f0.onrender.com/add-workout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ exercise_name, sets, reps, weight, date }),
        credentials: "include" // Include credentials to maintain session
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        // Clear the form after submission
        document.getElementById("workout-form").reset();
    } else {
        alert(`Failed to add workout: ${data.error}`);
    }
}

// Add this function to fetch and display workouts
async function fetchWorkouts() {
    const response = await fetch("https://fitnesstracker-41f0.onrender.com/workouts", {
        method: "GET",
        credentials: "include" // Include credentials to maintain session
    });

    if (response.ok) {
        const { workouts } = await response.json();
        displayWorkouts(workouts);
    } else {
        const errorData = await response.json();
        alert(`Failed to fetch workouts: ${errorData.error}`);
    }
}

// Function to display workouts on the dashboard
function displayWorkouts(workouts) {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear the list before adding new items

    workouts.forEach(workout => {
        const listItem = document.createElement("li");
        listItem.textContent = `${workout.exercise_name}: ${workout.sets} sets of ${workout.reps} reps at ${workout.weight} lbs on ${new Date(workout.date).toLocaleDateString()}`;
        workoutList.appendChild(listItem);
    });
}

// Call fetchWorkouts when the dashboard is shown
document.getElementById("dashboard").addEventListener("show", fetchWorkouts);

// Add event listeners
document.getElementById("workout-form").addEventListener("submit", addWorkout);
document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    login();
});
