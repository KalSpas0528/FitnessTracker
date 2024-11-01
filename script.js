// script.js

async function fetchWorkouts() {
    const response = await fetch('/get-workouts', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        console.error('Failed to fetch workouts:', response.statusText);
        return [];
    }

    const data = await response.json();
    return data.workouts;
}

async function deleteWorkout(id) {
    const response = await fetch(`/delete-workout/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        // Re-fetch workouts after deletion
        const workouts = await fetchWorkouts();
        displayWorkouts(workouts);
    } else {
        console.error('Failed to delete workout:', response.statusText);
    }
}

function displayWorkouts(workouts) {
    const workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = ""; // Clear previous workouts

    workouts.forEach(workout => {
        const listItem = document.createElement("div");
        listItem.classList.add("workout-item");
        listItem.innerHTML = `
            <h4>${workout.exercise_name}</h4>
            <p>${workout.sets} sets x ${workout.reps} reps @ ${workout.weight} lbs</p>
            <button class="delete-button" data-id="${workout.id}">Delete</button>
        `;
        workoutList.appendChild(listItem);
    });

    // Attach event listener for delete buttons
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const workoutId = event.target.dataset.id;
            await deleteWorkout(workoutId);
        });
    });
}

// Initial load
(async () => {
    const workouts = await fetchWorkouts();
    displayWorkouts(workouts);
})();
