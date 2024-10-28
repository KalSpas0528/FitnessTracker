// File: script.js

function updateStatusIndicator(isLoggedIn) {
    const statusIndicator = document.getElementById("status-indicator");
    statusIndicator.textContent = isLoggedIn ? "Logged in" : "Not logged in";
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
    document.getElementById(sectionId).classList.add("active");
    
    // Highlight the active link in the sidebar
    const links = document.querySelectorAll("#sidebar nav ul li a");
    links.forEach(link => {
        link.classList.remove("active");
    });
    document.querySelector(`#sidebar nav ul li a[href="#${sectionId}"]`).classList.add("active");
}

// Show the dashboard by default
showSection("dashboard");

document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
        updateStatusIndicator(true);
        showSection("add-workout-section"); // Show workout section upon successful login
    } else {
        alert(`Failed to login: ${result.message}`);
    }
});

document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
        showSection("login-section");
    } else {
        alert(`Failed to sign up: ${result.message}`);
    }
});

document.getElementById("workout-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("workout-name").value;
    const sets = document.getElementById("workout-sets").value;
    const reps = document.getElementById("workout-reps").value;
    const weight = document.getElementById("workout-weight").value;

    const response = await fetch("/add-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sets, reps, weight }),
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
    } else {
        alert(`Failed to add workout: ${result.message}`);
    }
});
