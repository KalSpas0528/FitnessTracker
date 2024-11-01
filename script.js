const apiUrl = "https://fitnesstracker-41f0.onrender.com"; // Your actual API URL

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
        refreshWorkoutList(); // Fetch and display workouts if logged in
        document.getElementById("add-workout-link").style.display = 'block'; // Show Add Workout link
    } else {
        showSection("login-section");
        document.getElementById("add-workout-link").style.display = 'none'; // Hide Add Workout link
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

        showSection("dashboard");
        refreshWorkoutList();
        document.getElementById("add-workout-link").style.display = 'block'; // Show Add Workout link
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

    const response = await fetch(`${apiUrl}/add-workout`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
            // Authorization header is optional; remove if anyone can add workouts
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

// Fetch and display workouts
async function refreshWorkoutList() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${apiUrl}/get-workouts`, {
        method: "GET",
        headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
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
document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("token");
    showSection("login-section");
    alert("Logged out successfully!");
    document.getElementById("add-workout-link").style.display = 'none'; // Hide Add Workout link on logout
});
