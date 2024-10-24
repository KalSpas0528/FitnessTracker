// Initialize Supabase client
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd3NmbmRibmxwZXFhem56dHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MzczMjUsImV4cCI6MjA0NTExMzMyNX0.MvEiRJ-L9qpuQ7ma4PCBNbWYdQk6wInwnqvCCHvyuLE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let workouts = [];

// Function to show the right section and hide others
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", () => {
    showSection('dashboard'); // Show dashboard by default

    // Attach event listeners for sidebar links
    document.querySelectorAll('#sidebar nav ul li a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);
        });
    });

    // Load workouts and leaderboard on dashboard load
    loadWorkouts();
    loadLeaderboard();

    // Handle form submission for adding workouts
    const addWorkoutForm = document.getElementById("add-workout-form");
    addWorkoutForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        let workout = {
            date: document.getElementById("workout-date").value,
            exercise_name: document.getElementById("exercise-name").value,
            sets: document.getElementById("sets").value,
            reps: document.getElementById("reps").value,
            weight: document.getElementById("weight").value
        };

        if (!workout.exercise_name || workout.sets <= 0 || workout.reps <= 0 || workout.weight <= 0 || !workout.date) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const { error } = await supabase.from('workouts').insert([workout]);
        if (error) {
            console.error(error.message);
        } else {
            alert("Workout added successfully!");
            loadWorkouts();
            addWorkoutForm.reset();
        }
    });
});

// Load workouts from Supabase and display them
async function loadWorkouts() {
    const { data: workoutsData, error } = await supabase.from('workouts').select('*');
    if (error) {
        console.error(error);
    } else {
        workouts = workoutsData;
        displayWorkouts();
        updateWorkoutStats();
    }
}

// Function to display workouts
function displayWorkouts() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ''; 
    workouts.forEach(workout => {
        workoutList.innerHTML += 
            `<li>Date: ${new Date(workout.date).toLocaleDateString()}, Exercise: ${workout.exercise_name}, Sets: ${workout.sets}, Reps: ${workout.reps}, Weight: ${workout.weight} lbs
             <button onclick="deleteWorkout(${workout.id})">Delete</button></li>`;
    });
}

// Function to delete a workout
async function deleteWorkout(id) {
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) {
        console.error(error);
    } else {
        workouts = workouts.filter(workout => workout.id !== id);
        displayWorkouts();
        updateWorkoutStats();
    }
}

// Function to update workout stats
function updateWorkoutStats() {
    const totalWorkoutsElement = document.getElementById("total-workouts");
    const totalWeightLiftedElement = document.getElementById("total-weight");

    totalWorkoutsElement.innerText = workouts.length;
    const totalWeightLifted = workouts.reduce((sum, workout) => sum + workout.weight * workout.sets * workout.reps, 0);
    totalWeightLiftedElement.innerText = `${totalWeightLifted} lbs`;
}

// Load leaderboard data (dummy for now)
async function loadLeaderboard() {
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = `
        <tr>
            <td>1</td>
            <td>User123</td>
            <td>25</td>
            <td>2500 lbs</td>
        </tr>
    `;
}
