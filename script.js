const apiUrl = "https://fitnesstracker-41f0.onrender.com";
let workouts = [];
const exampleWorkouts = [
    { exercise_name: "Lat Pulldowns", sets: 3, reps: 10, weight: 75 },
    { exercise_name: "Hammer Curls", sets: 3, reps: 12, weight: 25 }
];

function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

function displayWorkouts() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = "";
    workouts.forEach((workout, index) => {
        const listItem = document.createElement("div");
        listItem.className = "workout-item";
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

document.getElementById("logout-button").addEventListener("click", () => {
    sessionStorage.clear();
    workouts = [];
    displayWorkouts();
    showSection("login-section");
    alert("Logged out successfully!");
});

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
        workouts = email === "kaloyan.spasov@vhhscougars.org" ? [...exampleWorkouts] : responseData.workouts;
        showSection("dashboard");
        displayWorkouts();
    } else {
        alert(`Login failed: ${await response.json().error}`);
    }
});

document.getElementById("workout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const exercise_name = document.getElementById("exercise-name").value;
    const sets = +document.getElementById("sets").value;
    const reps = +document.getElementById("reps").value;
    const weight = +document.getElementById("weight").value;
    workouts.push({ exercise_name, sets, reps, weight });
    alert("Workout added!");
    displayWorkouts();
    showSection("dashboard");
});

function deleteWorkout(index) {
    workouts.splice(index, 1);
    displayWorkouts();
}
