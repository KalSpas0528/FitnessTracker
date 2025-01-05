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
            "Weight Gain",
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
        else if (normalizedInput.includes('gain muscle') || normalizedInput.includes('weight gain')) userPreferences.fitnessGoals.push('muscle gain');
        if (normalizedInput.includes('vegetarian')) userPreferences.dietaryRestrictions.push('vegetarian');
        else if (normalizedInput.includes('vegan')) userPreferences.dietaryRestrictions.push('vegan');
    }

    function simulateThinking() {
        return new Promise(resolve => {
            addMessageToChat('System', 'TITAN AI is thinking...');
            setTimeout(resolve, Math.random() * 1000 + 500);
        });
    }

    async function handleChatResponse(message) {
        try {
            await simulateThinking();

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

            if (normalizedInput.includes('muscle gain') || normalizedInput.includes('weight gain')) {
                return handleMuscleGainAdvice();
            }

            if (normalizedInput.includes('progress tracker')) {
                return showProgressTracker();
            }

            if (normalizedInput.includes('details')) {
                return showProgressDetails();
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
• Workout Plans 🏃‍♀️
• Nutrition Advice 🥗
• Other Topics 📚
• Progress Tracker 📊

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

            return `Your BMI is ${roundedBMI}, which falls into the "${category}" category. Remember, BMI is just one measure of health and doesn't account for factors like muscle mass.`;
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
        return `For muscle gain:

• Increase calorie intake by 300-500 calories
• Aim for 1.6-2.2g protein per kg of body weight
• Focus on compound exercises
• Progressive overload in your workouts
• Adequate rest and recovery

I see in the data provided you are doing Bench Press and Squat, this is very good for building muscle gain hypertrophy.

Need more specific advice?`;
    }

    function handleWeightLossAdvice() {
        return `For weight loss:

• Create a calorie deficit of 500 calories/day
• High protein intake (1.6-2.2g per kg of body weight)
• Combine cardio and strength training
• Focus on whole, unprocessed foods
• Stay hydrated and get enough sleep

Want a detailed meal plan or workout routine?`;
    }

    function showProgressTracker() {
        return `
📊 Your Fitness Progress Tracker 📊

🏋️ Workouts Completed: 15
🔥 Total Calories Burned: 7,500
💪 Strength Increase: 20%
⚖️ Weight Change: -5 lbs

Keep up the great work! 💪🎉

Want more details on a specific area?`;
    }

    function showProgressDetails() {
        return `
Detailed Progress Breakdown:

1. Workouts:
   • Strength Training: 10 sessions
   • Cardio: 5 sessions
   • Average workout duration: 45 minutes

2. Strength Gains:
   • Bench Press: +15 lbs
   • Squat: +25 lbs
   • Deadlift: +30 lbs

3. Body Composition:
   • Initial Weight: 170 lbs
   • Current Weight: 165 lbs
   • Body Fat %: -2%

4. Nutrition:
   • Average Daily Calories: 2200
   • Protein Intake: 130g/day
   • Water Intake: 3 liters/day

Which area would you like to focus on improving?`;
    }

    // Placeholder for addMessageToChat function.  Needs to be defined elsewhere.
    function addMessageToChat(sender, message) {
        console.log(`${sender}: ${message}`);
    }


    // Expose the main function globally
    window.handleChatResponse = handleChatResponse;
})();

