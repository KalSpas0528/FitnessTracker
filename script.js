document.addEventListener("DOMContentLoaded", () => {
    // Show dashboard section by default
    showSection("login-section");

    // Sidebar link event listeners
    document.querySelectorAll("#sidebar nav ul li a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const target = this.getAttribute("href").substring(1);
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
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            alert("Login successful!");
            showSection("dashboard");
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
        } else {
            const errorData = await response.json();
            alert(`Failed to add workout: ${errorData.error}`);
        }
    });

    // Logout functionality
    document.getElementById("logout-button").addEventListener("click", async () => {
        await fetch("https://fitnesstracker-41f0.onrender.com/logout", { method: "POST" });
        alert("Logged out!");
        showSection("login-section");
    });
});

// Function to show the selected section and hide others
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}
