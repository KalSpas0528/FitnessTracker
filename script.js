document.addEventListener("DOMContentLoaded", () => {
    // Show login section by default
    showSection("login-section");

    // Sidebar link event listeners
    document.querySelectorAll("#sidebar nav ul li [data-section]").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const target = this.getAttribute("data-section");
            showSection(target);
        });
    });

    // Login form submission
    document.getElementById("login-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const response = await fetch("https://fitnesstracker-41f0.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        });

        if (response.ok) {
            const { workouts } = await response.json();
            alert("Login successful!");
            showSection("dashboard");
            displayWorkouts(workouts);
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
            showSection("login-section");
        } else {
            const errorData = await response.json();
            alert(`Signup failed: ${errorData.error}`);
        }
    });

    // Add workout form submission
    document.getElementById("workout-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const workoutData = {
            exercise_name: document.getElementById("exercise-name").value,
            sets: parseInt(document.getElementById("sets").value),
            reps: parseInt(document.getElementById("reps").value),
            weight: parseFloat(document.getElementById("weight").value),
            date: new Date().toISOString()
        };

        const response = await fetch("https://fitnesstracker-41f0.onrender.com/add-workout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workoutData),
            credentials: "include"
        });

        if (response.ok) {
            alert("Workout added!");
            await refreshWorkoutList();
        } else {
            const errorData = await response.json();
            alert(`Failed to add workout: ${errorData.error}`);
        }
    });

    // Logout button
    document.getElementById("logout-button").addEventListener("click", async () => {
        const response = await fetch("https://fitnesstracker-41f0.onrender.com/logout", {
            method: "POST",
            credentials: "include"
        });
        if (response.ok) {
            alert("Logged out!");
            showSection("login-section");
        } else {
            alert("Logout failed.");
        }
    });

    // Refresh and display workouts
    async function refreshWorkoutList() {
        const workoutsResponse = await fetch("https://fitnesstracker-41f0.onrender.com/get-workouts", {
            method: "GET",
            credentials: "include"
        });
        const { workouts } = await workoutsResponse.json();
        displayWorkouts(workouts);
    }

    // Show only the targeted section
    function showSection(sectionId) {
        document.querySelectorAll(".section").forEach(section => section.classList.add("hidden"));
        document.getElementById(sectionId).classList.remove("hidden");
    }

    // Populate workouts in DOM
    function displayWorkouts(workouts) {
        const workoutList = document.getElementById("workout-list");
        workoutList.innerHTML = "";
        let totalWeight = 0;

        workouts.forEach(({ id, exercise_name, sets, reps, weight, date }) => {
            totalWeight += weight * sets * reps;
            workoutList.innerHTML += `
                <li>Date: ${new Date(date).toLocaleDateString()}, Exercise: ${exercise_name}, Sets: ${sets}, Reps: ${reps}, Weight: ${weight} lbs
                <button onclick="deleteWorkout(${id})">Delete</button></li>`;
        });

        document.getElementById("total-workouts").innerText = workouts.length;
        document.getElementById("total-weight").innerText = `${totalWeight} lbs`;
    }

    // Function to delete a workout
    window.deleteWorkout = async function(workoutId) {
        const response = await fetch(`https://fitnesstracker-41f0.onrender.com/delete-workout/${workoutId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (response.ok) {
            alert("Workout deleted!");
            await refreshWorkoutList();
        } else {
            alert("Failed to delete workout.");
        }
    };
});
