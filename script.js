import { initModel, trainModel, predictNextWeight } from './ai-logic.js';

// Global variables
let workouts = [];
let nutritionData = [];
let model;

// API URL
const apiUrl = "https://fitnesstracker-41f0.onrender.com";

// Show selected section
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove("hidden");
    }
}

// Display workouts on the dashboard
async function displayWorkouts() {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = "";
    
    // Fetch workouts from Supabase
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching workouts:', error);
        return;
    }

    workouts = data;

    workouts.forEach((workout, index) => {
        const listItem = document.createElement("div");
        listItem.className = "workout-item card";
        listItem.innerHTML = `
            <h3 class="font-bold">${workout.exercise_name}</h3>
            <p>Sets: ${workout.sets}</p>
            <p>Reps: ${workout.reps}</p>
            <p>Weight: ${workout.weight} lbs</p>
            <p>Date: ${new Date(workout.date).toLocaleDateString()}</p>
            <button class="btn btn-danger mt-2" onclick="deleteWorkout(${workout.id})">Delete</button>
        `;
        workoutList.appendChild(listItem);
    });

    updateWorkoutSummary();
    updateWorkoutChart();
}

// Update workout summary
function updateWorkoutSummary() {
    const totalWorkouts = workouts.length;
    const totalWeight = workouts.reduce((sum, workout) => sum + workout.weight * workout.sets * workout.reps, 0);
    document.getElementById("total-workouts").textContent = totalWorkouts;
    document.getElementById("total-weight").textContent = totalWeight;
}

// Update workout chart
function updateWorkoutChart() {
    const ctx = document.getElementById("workoutProgressChart");
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: workouts.map(w => w.exercise_name),
                datasets: [{
                    label: 'Weight (lbs)',
                    data: workouts.map(w => w.weight),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',

