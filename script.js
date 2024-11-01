const apiUrl = "https://fitnesstracker-41f0.onrender.com"; // Update with your actual API URL

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

// Page load setup
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (isLoggedIn) {
        showSection("dashboard");
        refreshWorkoutList(); // This will fetch and display workouts if logged in
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

        // Clear previous workouts before displaying new ones
        clearWorkoutList(); // Clear any existing workouts
        await refreshWorkoutList(); // Fetch and display the logged-in user's workouts
        showSection("dashboard");
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
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${apiUrl}/add-workout`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
            exercise_name, 
            sets, 
            reps, 
            weight, 
            date: new Date().toISOString() 
        })
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

// Refresh workout list for dashboard
async function refreshWorkoutList() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${apiUrl}/get-workouts`, {
        method: "GET",
        headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
    });

    if (response.ok) {
        const responseData = await response.json();
        await displayWorkouts(responseData.workouts);
    } else {
        alert("Failed to fetch workouts.");
    }
}

// Function to display workouts on the dashboard
async function displayWorkouts(workouts) {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear existing list

    workouts.forEach((workout) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${workout.exercise_name} - ${workout.sets} sets of ${workout.reps} reps, ${workout.weight} lbs`;

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", async () => {
            const response = await fetch(`${apiUrl}/delete-workout/${workout.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                alert("Workout deleted successfully!");
                await refreshWorkoutList(); // Refresh the list after deletion
            } else {
                alert("Failed to delete workout.");
            }
        });

        // Append delete button to list item
        listItem.appendChild(deleteButton);
        workoutList.appendChild(listItem);
    });

    // Update total workouts and total weight lifted
    document.getElementById("total-workouts").textContent = workouts.length;
    const totalWeight = workouts.reduce((total, workout) => total + workout.weight, 0);
    document.getElementById("total-weight").textContent = `${totalWeight} lbs`;
}

// Logout function
document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear(); // Clear session storage
    alert("Logged out successfully!");

    clearWorkoutList(); // Clear the displayed workouts on logout

    showSection("login-section");
});
