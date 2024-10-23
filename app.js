/*
// Initialize Supabase client
const { createClient } = supabase;
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd3NmbmRibmxwZXFhem56dHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MzczMjUsImV4cCI6MjA0NTExMzMyNX0.MvEiRJ-L9qpuQ7ma4PCBNbWYdQk6wInwnqvCCHvyuLE'; // Replace with your Supabase Anon key
const supabase = createClient(supabaseUrl, supabaseKey);

let workouts = [];

// Function to show the right section and hide others
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidwwwwwwwwwwwwwwwwwwwwwwen');
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

    // Handle form submission for sign-up
    const signUpForm = document.getElementById("sign-up-form");
    signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = signUpForm.email.value;
        const password = signUpForm.password.value;

        const { user, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            alert(error.message);
        } else {
            alert('Sign-up successful! Please check your email for confirmation.');
            showSection('log-in'); // Show log-in section after sign-up
        }
    });

    // Handle form submission for log-in
    const logInForm = document.getElementById("log-in-form");
    logInForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = logInForm.email.value;
        const password = logInForm.password.value;

        const { user, error } = await supabase.auth.signIn({ email, password });
        if (error) {
            alert(error.message);
        } else {
            alert('Log-in successful!');
            showSection('dashboard'); // Show dashboard after log-in
            loadWorkouts(); // Load workouts after login
        }
    });

    // Handle logout
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert(error.message);
        } else {
            alert('Logged out successfully!');
            showSection('log-in'); // Show log-in section after logout
        }
    });

    // Handle form submission for adding workouts
    const addWorkoutForm = document.getElementById("add-workout-form");
    addWorkoutForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from submitting to a server

        let workout = {
            date: document.getElementById("workout-date").value,
            exercise: document.getElementById("exercise-name").value,
            sets: document.getElementById("sets").value,
            reps: document.getElementById("reps").value,
            weight: document.getElementById("weight").value
        };

        // Validate the form input
        if (!workout.exercise || workout.sets <= 0 || workout.reps <= 0 || workout.weight <= 0 || !workout.date) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Add the workout to the list
        workouts.push(workout);
        document.getElementById("workout-list").innerHTML += 
            `<li>Date: ${workout.date}, Exercise: ${workout.exercise}, Sets: ${workout.sets}, Reps: ${workout.reps}, Weight: ${workout.weight} lbs
             <button onclick="this.parentElement.remove()">Delete</button></li>`;

        // Reset the form
        addWorkoutForm.reset();
        updateWorkoutStats(); // Update stats after adding a workout
    });
});

// Load workouts from Supabase and display them
async function loadWorkouts() {
    const { data: workoutsData, error } = await supabase.from('workouts').select('*');
    if (error) {
        console.error(error);
    } else {
        workouts = workoutsData; // Store fetched workouts
        displayWorkouts(); // Display them
        updateWorkoutStats(); // Update stats based on loaded workouts
    }
}

// Function to display workouts
function displayWorkouts() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ''; // Clear existing list
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
        displayWorkouts(); // Update displayed workouts
        updateWorkoutStats(); // Update stats after deletion
    }
}

// Function to update workout stats
function updateWorkoutStats() {
    const totalWorkoutsElement = document.getElementById("total-workouts");
    const totalWeightLiftedElement = document.getElementById("total-weight-lifted");

    totalWorkoutsElement.innerText = workouts.length;
    const totalWeightLifted = workouts.reduce((sum, workout) => sum + workout.weight * workout.sets * workout.reps, 0);
    totalWeightLiftedElement.innerText = `${totalWeightLifted} lbs`;
}
*/