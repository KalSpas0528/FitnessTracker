let workouts = [];

document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    let workout = {
        date: document.getElementById("workout-date").value,
        exercise: document.getElementById("exercise-name").value,
        sets: document.getElementById("sets").value,
        reps: document.getElementById("reps").value,
        weight: document.getElementById("weight").value
    };
    if (!workout.exercise || workout.sets <= 0 || workout.reps <= 0 || workout.weight <= 0 || !workout.date) {
        alert("Please fill in all fields correctly.");
        return;
    }
    workouts.push(workout);
    document.getElementById("workout-list").innerHTML += 
        `<li>Date: ${workout.date}, Exercise: ${workout.exercise}, Sets: ${workout.sets}, Reps: ${workout.reps}, Weight: ${workout.weight} lbs
         <button onclick="this.parentElement.remove()">Delete</button></li>`;

    document.querySelector("form").reset();
});
document.querySelector('a[href="#add-workout"]').addEventListener('click', function() {
    document.getElementById('add-workout-section').classList.toggle('hidden');
});