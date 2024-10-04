document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    let exerciseName = document.getElementById("exercise-name").value;
    let sets = document.getElementById("sets").value;
    let reps = document.getElementById("reps").value;
    let weight = document.getElementById("weight").value;
    let workoutDate = document.getElementById("workout-date").value; 
    console.log(`Exercise: ${exerciseName}, Sets: ${sets}, Reps: ${reps}, Weight: ${weight}`);

let workoutList = document.getElementById("workout-list");
let newWorkout = document.createElement("li");
newWorkout.textContent = `Exercise: ${exerciseName}, Sets: ${sets}, Reps: ${reps}, Weight: ${weight} lbs`;
workoutList.appendChild(newWorkout);
document.querySelector("form").reset();
});
