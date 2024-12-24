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

        if (input.includes('calculations') || input.includes('calculate')) {
            return listCalculations();
        }

        if (input.includes('bmi') || input.includes('calorie') || input.includes('protein')) {
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

        if (input.includes('weight loss')) {
            return handleWeightLossAdvice();
        }

        return "I'm not sure I understood that. Could you please be more specific or type 'help' to see what I can assist you with?";
    }

    function generateHelpResponse() {
        return `
Welcome to Titan AI! I'm here to assist you with your fitness journey. Here's what I can do:

📊 Calculations
   • BMI (Body Mass Index)
   • Daily Calorie Needs
   • Protein Intake
   • And more...

💪 Workouts
   • Muscle Gain Plans
   • Weight Loss Routines
   • General Fitness Advice

🥗 Nutrition
   • Meal Planning
   • Pre/Post-Workout Nutrition
   • Specialized Diets

🌟 Other Topics
   • Motivation
   • Injury Prevention
   • Recovery Techniques
   • Fitness Myths

To get started, try asking:
• "What calculations can you do?"
• "Give me a workout for muscle gain"
• "Nutrition advice for weight loss"
• "How to prevent running injuries"

What would you like to know more about?`;
    }

    function listCalculations() {
        return `
I can help you with the following fitness calculations:

1. BMI (Body Mass Index)
2. One-Rep Max
3. Daily Calorie Needs
4. Protein Intake
5. Water Intake
6. Ideal Weight
7. Body Fat Percentage
8. Macronutrient Balance

Which calculation would you like to perform? Please provide the necessary information for the calculation.
For example: "Calculate BMI: 70 kg, 175 cm" or "Calculate daily calories: 30 years, male, 80 kg, 180 cm, moderately active"`;
    }

    function handleCalculationRequest(input) {
        if (input.includes('bmi')) {
            const regex = /(\d+(?:\.\d+)?)\s*(kg|lbs).*?(\d+(?:\.\d+)?)\s*(cm|m|ft|'|feet)/i;
            const match = input.match(regex);
            
            if (match) {
                const [, weight, weightUnit, height, heightUnit] = match;
                return calculateBMI(parseFloat(weight), weightUnit, parseFloat(height), heightUnit);
            }
        }
        
        return "To calculate, I need specific information. For example, for BMI, please provide your height and weight like this: 'Calculate BMI: 70 kg, 175 cm' or 'Calculate BMI: 154 lbs, 5'9\"'";
    }

    function calculateBMI(weight, weightUnit, height, heightUnit) {
        // Convert weight to kg if necessary
        if (weightUnit.toLowerCase() === 'lbs') {
            weight = weight * 0.453592;
        }

        // Convert height to meters if necessary
        if (heightUnit.toLowerCase() === 'cm') {
            height = height / 100;
        } else if (heightUnit.toLowerCase() === 'ft' || heightUnit === "'") {
            height = height * 0.3048;
        }

        const bmi = weight / (height * height);
        const roundedBMI = Math.round(bmi * 10) / 10;

        let category;
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal weight";
        else if (bmi < 30) category = "Overweight";
        else category = "Obese";

        return `Your BMI is ${roundedBMI}, which falls into the "${category}" category. Remember, BMI is just one measure of health and doesn't account for factors like muscle mass.`;
    }

    function handleWorkoutAdvice(input) {
        if (input.includes('muscle gain') || input.includes('build muscle')) {
            return `
For muscle gain, here's a basic workout plan:

1. Focus on compound exercises: squats, deadlifts, bench presses, and rows.
2. Aim for 3-4 sets of 8-12 reps for each exercise.
3. Train each muscle group 2-3 times per week.
4. Progressively increase the weight as you get stronger.
5. Include 3-4 strength training sessions per week.
6. Allow for adequate rest between workouts.

Remember to combine this with proper nutrition and rest for optimal results.`;
        } else if (input.includes('weight loss') || input.includes('fat loss')) {
            return handleWeightLossAdvice();
        } else {
            return `
For personalized workout advice, I need to know your specific goal and current fitness level. 
Please specify if you're looking for:
• Muscle gain
• Weight loss
• General fitness
• Beginner or advanced routines

For example, you could ask: "Give me a beginner workout for general fitness" or "What's a good advanced routine for muscle gain?"`;
        }
    }

    function handleWeightLossAdvice() {
        return `
For weight loss, consider this comprehensive approach:

1. Workout Plan:
   • Combine cardio and strength training.
   • Start with 3-4 days of 30-minute cardio sessions (e.g., jogging, cycling, swimming).
   • Include 2-3 days of full-body strength training.
   • Focus on exercises that engage multiple muscle groups.
   • Gradually increase intensity and duration as you progress.

2. Nutrition:
   • Create a moderate calorie deficit (about 500 calories per day for 1 pound loss per week).
   • Increase protein intake to preserve muscle (aim for 1.6-2.2g per kg of body weight).
   • Focus on whole, unprocessed foods.
   • Include plenty of vegetables for nutrients and fiber.
   • Control portion sizes.
   • Limit processed foods and sugary drinks.
   • Stay hydrated with water.

3. Lifestyle:
   • Get adequate sleep (7-9 hours per night).
   • Manage stress through techniques like meditation or yoga.
   • Stay consistent with your routine.
   • Track your progress, but don't obsess over daily weight fluctuations.

Remember, sustainable weight loss is typically 0.5-1 kg (1-2 lbs) per week. Consult with a healthcare professional before starting any new diet or exercise program.`;
    }

    function handleNutritionAdvice(input) {
        if (input.includes('muscle gain') || input.includes('build muscle')) {
            return `
For muscle gain, focus on these nutrition principles:

1. Increase calorie intake: Eat 300-500 calories above your maintenance level.
2. High protein intake: Aim for 1.6-2.2 grams of protein per kg of body weight daily.
3. Include complex carbohydrates for energy.
4. Don't neglect healthy fats.
5. Eat frequent meals, about 4-6 per day.
6. Consider protein supplements if struggling to meet needs through food alone.

Key foods: Lean meats, fish, eggs, dairy, legumes, whole grains, fruits, and vegetables.`;
        } else if (input.includes('weight loss') || input.includes('fat loss')) {
            return `
For weight loss, consider these nutrition guidelines:

1. Create a moderate calorie deficit: Reduce intake by 500-750 calories per day.
2. Increase protein intake to preserve muscle: Aim for 1.6-2.2 g per kg of body weight.
3. Focus on whole, unprocessed foods.
4. Include plenty of vegetables for nutrients and fiber.
5. Control portion sizes.
6. Limit processed foods and sugary drinks.
7. Stay hydrated with water.

Remember, sustainable weight loss is typically 0.5-1 kg per week.`;
        } else {
            return `
For personalized nutrition advice, I need to know your specific goal and any dietary restrictions. 
Please specify if you're looking for:
• Muscle gain diet
• Weight loss diet
• General health improvement
• Pre/post-workout nutrition
• Vegetarian/vegan options
• Meal planning tips

For example, you could ask: "What should I eat before a workout?" or "Give me a meal plan for weight loss."`;
        }
    }

    function handleInjuryPrevention(input) {
        if (input.includes('leg') || input.includes('knee') || input.includes('run')) {
            return `
To prevent leg and knee injuries, especially for runners:

1. Warm up properly before exercising.
2. Wear appropriate footwear with good support.
3. Gradually increase your running distance and intensity.
4. Incorporate strength training for legs, especially quadriceps and hamstrings.
5. Practice proper running form.
6. Include rest days in your training schedule.
7. Listen to your body and don't ignore pain.

If you experience persistent pain, consult a healthcare professional.`;
        } else {
            return `
Injury prevention strategies vary depending on the specific activity or body part. 
Please specify which area or activity you're concerned about. For example:
• "Prevent running injuries"
• "Protect my back during weightlifting"
• "Avoid shoulder injuries in swimming"
• "Prevent injuries during HIIT workouts"

Once you provide more details, I can give you specific injury prevention advice.`;
        }
    }

    function getMotivationalQuote() {
        return "Here's a motivational quote to inspire your fitness journey: \"" + motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)] + "\"";
    }

    // Expose the main function globally
    window.handleChatResponse = handleChatResponse;
})();

