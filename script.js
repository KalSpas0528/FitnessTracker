const apiUrl = "https://fitnesstracker-41f0.onrender.com";
let workouts = []; // Store workouts in memory
const exampleWorkouts = [
    { exercise_name: "Lat Pulldowns", sets: 3, reps: 10, weight: 75 },
    { exercise_name: "Hammer Curls", sets: 3, reps: 12, weight: 25 }
];

// Section management
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// Display workouts in the dashboard
function displayWorkouts() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear current list

    workouts.forEach((workout, index) => {
        const listItem = document.createElement("div");
        listItem.className = "workout-item"; // Styled in CSS

        listItem.innerHTML = `
            <table>
                <tr><td>Exercise</td><td>${workout.exercise_name}</td></tr>
                <tr><td>Sets</td><td>${workout.sets}</td></tr>
                <tr><td>Reps</td><td>${workout.reps}</td></tr>
                <tr><td>Weight</td><td>${workout.weight} lbs</td></tr>
            </table>
            <button class="delete-button" onclick="deleteWorkout(${index})">Delete</button>
        `;

        workoutList.appendChild(listItem);
    });

    document.getElementById("total-workouts").textContent = workouts.length;
    const totalWeight = workouts.reduce((sum, workout) => sum + workout.weight * workout.sets, 0);
    document.getElementById("total-weight").textContent = `${totalWeight} lbs`;
}

// Clear workouts and display login section on logout
document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("token");
    workouts = []; // Clear workouts on logout
    displayWorkouts(); // Refresh the workout list on dashboard
    showSection("login-section");
    alert("Logged out successfully!");
});

// Login form submission with specific email check
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

        // Load example workouts only if the email matches
        workouts = email === "kaloyan.spasov@vhhscougars.org" ? [...exampleWorkouts] : responseData.workouts;
        showSection("dashboard");
        displayWorkouts(); // Refresh the workout list upon login
    } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error}`);
    }
});

// Add workout form submission
document.getElementById("workout-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const exercise_name = document.getElementById("exercise-name").value;
    const sets = parseInt(document.getElementById("sets").value);
    const reps = parseInt(document.getElementById("reps").value);
    const weight = parseInt(document.getElementById("weight").value);

    workouts.push({ exercise_name, sets, reps, weight });
    alert("Workout added!");
    displayWorkouts(); // Refresh the workout list
    showSection("dashboard");
});

// Delete workout function
function deleteWorkout(index) {
    workouts.splice(index, 1); // Remove the workout from the array
    displayWorkouts(); // Refresh the display after deletion
}
