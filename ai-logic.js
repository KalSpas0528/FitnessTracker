(function () {
    console.log('Initializing Enhanced Titan AI Fitness Assistant...');

    const prompts = {
        greeting: "Hi! I'm Titan AI, your comprehensive fitness assistant. I can help with calculations, workout advice, nutrition tips, and more. What can I help you with today?",
        categories: [
            "Fitness Calculations",
            "Workout Advice",
            "Nutrition Tips",
            "Motivation",
            "Injury Prevention",
            "Recovery Techniques",
            "Fitness Myths",
            "Supplement Information"
        ],
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
            macros: "Calculate macros: 170 lbs, muscle gain, moderate activity",
            workout: "Suggest a workout for muscle gain",
            nutrition: "What should I eat before a workout?",
            motivation: "Give me a motivational fitness quote",
            injury: "How to prevent runner's knee",
            recovery: "Best ways to recover after an intense workout",
            myth: "Is it bad to eat after 8 PM?",
            supplement: "Benefits of creatine supplementation"
        },
        motivational: [
            "Every step counts on your fitness journey!",
            "You're stronger than you think. Prove it today!",
            "The only bad workout is the one that didn't happen.",
            "Your body can stand almost anything. It's your mind you have to convince.",
            "Fitness is not about being better than someone else. It's about being better than you used to be."
        ]
    };

    async function handleChatResponse(message) {
        const input = message.toLowerCase().trim();

        if (input === 'hi' || input === 'hello' || input === 'hey') {
            return prompts.greeting;
        }

        if (input === 'help' || input.includes('what') || input.includes('example')) {
            return generateHelpResponse();
        }

        // Handle calculations and other queries
        try {
            if (input.includes('bmi') || (input.includes('calculate') && input.includes('bmi'))) {
                return handleBMICalculation(input);
            } else if (input.includes('max') || input.includes('orm') || (input.includes('calculate') && input.includes('bench'))) {
                return handleOneRepMaxCalculation(input);
            } else if (input.includes('calorie') || input.includes('cal') || (input.includes('calculate') && input.includes('calories'))) {
                return handleCalorieCalculation(input);
            } else if (input.includes('protein') || (input.includes('calculate') && input.includes('protein'))) {
                return handleProteinCalculation(input);
            } else if (input.includes('water') || (input.includes('calculate') && input.includes('water'))) {
                return handleWaterCalculation(input);
            } else if (input.includes('macro') || (input.includes('calculate') && input.includes('macros'))) {
                return handleMacroCalculation(input);
            } else if (input.includes('body fat') || (input.includes('calculate') && input.includes('body fat'))) {
                return "To calculate body fat percentage, I need more information like your weight, height, age, gender, and specific body measurements. Can you provide these details?";
            } else if (input.includes('workout') || input.includes('exercise')) {
                return handleWorkoutAdvice(input);
            } else if (input.includes('nutrition') || input.includes('diet') || input.includes('eat')) {
                return handleNutritionAdvice(input);
            } else if (input.includes('motivat')) {
                return prompts.motivational[Math.floor(Math.random() * prompts.motivational.length)];
            } else if (input.includes('injury') || input.includes('pain')) {
                return handleInjuryPrevention(input);
            } else if (input.includes('recover')) {
                return handleRecoveryAdvice(input);
            } else if (input.includes('myth')) {
                return handleFitnessMyth(input);
            } else if (input.includes('supplement')) {
                return handleSupplementInfo(input);
            }

            return "I'm not sure what you're asking. Can you try rephrasing or ask for 'help' to see what I can do?";
        } catch (error) {
            console.error('Error in Titan AI:', error);
            return "I encountered an error processing your request. Please try again or ask for 'help' to see what I can do.";
        }
    }

    function generateHelpResponse() {
        return `${prompts.greeting}\n\nI can assist with:\n${prompts.categories.join('\n')}\n\nFor calculations, try:\n${prompts.calculations.join('\n')}\n\nExample queries:\n${Object.values(prompts.examples).join('\n')}`;
    }

    // Existing calculation functions (handleBMICalculation, handleOneRepMaxCalculation, etc.) remain unchanged

    function handleWorkoutAdvice(input) {
        if (input.includes('muscle gain') || input.includes('build muscle')) {
            return "For muscle gain, focus on compound exercises like squats, deadlifts, bench presses, and rows. Aim for 3-4 sets of 8-12 reps, progressively increasing weight. Include 3-4 strength training sessions per week, allowing for adequate rest between workouts.";
        } else if (input.includes('weight loss') || input.includes('fat loss')) {
            return "For weight loss, combine cardio and strength training. Start with 3-4 days of 30-minute cardio sessions (like jogging, cycling, or swimming) and 2-3 days of full-body strength training. Focus on creating a calorie deficit through diet and exercise.";
        } else if (input.includes('beginner')) {
            return "For beginners, start with bodyweight exercises like squats, push-ups, lunges, and planks. Aim for 2-3 full-body workouts per week, focusing on proper form. Gradually increase intensity and consider adding resistance training as you progress.";
        } else {
            return "To suggest a workout, I need to know your goal (e.g., muscle gain, weight loss, general fitness) and fitness level. Can you provide more details?";
        }
    }

    function handleNutritionAdvice(input) {
        if (input.includes('before workout') || input.includes('pre-workout')) {
            return "Before a workout, eat a meal rich in complex carbs and some protein about 2-3 hours before. Good options include oatmeal with fruit and nuts, whole grain toast with peanut butter, or a chicken and rice bowl.";
        } else if (input.includes('after workout') || input.includes('post-workout')) {
            return "After a workout, focus on protein for muscle repair and carbs to replenish energy stores. Good options include a protein shake with banana, grilled chicken with sweet potato, or Greek yogurt with berries and granola.";
        } else if (input.includes('muscle gain') || input.includes('build muscle')) {
            return "For muscle gain, increase your calorie intake with a focus on protein. Aim for 1.6-2.2 grams of protein per kg of body weight daily. Include lean meats, fish, eggs, dairy, legumes, and consider protein supplements if needed.";
        } else if (input.includes('weight loss') || input.includes('fat loss')) {
            return "For weight loss, create a moderate calorie deficit. Focus on whole foods, increase protein intake to preserve muscle, and include plenty of vegetables for nutrients and fiber. Control portion sizes and limit processed foods and sugary drinks.";
        } else {
            return "For specific nutrition advice, I need to know your goal (e.g., muscle gain, weight loss, general health) and any dietary restrictions. Can you provide more details?";
        }
    }

    function handleInjuryPrevention(input) {
        if (input.includes('runner') || input.includes('knee')) {
            return "To prevent runner's knee: 1) Gradually increase running distance and intensity. 2) Wear proper running shoes. 3) Strengthen your quadriceps and hip muscles. 4) Incorporate cross-training. 5) Maintain good running form. If pain persists, consult a healthcare professional.";
        } else if (input.includes('back') || input.includes('spine')) {
            return "To prevent back injuries: 1) Maintain good posture. 2) Use proper lifting techniques. 3) Strengthen core muscles. 4) Stretch regularly, especially hip flexors and hamstrings. 5) Avoid prolonged sitting. If you have chronic back pain, consult a doctor or physical therapist.";
        } else {
            return "Injury prevention typically involves proper warm-up, correct form, gradual progression, and balanced training. For specific injury prevention advice, please mention the body part or activity you're concerned about.";
        }
    }

    function handleRecoveryAdvice(input) {
        return "To optimize recovery after workouts: 1) Get adequate sleep (7-9 hours). 2) Stay hydrated. 3) Eat a balanced post-workout meal with protein and carbs. 4) Use active recovery techniques like light cardio or yoga. 5) Consider foam rolling or massage for muscle soreness. 6) Allow for rest days between intense workouts.";
    }

    function handleFitnessMyth(input) {
        if (input.includes('eat after 8') || input.includes('late night eating')) {
            return "It's a myth that eating after 8 PM leads to weight gain. What matters most is your total calorie intake over the day, not the timing. However, late-night eating might disrupt sleep or lead to poor food choices, so it's best to finish eating a few hours before bedtime.";
        } else if (input.includes('spot reduce') || input.includes('target fat')) {
            return "Spot reduction is a myth. You can't target fat loss from specific body parts through exercise. Fat loss occurs throughout the body as you create a calorie deficit. Focus on overall fat loss through diet and exercise, and your body will lose fat from various areas.";
        } else {
            return "There are many fitness myths. To debunk a specific myth, please mention it in your question. Common myths include spot reduction, the need for protein immediately after workouts, and the idea that lifting weights makes women bulky.";
        }
    }

    function handleSupplementInfo(input) {
        if (input.includes('creatine')) {
            return "Creatine is one of the most researched supplements. Benefits include increased muscle strength and size, improved exercise performance, and faster recovery. It's generally safe for most people. Typical dosage is 3-5 grams per day. Always consult with a healthcare provider before starting any supplement regimen.";
        } else if (input.includes('protein') || input.includes('whey')) {
            return "Protein supplements, like whey protein, can help meet daily protein needs, especially for athletes or those struggling to get enough from food. They're convenient and can aid in muscle recovery and growth. However, they're not necessary if you can meet your protein needs through diet alone.";
        } else {
            return "Supplements can be useful but aren't necessary for everyone. Common fitness supplements include protein powders, creatine, and multivitamins. For information on a specific supplement, please mention it by name. Always consult a healthcare provider before starting any supplement regimen.";
        }
    }

    // Expose the main function globally
    window.handleChatResponse = handleChatResponse;
})();

