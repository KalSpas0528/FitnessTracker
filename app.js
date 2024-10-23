import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.getElementById("sign-up-form");
    const logInForm = document.getElementById("log-in-form");
    const addWorkoutForm = document.getElementById("add-workout-form");

    signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("sign-up-email").value;
        const password = document.getElementById("sign-up-password").value;
        await signUp(email, password);
    });

    logInForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("log-in-email").value;
        const password = document.getElementById("log-in-password").value;
        await logIn(email, password);
    });

    addWorkoutForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const workoutName = document.getElementById("workout-name").value;
        const duration = document.getElementById("duration").value;
        await addWorkout(workoutName, duration);
    });
});

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        displayError(error.message);
    } else {
        alert("Sign up successful!");
        showSection('log-in-section');
    }
}

async function logIn(email, password) {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        displayError(error.message);
    } else {
        currentUser = session.user;
        alert("Log in successful!");
        toggleSectionVisibility();
        getWorkouts(currentUser.id);
    }
}

async function logOut() {
    await supabase.auth.signOut();
    currentUser = null;
    alert("Logged out!");
    showSection('log-in-section');
}

async function addWorkout(workoutName, duration) {
    const { data, error } = await supabase.from('workouts').insert([{ user_id: currentUser.id, workout_name: workoutName, duration: duration }]);
    if (error) {
        displayError(error.message);
    } else {
        alert("Workout added!");
        getWorkouts(currentUser.id);
    }
}

async function getWorkouts(userId) {
    const { data: workouts, error } = await supabase.from('workouts').select('*').eq('user_id', userId);
    if (error) {
        displayError(error.message);
    } else {
        const workoutList = document.getElementById("workout-list");
        workoutList.innerHTML = '';
        workouts.forEach(workout => {
            const listItem = document.createElement('li');
            listItem.textContent = `${workout.workout_name} - ${workout.duration} minutes`;
            workoutList.appendChild(listItem);
        });
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function toggleSectionVisibility() {
    showSection('add-workout-section');
    showSection('view-workouts-section');
}

function displayError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    setTimeout(() => {
        errorMessage.classList.add("hidden");
    }, 3000);
}