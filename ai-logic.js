(function () {
    console.log('Initializing Enhanced Titan AI Calculator...');

    // Comprehensive prompt templates
    const prompts = {
        greeting: "Hi! I'm Titan AI, your fitness calculator. I can help with BMI, calories, protein needs, and more. What would you like to calculate?",
        calculations: [
            "BMI Calculator",
            "One-Rep Max Calculator",
            "Calorie Calculator",
            "Protein Calculator",
            "Water Intake Calculator",
            "Ideal Weight Calculator",
            "Body Fat Calculator",
            "Macro Calculator"
        ],
        examples: {
            bmi: "Calculate BMI: 170 lbs, 5 ft 10 in",
            oneRepMax: "Calculate max bench: 185 lbs for 5 reps",
            calories: "Calculate calories: 170 lbs, 5 ft 10 in, 30 years, male, moderate activity",
            protein: "Protein needs: 170 lbs, muscle gain",
            water: "Water intake: 170 lbs, moderate activity",
            macros: "Calculate macros: 170 lbs, muscle gain, moderate activity"
        },
        motivational: [
            "Every calculation brings you closer to your goals!",
            "Numbers don't lie - trust the process!",
            "Knowledge is power, especially in fitness!",
            "Let's make these calculations work for you!",
            "Small changes lead to big results!"
        ]
    };

    // Main handler function
    async function handleChatResponse(message) {
        const input = message.toLowerCase().trim();

        // Check for help or examples request
        if (input.includes('help') || input.includes('example') || input.includes('what') || input === 'hi' || input === 'hello') {
            return `${prompts.greeting}\n\nI can help with:\n${prompts.calculations.join('\n')}\n\nExample commands:\n${Object.values(prompts.examples).join('\n')}`;
        }

        // Handle calculations
        try {
            if (input.includes('bmi')) {
                return handleBMICalculation(input);
            } else if (input.includes('max') || input.includes('orm')) {
                return handleOneRepMaxCalculation(input);
            } else if (input.includes('calorie')) {
                return handleCalorieCalculation(input);
            } else if (input.includes('protein')) {
                return handleProteinCalculation(input);
            } else if (input.includes('water')) {
                return handleWaterCalculation(input);
            } else if (input.includes('macro')) {
                return handleMacroCalculation(input);
            } else if (input.includes('motivat')) {
                return prompts.motivational[Math.floor(Math.random() * prompts.motivational.length)];
            }

            // If no specific calculation is detected
            return "I'm not sure what you'd like to calculate. Try asking for 'help' to see what I can do!";
        } catch (error) {
            console.error('Calculation error:', error);
            return "I couldn't process that calculation. Please check the format and try again!";
        }
    }

    // Helper functions for calculations
    function extractNumbers(input) {
        const numbers = input.match(/\d+(\.\d+)?/g);
        return numbers ? numbers.map(Number) : [];
    }

    function handleBMICalculation(input) {
        const numbers = extractNumbers(input);
        if (numbers.length >= 3) {
            const [weight, feet, inches] = numbers;
            const heightInches = (feet * 12) + (inches || 0);
            const bmi = (weight * 703) / (heightInches * heightInches);
            const category = getBMICategory(bmi);
            return `Your BMI is ${bmi.toFixed(1)} (${category}). Remember, BMI is just one measure of health!`;
        }
        return "For BMI, please provide weight in pounds and height (e.g., 'Calculate BMI: 170 lbs, 5 ft 10 in')";
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal weight";
        if (bmi < 30) return "Overweight";
        return "Obese";
    }

    function handleOneRepMaxCalculation(input) {
        const numbers = extractNumbers(input);
        if (numbers.length >= 2) {
            const [weight, reps] = numbers;
            const oneRM = weight * (1 + (reps / 30));
            return `Your estimated one-rep max is ${Math.round(oneRM)} lbs. This is theoretical - always practice safe lifting!`;
        }
        return "For one-rep max, please provide weight and reps (e.g., 'Calculate max: 185 lbs for 5 reps')";
    }

    function handleCalorieCalculation(input) {
        const numbers = extractNumbers(input);
        if (numbers.length >= 4) {
            const [weight, feet, inches, age] = numbers;
            const heightInches = (feet * 12) + (inches || 0);
            const isMale = input.includes('male');
            const activity = getActivityLevel(input);
            const bmr = calculateBMR(weight, heightInches, age, isMale);
            const tdee = calculateTDEE(bmr, activity);
            return `Your estimated daily calorie needs are:\nMaintenance: ${Math.round(tdee)} calories\nWeight loss: ${Math.round(tdee - 500)} calories\nWeight gain: ${Math.round(tdee + 500)} calories`;
        }
        return "For calories, please provide weight, height, age, gender, and activity level";
    }

    function handleProteinCalculation(input) {
        const numbers = extractNumbers(input);
        if (numbers.length >= 1) {
            const weight = numbers[0];
            const goal = getGoal(input);
            const proteinNeeds = calculateProteinNeeds(weight, goal);
            return `Your daily protein target is ${proteinNeeds.min}-${proteinNeeds.max}g. Try to spread this across 4-6 meals!`;
        }
        return "For protein needs, please provide your weight and goal (muscle gain, maintenance, or fat loss)";
    }

    function handleWaterCalculation(input) {
        const numbers = extractNumbers(input);
        if (numbers.length >= 1) {
            const weight = numbers[0];
            const activity = getActivityLevel(input);
            const waterNeeds = calculateWaterNeeds(weight, activity);
            return `You should aim for ${waterNeeds.min}-${waterNeeds.max} liters of water daily. Adjust based on climate and sweating!`;
        }
        return "For water intake, please provide your weight and activity level";
    }

    function handleMacroCalculation(input) {
        const numbers = extractNumbers(input);
        if (numbers.length >= 1) {
            const weight = numbers[0];
            const goal = getGoal(input);
            const activity = getActivityLevel(input);
            const macros = calculateMacros(weight, goal, activity);
            return `Recommended daily macros:\nProtein: ${macros.protein}g\nCarbs: ${macros.carbs}g\nFat: ${macros.fat}g`;
        }
        return "For macro split, please provide weight, goal (muscle gain, fat loss, maintenance), and activity level";
    }

    // Utility functions
    function getActivityLevel(input) {
        if (input.includes('sedentary')) return 1.2;
        if (input.includes('light')) return 1.375;
        if (input.includes('moderate')) return 1.55;
        if (input.includes('very active') || input.includes('intense')) return 1.725;
        return 1.55; // Default to moderate
    }

    function getGoal(input) {
        if (input.includes('muscle') || input.includes('gain')) return 'muscle_gain';
        if (input.includes('loss') || input.includes('cut')) return 'fat_loss';
        return 'maintenance';
    }

    function calculateBMR(weight, heightInches, age, isMale) {
        const heightCm = heightInches * 2.54;
        const weightKg = weight * 0.453592;
        return isMale
            ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
            : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }

    function calculateTDEE(bmr, activityMultiplier) {
        return bmr * activityMultiplier;
    }

    function calculateProteinNeeds(weight, goal) {
        const weightKg = weight * 0.453592;
        switch (goal) {
            case 'muscle_gain':
                return { min: Math.round(weightKg * 2.2), max: Math.round(weightKg * 2.4) };
            case 'fat_loss':
                return { min: Math.round(weightKg * 2.0), max: Math.round(weightKg * 2.2) };
            default:
                return { min: Math.round(weightKg * 1.6), max: Math.round(weightKg * 1.8) };
        }
    }

    function calculateWaterNeeds(weight, activity) {
        const weightKg = weight * 0.453592;
        const baseNeeds = weightKg * 0.033;
        return {
            min: Math.round(baseNeeds * 10) / 10,
            max: Math.round(baseNeeds * activity * 10) / 10
        };
    }

    function calculateMacros(weight, goal, activity) {
        const calories = calculateBMR(weight, 70, 30, true) * activity; // Using average height/age
        let proteinPct, carbPct, fatPct;

        switch (goal) {
            case 'muscle_gain':
                proteinPct = 0.3;
                carbPct = 0.45;
                fatPct = 0.25;
                break;
            case 'fat_loss':
                proteinPct = 0.4;
                carbPct = 0.3;
                fatPct = 0.3;
                break;
            default:
                proteinPct = 0.3;
                carbPct = 0.4;
                fatPct = 0.3;
        }

        return {
            protein: Math.round((calories * proteinPct) / 4),
            carbs: Math.round((calories * carbPct) / 4),
            fat: Math.round((calories * fatPct) / 9)
        };
    }

    // Expose the main function globally
    window.handleChatResponse = handleChatResponse;
})();

