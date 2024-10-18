document.addEventListener("DOMContentLoaded", () => {
    showSection('dashboard');

    // Dashboard
    document.querySelector('a[href="#dashboard"]').addEventListener('click', () => {
        showSection('dashboard');
    });

    // Add Workout
    document.querySelector('a[href="#add-workout"]').addEventListener('click', () => {
        showSection('add-workout-section');
    });

    // Leaderboard
    document.querySelector('a[href="#leaderboard"]').addEventListener('click', () => {
        showSection('leaderboard');
    });

    // Account
    document.querySelector('a[href="#account"]').addEventListener('click', () => {
        showSection('account');
    });
});

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}
