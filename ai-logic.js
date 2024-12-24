(function () {
    console.log('Initializing Enhanced Titan AI Fitness Assistant...');
    console.log('TITAN AI HAS BEEN INITIALIZED...');

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
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000));

        const input = message.toLowerCase().trim();

        if (['hi', 'hello', 'hey', 'greetings'].includes(input)) {
            return "Hello! I'm Titan AI, your fitness assistant. How can I help you today? Type 'help' to see what I can do.";
        }

        if (input === 'help' || input === '?') {
            return generateHelpResponse();
        }

        if (input.includes('calculations') || input.includes('calculate')) {
            return listCalculations();
        }

        const calculationTypes = [
            { type: 'bmi', keywords: ['bmi', 'body mass index'] },
            { type: 'one-rep max', keywords: ['one-rep max', 'one rep max', '1rm'] },
            { type: 'daily calorie', keywords: ['daily calorie', 'calorie needs', 'tdee'] },
            { type: 'protein intake', keywords: ['protein intake', 'protein needs'] },
            { type: 'water intake', keywords: ['water intake', 'hydration needs'] },
            { type: 'ideal weight', keywords: ['ideal weight', 'target weight'] },
            { type: 'body fat', keywords: ['body fat', 'fat percentage'] },
            { type: 'macronutrient', keywords: ['macronutrient', 'macro', 'macros'] }
        ];

        for (const calc of calculationTypes) {
            if (calc.keywords.some(keyword => input.includes(keyword))) {
                return handleCalculationRequest(calc.type, input);
            }
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
Welcome to Titan AI! I'm here to assist you with your fitness journey.

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

What would you like to know?`;
    }

    function listCalculations() {
        return `
I can help with these calculations:
1. BMI (Body Mass Index)
2. One-Rep Max
3. Daily Calorie Needs
4. Protein Intake
5. Water Intake
6. Ideal Weight
7. Body Fat Percentage
8. Macronutrient Balance

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
        const regex = /(\d+(?:\.\d+)?)\s*(kg|lbs).*?(\d+(?:\.\d+)?)\s*(cm|m|ft|feet|\d+)/i;
        const match = input.match(regex);
        
        if (match) {
            let [, weight, weightUnit, height, heightUnit] = match;
            let weightKg = parseFloat(weight);
            let heightM = parseFloat(height);

            if (weightUnit.toLowerCase() === 'lbs') {
                weightKg *= 0.453592;
            }

            if (heightUnit.toLowerCase() === 'cm') {
                heightM /= 100;
            } else if (heightUnit.toLowerCase() === 'ft' || heightUnit === "'") {
                heightM *= 0.3048;
            } else if (!isNaN(parseInt(heightUnit))) {
                // Handle cases like "5 6" for 5 feet 6 inches
                const feet = parseInt(height);
                const inches = parseInt(heightUnit);
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

    function calculateOneRepMax(input) {
        const regex = /(\d+(?:\.\d+)?)\s*(?:kg|lbs).*?(\d+)\s*reps/i;
        const match = input.match(regex);

        if (match) {
            const [, weight, reps] = match;
            const oneRM = parseFloat(weight) / (1.0278 - 0.0278 * parseFloat(reps));
            return `Your estimated one-rep max is ${Math.round(oneRM)} ${input.includes('kg') ? 'kg' : 'lbs'}.`;
        }

        return "To calculate one-rep max, please provide the weight and number of reps. For example: 'Calculate 1RM: 100 kg for 5 reps'";
    }

    function calculateDailyCalories(input) {
        // This is a simplified calculation. In a real app, you'd use a more complex formula.
        const regex = /(\d+)\s*years.*?(\d+(?:\.\d+)?)\s*(kg|lbs).*?(\d+(?:\.\d+)?)\s*(cm|m|ft|'|feet).*?(male|female).*?(sedentary|light|moderate|active|very active)/i;
        const match = input.match(regex);

        if (match) {
            const [, age, weight, weightUnit, height, heightUnit, gender, activity] = match;
            let weightKg = parseFloat(weight);
            let heightCm = parseFloat(height);

            if (weightUnit.toLowerCase() === 'lbs') {
                weightKg *= 0.453592;
            }

            if (heightUnit.toLowerCase() === 'm') {
                heightCm *= 100;
            } else if (heightUnit.toLowerCase() === 'ft' || heightUnit === "'") {
                heightCm *= 30.48;
            }

            let bmr;
            if (gender.toLowerCase() === 'male') {
                bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * parseFloat(age));
            } else {
                bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * parseFloat(age));
            }

            let activityFactor;
            switch (activity.toLowerCase()) {
                case 'sedentary': activityFactor = 1.2; break;
                case 'light': activityFactor = 1.375; break;
                case 'moderate': activityFactor = 1.55; break;
                case 'active': activityFactor = 1.725; break;
                case 'very active': activityFactor = 1.9; break;
                default: activityFactor = 1.55;
            }

            const tdee = Math.round(bmr * activityFactor);
            return `Your estimated daily calorie needs (TDEE) are ${tdee} calories.`;
        }

        return "To calculate daily calories, please provide age, weight, height, gender, and activity level. For example: 'Calculate calories: 30 years, 70 kg, 175 cm, male, moderately active'";
    }

    function calculateProteinIntake(input) {
        const regex = /(\d+(?:\.\d+)?)\s*(kg|lbs)/i;
        const match = input.match(regex);

        if (match) {
            const [, weight, unit] = match;
            let weightKg = parseFloat(weight);
            if (unit.toLowerCase() === 'lbs') {
                weightKg *= 0.453592;
            }

            const lowEnd = Math.round(weightKg * 1.6);
            const highEnd = Math.round(weightKg * 2.2);

            return `Based on your weight, your daily protein intake should be between ${lowEnd}g and ${highEnd}g.`;
        }

        return "To calculate protein intake, please provide your weight. For example: 'Calculate protein intake: 70 kg' or 'Protein needs: 154 lbs'";
    }

    function calculateWaterIntake(input) {
        const regex = /(\d+(?:\.\d+)?)\s*(kg|lbs)/i;
        const match = input.match(regex);

        if (match) {
            const [, weight, unit] = match;
            let weightKg = parseFloat(weight);
            if (unit.toLowerCase() === 'lbs') {
                weightKg *= 0.453592;
            }

            const waterLiters = Math.round(weightKg * 0.033 * 10) / 10;

            return `Based on your weight, you should aim to drink about ${waterLiters} liters of water per day. This is a general guideline and may vary based on activity level and climate.`;
        }

        return "To calculate water intake, please provide your weight. For example: 'Calculate water intake: 70 kg' or 'Water needs: 154 lbs'";
    }

    function calculateIdealWeight(input) {
        const regex = /(\d+(?:\.\d+)?)\s*(cm|m|ft|'|feet).*?(male|female)/i;
        const match = input.match(regex);

        if (match) {
            const [, height, unit, gender] = match;
            let heightCm = parseFloat(height);

            if (unit.toLowerCase() === 'm') {
                heightCm *= 100;
            } else if (unit.toLowerCase() === 'ft' || unit === "'") {
                heightCm *= 30.48;
            }

            let idealWeight;
            if (gender.toLowerCase() === 'male') {
                idealWeight = Math.round((heightCm - 100) * 0.9);
            } else {
                idealWeight = Math.round((heightCm - 100) * 0.85);
            }

            return `Based on your height and gender, your estimated ideal weight is around ${idealWeight} kg. Remember, this is a general estimate and doesn't account for factors like body composition and muscle mass.`;
        }

        return "To calculate ideal weight, please provide your height and gender. For example: 'Calculate ideal weight: 175 cm, male' or 'Ideal weight: 5'9\", female'";
    }

    function calculateBodyFat(input) {
        // This is a simplified calculation using the Navy method. In a real app, you'd use more accurate methods.
        const regex = /(male|female).*?(\d+(?:\.\d+)?)\s*(cm|in).*?waist.*?(\d+(?:\.\d+)?)\s*(cm|in).*?neck/i;
        const match = input.match(regex);

        if (match) {
            const [, gender, waist, waistUnit, neck, neckUnit] = match;
            let waistCm = parseFloat(waist);
            let neckCm = parseFloat(neck);

            if (waistUnit.toLowerCase() === 'in') {
                waistCm *= 2.54;
            }
            if (neckUnit.toLowerCase() === 'in') {
                neckCm *= 2.54;
            }

            let bodyFat;
            if (gender.toLowerCase() === 'male') {
                bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(180)) - 450;
            } else {
                // For females, we'd need hip measurement as well. This is just an approximation.
                bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm - neckCm) + 0.22100 * Math.log10(170)) - 450;
            }

            return `Your estimated body fat percentage is ${Math.round(bodyFat * 10) / 10}%. This is a rough estimate and may not be as accurate as other methods like DEXA scans or hydrostatic weighing.`;
        }

        return "To estimate body fat percentage, please provide your gender, waist circumference, and neck circumference. For example: 'Calculate body fat: male, 85 cm waist, 38 cm neck' or 'Body fat: female, 32 in waist, 13 in neck'";
    }

    function calculateMacros(input) {
        const regex = /(\d+(?:\.\d+)?)\s*(kg|lbs).*?(muscle gain|weight loss|maintenance)/i;
        const match = input.match(regex);

        if (match) {
            const [, weight, unit, goal] = match;
            let weightKg = parseFloat(weight);
            if (unit.toLowerCase() === 'lbs') {
                weightKg *= 0.453592;
            }

            let protein, carbs, fats;
            const calories = weightKg * 30; // Rough estimate

            switch (goal.toLowerCase()) {
                case 'muscle gain':
                    protein = Math.round(weightKg * 2.2);
                    fats = Math.round(weightKg * 1);
                    carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);
                    break;
                case 'weight loss':
                    protein = Math.round(weightKg * 2.2);
                    fats = Math.round(weightKg * 0.8);
                    carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);
                    break;
                default: // maintenance
                    protein = Math.round(weightKg * 1.8);
                    fats = Math.round(weightKg * 1);
                    carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);
            }

            return `Based on your weight and goal, here's a suggested macro split:
Protein: ${protein}g
Carbs: ${carbs}g
Fats: ${fats}g
Total Calories: ${calories}

Remember, this is a general guideline and may need adjustment based on your specific needs and activity level.`;
        }

        return "To calculate macronutrients, please provide your weight and goal. For example: 'Calculate macros: 70 kg, muscle gain' or 'Macro split: 154 lbs, weight loss'";
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

