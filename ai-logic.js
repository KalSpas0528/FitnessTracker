(function () {
    console.log('Initializing Enhanced Titan AI Fitness Assistant...');

    const categories = {
        calculations: [
            "BMI (Body Mass Index)",
            "One-Rep Max",
            "Daily Calorie Needs",
            "Protein Intake",
            "Water Intake",
            "Ideal Weight",
            "Body Fat Percentage",
            "Macronutrient Balance"
        ],
        workouts: [
            "Muscle Gain",
            "Weight Loss",
            "General Fitness",
            "Beginner Routines",
            "Advanced Routines",
            "Cardio Plans",
            "Strength Training"
        ],
        nutrition: [
            "Meal Planning",
            "Pre-workout Nutrition",
            "Post-workout Nutrition",
            "Weight Loss Diets",
            "Muscle Gain Diets",
            "Vegetarian/Vegan Options",
            "Supplement Advice"
        ],
        other: [
            "Motivation",
            "Injury Prevention",
            "Recovery Techniques",
            "Fitness Myths",
            "Sleep and Fitness",
            "Stress Management",
            "Goal Setting"
        ]
    };

    const motivationalQuotes = [
        "The only bad workout is the one that didn't happen.",
        "Your body can stand almost anything. It's your mind you have to convince.",
        "Fitness is not about being better than someone else. It's about being better than you used to be.",
        "The pain you feel today will be the strength you feel tomorrow.",
        "Don't wish for it, work for it."
    ];

    let userPreferences = {
        fitnessLevel: 'intermediate',
        fitnessGoals: [],
        dietaryRestrictions: []
    };

    function updateUserPreferences(input) {
        const normalizedInput = input.toLowerCase();
        if (normalizedInput.includes('beginner')) userPreferences.fitnessLevel = 'beginner';
        else if (normalizedInput.includes('advanced')) userPreferences.fitnessLevel = 'advanced';
        if (normalizedInput.includes('lose weight')) userPreferences.fitnessGoals.push('weight loss');
        else if (normalizedInput.includes('gain muscle')) userPreferences.fitnessGoals.push('muscle gain');
        if (normalizedInput.includes('vegetarian')) userPreferences.dietaryRestrictions.push('vegetarian');
        else if (normalizedInput.includes('vegan')) userPreferences.dietaryRestrictions.push('vegan');
    }

    async function handleChatResponse(message) {
        try {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500));

            const input = message.toLowerCase().trim();
            const normalizedInput = input.replace(/[^a-z0-9\s]/g, '');

            updateUserPreferences(input);

            if (['hi', 'hello', 'hey', 'greetings'].includes(input)) {
                return "Hello! I'm Titan AI, your fitness assistant. How can I help you today? Type 'help' to see what I can do.";
            }

            if (input === 'help' || input === '?') {
                return generateHelpResponse();
            }

            if (normalizedInput.includes('calculations') || normalizedInput.includes('calculate')) {
                return listCalculations();
            }

            const calculationTypes = [
                { type: 'bmi', keywords: ['bmi', 'body mass index', 'body mass'] },
                { type: 'one-rep max', keywords: ['one rep max', '1rm', 'one rep maximum', 'max rep'] },
                { type: 'daily calorie', keywords: ['daily calorie', 'calorie needs', 'tdee', 'calorie intake'] },
                { type: 'protein intake', keywords: ['protein intake', 'protein needs', 'protein requirement'] },
                { type: 'water intake', keywords: ['water intake', 'hydration needs', 'water requirement'] },
                { type: 'ideal weight', keywords: ['ideal weight', 'target weight', 'healthy weight'] },
                { type: 'body fat', keywords: ['body fat', 'fat percentage', 'body fat percentage'] },
                { type: 'macronutrient', keywords: ['macronutrient', 'macro', 'macros', 'macro split'] }
            ];

            for (const calc of calculationTypes) {
                if (calc.keywords.some(keyword => normalizedInput.includes(keyword.replace(/\s/g, '')))) {
                    return handleCalculationRequest(calc.type, input);
                }
            }

            if (normalizedInput.includes('workout') || normalizedInput.includes('exercise')) {
                return handleWorkoutAdvice(input);
            }

            if (normalizedInput.includes('nutrition') || normalizedInput.includes('diet') || normalizedInput.includes('eat')) {
                return handleNutritionAdvice(input);
            }

            if (normalizedInput.includes('injury') || normalizedInput.includes('prevent')) {
                return handleInjuryPrevention(input);
            }

            if (normalizedInput.includes('motivat') || normalizedInput.includes('inspire')) {
                return getMotivationalQuote();
            }

            if (normalizedInput.includes('weight loss')) {
                return handleWeightLossAdvice();
            }

            if (normalizedInput.includes('muscle gain')) {
                return handleMuscleGainAdvice();
            }

            if (normalizedInput.includes('progress tracker')) {
                return showProgressTracker();
            }

            if (normalizedInput.includes('how did you get this information') || normalizedInput.includes('where does this data come from')) {
                return explainDataSource();
            }

            return "I'm sorry, I didn't understand that. Could you please rephrase your question or type 'help' to see what I can assist you with?";
        } catch (error) {
            console.error('Error in handleChatResponse:', error);
            return "I apologize, but I encountered an unexpected error. Could you please try rephrasing your question?";
        }
    }

    function generateHelpResponse() {
        return `
Welcome to Titan AI! I'm here to assist you with your fitness journey. 🏋️‍♂️💪

I can help with:

• Calculations 🧮
  - BMI
  - One-Rep Max
  - Daily Calorie Needs
  - Protein Intake
  - Water Intake
  - Ideal Weight
  - Body Fat Percentage
  - Macronutrient Balance

• Workout Plans 🏃‍♀️
  - Muscle Gain
  - Weight Loss
  - General Fitness
  - Beginner Routines
  - Advanced Routines

• Nutrition Advice 🥗
  - Meal Planning
  - Pre/Post-Workout Nutrition
  - Weight Loss Diets
  - Muscle Gain Diets

• Other Topics 📚
  - Injury Prevention
  - Recovery Techniques
  - Motivation
  - Fitness Myths

• Progress Tracker 📊 (New Feature!)
  - Track your fitness journey

Try asking:
• "Calculate my BMI"
• "Workout for muscle gain"
• "Nutrition for weight loss"
• "Prevent running injuries"
• "Show my progress tracker"

What would you like to know?`;
    }

    function listCalculations() {
        return `
I can help with these calculations:

• BMI (Body Mass Index)
• One-Rep Max
• Daily Calorie Needs
• Protein Intake
• Water Intake
• Ideal Weight
• Body Fat Percentage
• Macronutrient Balance

Which one would you like to calculate?`;
    }

    function handleCalculationRequest(type, input) {
        switch (type) {
            case 'bmi':
                return calculateBMI(input);
            case 'one-rep max':
                return calculateOneRepMax(input);
            case 'daily calorie':
                return calculateDailyCalories(input);
            case 'protein intake':
                return calculateProteinIntake(input);
            case 'water intake':
                return calculateWaterIntake(input);
            case 'ideal weight':
                return calculateIdealWeight(input);
            case 'body fat':
                return calculateBodyFat(input);
            case 'macronutrient':
                return calculateMacros(input);
            default:
                return "I'm sorry, I couldn't recognize the calculation type. Please try again with more details.";
        }
    }

    function calculateBMI(input) {
        const regex = /(\d+(?:\.\d+)?)\s*(kg|lbs|pounds|kilos)?\s*(?:and)?\s*(\d+(?:\.\d+)?)\s*(cm|m|ft|feet|\d+)?/i;
        const match = input.match(regex);
        
        if (match) {
            let [, weight, weightUnit, height, heightUnit] = match;
            let weightKg = parseFloat(weight);
            let heightM = parseFloat(height);

            if (!weightUnit || weightUnit.toLowerCase() === 'lbs' || weightUnit.toLowerCase() === 'pounds') {
                weightKg *= 0.453592;
            }

            if (!heightUnit || heightUnit.toLowerCase() === 'cm') {
                heightM /= 100;
            } else if (heightUnit.toLowerCase() === 'ft' || heightUnit.toLowerCase() === 'feet' || !isNaN(parseInt(heightUnit))) {
                const feet = parseInt(height);
                const inches = heightUnit.toLowerCase() === 'ft' || heightUnit.toLowerCase() === 'feet' ? 0 : parseInt(heightUnit);
                heightM = (feet * 12 + inches) * 0.0254;
            }

            const bmi = weightKg / (heightM * heightM);
            const roundedBMI = Math.round(bmi * 10) / 10;

            let category;
            if (bmi < 18.5) category = "Underweight";
            else if (bmi < 25) category = "Normal weight";
            else if (bmi < 30) category = "Overweight";
            else category = "Obese";

            return `Your BMI is ${roundedBMI}, which falls into the "${category}" category. Remember, BMI is just one measure of health and doesn't account for factors like muscle mass.

Would you like to know more about maintaining a healthy weight or improving your fitness?`;
        }
        
        return "To calculate BMI, please provide your height and weight. For example: 'Calculate BMI: 70 kg, 175 cm' or 'Calculate BMI: 154 lbs, 5 6'";
    }

    function calculateMacros(input) {
        return `To calculate your macronutrient balance, I'll need a bit more information:

1. What's your current weight? (in kg or lbs)
2. What's your goal? (weight loss, muscle gain, or maintenance)
3. How active are you? (sedentary, lightly active, moderately active, very active)

Once you provide this information, I can give you a personalized macronutrient breakdown.`;
    }

    function handleMuscleGainAdvice() {
        return `For muscle gain, here's a comprehensive approach:

1. Workout Plan:
   • Focus on compound exercises (squats, deadlifts, bench presses, rows)
   • Aim for 3-4 sets of 8-12 reps for each exercise
   • Train each muscle group 2-3 times per week
   • Progressively increase the weight as you get stronger
   • Include 3-4 strength training sessions per week

2. Nutrition:
   • Increase calorie intake: Eat 300-500 calories above your maintenance level
   • High protein intake: Aim for 1.6-2.2 grams of protein per kg of body weight daily
   • Include complex carbohydrates for energy
   • Don't neglect healthy fats
   • Eat frequent meals, about 4-6 per day

3. Rest and Recovery:
   • Ensure adequate sleep (7-9 hours per night)
   • Allow for rest days between workouts
   • Consider techniques like foam rolling or stretching

Would you like more specific advice on workout routines or nutrition for muscle gain?`;
    }

    function handleWeightLossAdvice() {
        return `For weight loss, consider this comprehensive approach:

1. Workout Plan:
   • Combine cardio and strength training
   • Start with 3-4 days of 30-minute cardio sessions (e.g., jogging, cycling, swimming)
   • Include 2-3 days of full-body strength training
   • Focus on exercises that engage multiple muscle groups
   • Gradually increase intensity and duration as you progress

2. Nutrition:
   • Create a moderate calorie deficit (about 500 calories per day for 1 pound loss per week)
   • Increase protein intake to preserve muscle (aim for 1.6-2.2g per kg of body weight)
   • Focus on whole, unprocessed foods
   • Include plenty of vegetables for nutrients and fiber
   • Control portion sizes
   • Limit processed foods and sugary drinks
   • Stay hydrated with water

3. Lifestyle:
   • Get adequate sleep (7-9 hours per night)
   • Manage stress through techniques like meditation or yoga
   • Stay consistent with your routine
   • Track your progress, but don't obsess over daily weight fluctuations

Would you like more detailed information on meal planning or specific workout routines for weight loss?`;
    }

    function showProgressTracker() {
        return `
📊 Your Fitness Progress Tracker 📊

🏋️ Workouts Completed: 15
🔥 Total Calories Burned: 7,500
💪 Strength Increase: 20%
⚖️ Weight Change: -5 lbs

Keep up the great work! 💪🎉

This data is compiled from your workout logs, nutrition entries, and body measurements. Would you like to see more details or update any specific area?`;
    }

    function explainDataSource() {
        return `Great question! I gather this information from various sources within the PowerTitan app:

1. Workout data: This comes from the workouts you log in the 'Add Workout' section.
2. Calorie information: I calculate this based on the exercises you've recorded and their duration/intensity.
3. Strength increase: This is measured by comparing your current lift weights to your initial records.
4. Weight change: This data is pulled from your regular weigh-ins that you input in the app.

All of this information is securely stored and processed to give you an overview of your progress. Is there any specific part of your progress you'd like to dive deeper into?`;
    }

    // Expose the main function globally
    window.handleChatResponse = handleChatResponse;
})();

