let workouts = [];

document.addEventListener("DOMContentLoaded", () => {
    showSection('dashboard'); // Show dashboard by default

    // Attach event listeners for sidebar links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            const target = this.getAttribute('href').substring(1); // Get target section ID
            showSection(target); // Show the corresponding section
        });
    });

    // Handle form submission for adding workouts
    const form = document.querySelector('#add-workout-form');
    form.addEventListener("submit", (event) => {
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
        form.reset();
    });
});

// Function to show the right section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');
}
