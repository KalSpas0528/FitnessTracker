(function () {
    console.log('Initializing Enhanced Titan AI Fitness Assistant...');
    console.log('Initializing Enhanced Titan AI Fitness Assistant...');
    console.log('Initialized...');

    const categories = {
        calculations: ["BMI", "One-Rep Max", "Daily Calorie Needs", "Protein Intake", "Water Intake", "Ideal Weight", "Body Fat Percentage", "Macronutrient Balance"],
        workouts: ["Muscle Gain", "Weight Loss", "General Fitness", "Beginner Routines", "Advanced Routines"],
        nutrition: ["Meal Planning", "Pre/Post-Workout Nutrition", "Weight Loss Diets", "Muscle Gain Diets"],
        other: ["Injury Prevention", "Recovery Techniques", "Motivation", "Fitness Myths"]
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
            await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
            const input = message.toLowerCase().trim();
            updateUserPreferences(input);

            if (['hi', 'hello', 'hey', 'greetings'].includes(input)) {
                return "Hey there! I'm Titan, your fitness buddy. What can I help you with today?";
            }

            if (input === 'help' || input === '?') {
                return generateHelpResponse();
            }

            if (input.includes('bmi')) {
                return calculateBMI(input);
            }

            if (input.includes('workout') || input.includes('exercise')) {
                return handleWorkoutAdvice(input);
            }

            if (input.includes('nutrition') || input.includes('diet') || input.includes('eat')) {
                return handleNutritionAdvice(input);
            }

            if (input.includes('motivat') || input.includes('inspire')) {
                return getMotivationalQuote();
            }

            return "I'm not sure I understood that. Could you rephrase or ask for 'help' to see what I can do?";
        } catch (error) {
            console.error('Error in handleChatResponse:', error);
            return "Oops, I hit a snag. Could you try asking that again?";
        }
    }

    function generateHelpResponse() {
        return `I can help with calculations like BMI, workout plans, nutrition advice, and more. Try asking:
• "Calculate my BMI"
• "Workout for muscle gain"
• "Nutrition for weight loss"
• "Give me a motivational quote"

What would you like to know?`;
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
            if (bmi < 18.5) category = "underweight";
            else if (bmi < 25) category = "normal weight";
            else if (bmi < 30) category = "overweight";
            else category = "obese";

            return `Your BMI is ${roundedBMI}, which is considered ${category}. Remember, BMI is just one health indicator and doesn't account for factors like muscle mass.`;
        }
        
        return "To calculate BMI, I need your height and weight. For example: 'Calculate BMI: 70 kg, 175 cm' or 'BMI: 154 lbs, 5'6\"'";
    }

    function handleWorkoutAdvice(input) {
        if (input.includes('muscle gain') || input.includes('build muscle')) {
            return `For muscle gain, try this:
• Focus on compound exercises: squats, deadlifts, bench presses, rows
• Aim for 3-4 sets of 8-12 reps
• Train each muscle group 2-3 times a week
• Progressively increase weights
• Include 3-4 strength sessions weekly
• Don't forget rest and proper nutrition!`;
        } else if (input.includes('weight loss') || input.includes('fat loss')) {
            return `For weight loss, consider:
• Mix cardio and strength training
• Start with 3-4 days of 30-min cardio
• Add 2-3 days of full-body strength training
• Focus on exercises that work multiple muscle groups
• Gradually increase intensity and duration
• Combine with a balanced, calorie-controlled diet`;
        } else {
            return "What's your specific fitness goal? Muscle gain, weight loss, or general fitness? I can give you a tailored plan once I know what you're aiming for.";
        }
    }

    function handleNutritionAdvice(input) {
        if (input.includes('weight loss')) {
            return `For weight loss nutrition:
• Create a moderate calorie deficit (about 500 calories/day)
• Increase protein intake (1.6-2.2g per kg of body weight)
• Focus on whole, unprocessed foods
• Eat plenty of vegetables for nutrients and fiber
• Control portion sizes
• Limit processed foods and sugary drinks
• Stay hydrated!`;
        } else if (input.includes('muscle gain')) {
            return `For muscle gain nutrition:
• Increase calories (300-500 above maintenance)
• High protein intake (1.6-2.2g per kg of body weight)
• Include complex carbs for energy
• Don't skip healthy fats
• Eat 4-6 meals a day
• Consider protein supplements if needed
• Key foods: lean meats, fish, eggs, dairy, legumes, whole grains, fruits and veggies`;
        } else {
            return "Are you looking for nutrition advice for weight loss, muscle gain, or general health? Let me know, and I'll provide specific tips!";
        }
    }

    function getMotivationalQuote() {
        return "Here's a dose of motivation for you: \"" + motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)] + "\" Keep pushing!";
    }

    window.handleChatResponse = handleChatResponse;
})();

