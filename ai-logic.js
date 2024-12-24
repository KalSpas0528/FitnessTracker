(function () {
    console.log('Initializing Enhanced Titan AI Fitness Assistant...');
    console.log('TITAN AI Initilized...');

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

    async function handleChatResponse(message) {
        const input = message.toLowerCase().trim();

        if (['hi', 'hello', 'hey', 'greetings'].includes(input)) {
            return "Hello! I'm Titan AI, your fitness assistant. How can I help you today? Type 'help' to see what I can do.";
        }

        if (input === 'help') {
            return generateHelpResponse();
        }

        if (input === 'calculations') {
            return listCalculations();
        }

        if (input.startsWith('calculate') || input.includes('bmi') || input.includes('calorie') || input.includes('protein')) {
            return handleCalculationRequest(input);
        }

        if (input.includes('workout') || input.includes('exercise')) {
            return handleWorkoutAdvice(input);
        }

        if (input.includes('nutrition') || input.includes('diet') || input.includes('eat')) {
            return handleNutritionAdvice(input);
        }

        if (input.includes('injury') || input.includes('prevent')) {
            return handleInjuryPrevention(input);
        }

        if (input.includes('motivat') || input.includes('inspire')) {
            return getMotivationalQuote();
        }

        return "I'm not sure I understood that. Could you please be more specific or type 'help' to see what I can assist you with?";
    }

    function generateHelpResponse() {
        return `I can assist you with various fitness topics. Here's a summary of what I can do:

1. Calculations: BMI, calorie needs, protein intake, and more.
2. Workouts: Advice for muscle gain, weight loss, and general fitness.
3. Nutrition: Meal planning, pre/post-workout nutrition, and diets.
4. Other: Motivation, injury prevention, recovery, and fitness myths.

To get started, try asking something like:
• "What calculations can you do?"
• "Give me a workout for muscle gain"
• "Nutrition advice for weight loss"
• "How to prevent running injuries"

What would you like to know more about?`;
    }

    function listCalculations() {
        return `I can help you with the following fitness calculations:

1. BMI (Body Mass Index)
2. One-Rep Max
3. Daily Calorie Needs
4. Protein Intake
5. Water Intake
6. Ideal Weight
7. Body Fat Percentage
8. Macronutrient Balance

Which calculation would you like to perform? Please provide the necessary information for the calculation.`;
    }

    function handleCalculationRequest(input) {
        // This is a placeholder. In a real implementation, you would parse the input
        // and perform the requested calculation.
        return "To calculate, I need specific information. For example, for BMI, please provide your height and weight like this: 'Calculate BMI: 70 kg, 175 cm'";
    }

    function handleWorkoutAdvice(input) {
        if (input.includes('muscle gain') || input.includes('build muscle')) {
            return `For muscle gain, here's a basic workout plan:

1. Focus on compound exercises: squats, deadlifts, bench presses, and rows.
2. Aim for 3-4 sets of 8-12 reps for each exercise.
3. Train each muscle group 2-3 times per week.
4. Progressively increase the weight as you get stronger.
5. Include 3-4 strength training sessions per week.
6. Allow for adequate rest between workouts.

Remember to combine this with proper nutrition and rest for optimal results.`;
        } else if (input.includes('weight loss') || input.includes('fat loss')) {
            return `For weight loss, consider this workout plan:

1. Combine cardio and strength training.
2. Start with 3-4 days of 30-minute cardio sessions (e.g., jogging, cycling, swimming).
3. Include 2-3 days of full-body strength training.
4. Focus on exercises that engage multiple muscle groups.
5. Gradually increase intensity and duration as you progress.
6. Remember, diet plays a crucial role in weight loss.

Consistency is key. Aim to create a sustainable routine that you can stick to long-term.`;
        } else {
            return "For personalized workout advice, I need to know your specific goal (e.g., muscle gain, weight loss, general fitness) and your current fitness level. Could you please provide more details?";
        }
    }

    function handleNutritionAdvice(input) {
        if (input.includes('muscle gain') || input.includes('build muscle')) {
            return `For muscle gain, focus on these nutrition principles:

1. Increase calorie intake: Eat 300-500 calories above your maintenance level.
2. High protein intake: Aim for 1.6-2.2 grams of protein per kg of body weight daily.
3. Include complex carbohydrates for energy.
4. Don't neglect healthy fats.
5. Eat frequent meals, about 4-6 per day.
6. Consider protein supplements if struggling to meet needs through food alone.

Key foods: Lean meats, fish, eggs, dairy, legumes, whole grains, fruits, and vegetables.`;
        } else if (input.includes('weight loss') || input.includes('fat loss')) {
            return `For weight loss, consider these nutrition guidelines:

1. Create a moderate calorie deficit: Reduce intake by 500-750 calories per day.
2. Increase protein intake to preserve muscle: Aim for 1.6-2.2 g per kg of body weight.
3. Focus on whole, unprocessed foods.
4. Include plenty of vegetables for nutrients and fiber.
5. Control portion sizes.
6. Limit processed foods and sugary drinks.
7. Stay hydrated with water.

Remember, sustainable weight loss is typically 0.5-1 kg per week.`;
        } else {
            return "For personalized nutrition advice, I need to know your specific goal (e.g., muscle gain, weight loss, general health) and any dietary restrictions. Could you please provide more details about what you're trying to achieve with your diet?";
        }
    }

    function handleInjuryPrevention(input) {
        if (input.includes('leg') || input.includes('knee') || input.includes('run')) {
            return `To prevent leg and knee injuries, especially for runners:

1. Warm up properly before exercising.
2. Wear appropriate footwear with good support.
3. Gradually increase your running distance and intensity.
4. Incorporate strength training for legs, especially quadriceps and hamstrings.
5. Practice proper running form.
6. Include rest days in your training schedule.
7. Listen to your body and don't ignore pain.

If you experience persistent pain, consult a healthcare professional.`;
        } else {
            return "Injury prevention strategies vary depending on the specific activity or body part. Could you please specify which area or activity you're concerned about? For example, 'prevent running injuries' or 'protect my back during weightlifting'.";
        }
    }

    function getMotivationalQuote() {
        return "Here's a motivational quote to inspire your fitness journey: \"" + motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)] + "\"";
    }

    // Expose the main function globally
    window.handleChatResponse = handleChatResponse;
})();

