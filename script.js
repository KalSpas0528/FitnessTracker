// File: script.js

function updateStatusIndicator(isLoggedIn) {
    const statusIndicator = document.getElementById("status-indicator");
    statusIndicator.textContent = isLoggedIn ? "Logged in" : "Not logged in";
}

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
        showSection("dashboard");
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

document.getElementById("logout-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const response = await fetch("/logout", { method: "POST" });
    if (response.ok) {
        updateStatusIndicator(false);
        showSection("login-section");
    } else {
        alert("Failed to logout");
    }
});

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}
