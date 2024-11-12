// Check if the user is logged in (example check using localStorage or sessionStorage)
const userIsLoggedIn = localStorage.getItem('user') !== null;

// Store user data
const userData = {
  workouts: JSON.parse(localStorage.getItem('workouts')) || [],
  nutrition: JSON.parse(localStorage.getItem('nutrition')) || [],
};

// Function to generate workout recommendations based on logged workouts
function getWorkoutRecommendations() {
  const recommendedWorkouts = [];
  
  // Example logic: If a user has logged squats often, suggest leg day exercises
  if (userData.workouts.some(workout => workout.name.toLowerCase().includes('squat'))) {
    recommendedWorkouts.push('Try adding lunges to your leg day!');
    recommendedWorkouts.push('Consider deadlifts to strengthen your lower back!');
  }
  
  // If the user hasn't logged cardio, suggest it
  if (!userData.workouts.some(workout => workout.name.toLowerCase().includes('run'))) {
    recommendedWorkouts.push('How about adding a 20-minute cardio session to your week?');
  }

  return recommendedWorkouts.length > 0 ? recommendedWorkouts : ['Great job! Keep logging your workouts.'];
}

// Function to generate nutrition recommendations based on logged nutrition
function getNutritionRecommendations() {
  const recommendedNutrition = [];

  // Example logic: If the user has logged high protein meals, suggest balanced meals
  if (userData.nutrition.some(food => food.type.toLowerCase().includes('protein'))) {
    recommendedNutrition.push('Balance your meals with more vegetables and healthy fats!');
  }
  
  // If calorie intake is low, suggest more calories
  const totalCalories = userData.nutrition.reduce((total, food) => total + food.calories, 0);
  if (totalCalories < 1500) {
    recommendedNutrition.push('You might want to increase your calorie intake for better energy.');
  }

  return recommendedNutrition.length > 0 ? recommendedNutrition : ['Great job! Keep tracking your nutrition.'];
}

// Function to update the UI with recommendations
function updateRecommendations() {
  if (!userIsLoggedIn) {
    return;
  }

  const workoutRecommendations = getWorkoutRecommendations();
  const nutritionRecommendations = getNutritionRecommendations();
  
  const recommendationSection = document.querySelector('#recommendations');
  recommendationSection.innerHTML = `
    <h3>AI Recommendations</h3>
    <h4>Workout Suggestions:</h4>
    <ul>
      ${workoutRecommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
    <h4>Nutrition Suggestions:</h4>
    <ul>
      ${nutritionRecommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
  `;
}

// Call the updateRecommendations function when the page loads
document.addEventListener('DOMContentLoaded', updateRecommendations);

// Example of adding workout and nutrition data to localStorage
// In practice, this would happen when users log workouts/nutrition

function logWorkout(workout) {
  userData.workouts.push(workout);
  localStorage.setItem('workouts', JSON.stringify(userData.workouts));
  updateRecommendations(); // Update recommendations after logging a new workout
}

function logNutrition(nutrition) {
  userData.nutrition.push(nutrition);
  localStorage.setItem('nutrition', JSON.stringify(userData.nutrition));
  updateRecommendations(); // Update recommendations after logging new nutrition data
}
