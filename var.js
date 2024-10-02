document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    let exerciseName = document.getElementById("exercise-name").value;
    let sets = document.getElementById("sets").value;
    let reps = document.getElementById("reps").value;
    let weight = document.getElementById("weight").value;
    console.log(`Exercise: ${exerciseName}, Sets: ${sets}, Reps: ${reps}, Weight: ${weight}`);
});
