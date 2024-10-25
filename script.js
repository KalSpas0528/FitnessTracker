document.addEventListener("DOMContentLoaded", () => {
    // Toggle sections
    function showSection(section) {
        document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
        document.getElementById(section).classList.remove("hidden");
    }

    // Login form submission
    document.getElementById("login-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Include credentials for session management
        });
        
        if (response.ok) {
            alert("Login successful!");
            showSection("dashboard");
        } else {
            const result = await response.json();
            alert("Login failed: " + result.error);
        }
    });

    // Signup form submission
    document.getElementById("signup-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            alert("Signup successful!");
            showSection("login-section");
        } else {
            const result = await response.json();
            alert("Signup failed: " + result.error);
        }
    });

    // Workout form submission
    document.getElementById("workout-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const exercise_name = document.getElementById("exercise-name").value;
        const sets = document.getElementById("sets").value;
        const reps = document.getElementById("reps").value;
        const weight = document.getElementById("weight").value;

        const response = await fetch("/add-workout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exercise_name, sets, reps, weight, date: new Date().toISOString() }),
            credentials: 'include' // Include credentials for session management
        });

        if (response.ok) {
            alert("Workout added!");
            // Optionally reset the form
            document.getElementById("workout-form").reset();
        } else {
            const result = await response.json();
            alert("Failed to add workout: " + result.error);
        }
    });

    // Logout
    document.getElementById("logout-button").addEventListener("click", async () => {
        await fetch("/logout", { method: "POST", credentials: 'include' });
        alert("Logged out!");
        showSection("login-section");
    });
});
