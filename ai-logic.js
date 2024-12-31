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

    async function handleChatResponse(message) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500));

        const input = message.toLowerCase().trim();
        const normalizedInput = input.replace(/[^a-z0-9\s]/g, '');

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

        return "I'm sorry, I didn't understand that. Could you please rephrase your question or type 'help' to see what I can assist you with?";
    }

    function generateHelpResponse() {
        return `
Welcome to Titan AI! I'm here to assist you with your fitness journey.

I can help with:
• Calculations
  - BMI
  - One-Rep Max
  - Daily Calorie Needs
  - Protein Intake
  - Water Intake
  - Ideal Weight
  - Body Fat Percentage
  - Macronutrient Balance

• Workout Plans
  - Muscle Gain
  - Weight Loss
  - General Fitness
  - Beginner Routines
  - Advanced Routines

• Nutrition Advice
  - Meal Planning
  - Pre/Post-Workout Nutrition
  - Weight Loss Diets
  - Muscle Gain Diets

• Other Topics
  - Injury Prevention
  - Recovery Techniques
  - Motivation
  - Fitness Myths

Try asking:
• "Calculate my BMI"
• "Workout for muscle gain"
• "Nutrition for weight loss"
• "Prevent running injuries"

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
                // Handle cases like "5 6" for 5 feet 6 inches
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

    function calculateOneRepMax(input) {
        const regex = /(\d+(?:\.\d+)?)\s*(kg|lbs|pounds|kilos).*?(\d+)\s*(reps?|repetitions?)/i;
        const match = input.match(regex);

        if (match) {
            const [, weight, weightUnit, reps] = match;
            const oneRM = parseFloat(weight) / (1.0278 - 0.0278 * parseFloat(reps));
            const unit = weightUnit.toLowerCase() === 'kg' || weightUnit.toLowerCase() === 'kilos' ? 'kg' : 'lbs';
            return `Your estimated one-rep max is ${Math.round(oneRM)} ${unit}.`;
        }

        return "To calculate one-rep max, please provide the weight and number of reps. For example: 'Calculate 1RM: 100 kg for 5 reps' or 'One rep max: 225 lbs, 8 repetitions'";
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

    function handleWorkoutAdvice(input) {
        const normalizedInput = input.toLowerCase().trim();
        if (normalizedInput.includes('muscle gain') || normalizedInput.includes('build muscle')) {
            return `
For muscle gain, here's a basic workout plan:

• Focus on compound exercises:
  - Squats
  - Deadlifts
  - Bench presses
  - Rows

• Aim for 3-4 sets of 8-12 reps for each exercise
• Train each muscle group 2-3 times per week
• Progressively increase the weight as you get stronger
• Include 3-4 strength training sessions per week
• Allow for adequate rest between workouts

Remember to combine this with proper nutrition and rest for optimal results.`;
        } else if (normalizedInput.includes('weight loss') || normalizedInput.includes('fat loss')) {
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

Remember, sustainable weight loss is typically 0.5-1 kg (1-2 lbs) per week. Consult with a healthcare professional before starting any new diet or exercise program.`;
    }

    function handleNutritionAdvice(input) {
        const normalizedInput = input.toLowerCase().trim();
        if (normalizedInput.includes('muscle gain') || normalizedInput.includes('build muscle')) {
            return `
For muscle gain, focus on these nutrition principles:

• Increase calorie intake: Eat 300-500 calories above your maintenance level
• High protein intake: Aim for 1.6-2.2 grams of protein per kg of body weight daily
• Include complex carbohydrates for energy
• Don't neglect healthy fats
• Eat frequent meals, about 4-6 per day
• Consider protein supplements if struggling to meet needs through food alone

Key foods:
• Lean meats
• Fish
• Eggs
• Dairy
• Legumes
• Whole grains
• Fruits and vegetables`;
        } else if (normalizedInput.includes('weight loss') || normalizedInput.includes('fat loss')) {
            return `
For weight loss, consider these nutrition guidelines:

• Create a moderate calorie deficit: Reduce intake by 500-750 calories per day
• Increase protein intake to preserve muscle: Aim for 1.6-2.2 g per kg of body weight
• Focus on whole, unprocessed foods
• Include plenty of vegetables for nutrients and fiber
• Control portion sizes
• Limit processed foods and sugary drinks
• Stay hydrated with water

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
        const normalizedInput = input.toLowerCase().trim();
        if (normalizedInput.includes('leg') || normalizedInput.includes('knee') || normalizedInput.includes('run')) {
            return `
To prevent leg and knee injuries, especially for runners:

• Warm up properly before exercising
• Wear appropriate footwear with good support
• Gradually increase your running distance and intensity
• Incorporate strength training for legs, especially quadriceps and hamstrings
• Practice proper running form
• Include rest days in your training schedule
• Listen to your body and don't ignore pain

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

