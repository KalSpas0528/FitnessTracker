(function () {
    console.log('Initializing Enhanced Titan AI...');

    let conversationHistory = [];
    let userContext = "";
    let subContext = "";

    // Function to handle chat responses
    async function handleChatResponse(message) {
        conversationHistory.push({ role: 'user', content: message });
        const normalizedMessage = message.toLowerCase().trim();

        // Reset context if user asks to start over
        if (normalizedMessage.includes("start over") || normalizedMessage.includes("reset")) {
            userContext = "";
            subContext = "";
            conversationHistory = [];
            return respondAndSave("Okay, let's start fresh! What do you want to talk about: workouts, nutrition, or motivation?");
        }

        // Check if the user is changing the topic
        if (normalizedMessage.includes('workout') || normalizedMessage.includes('exercise')) {
            userContext = "workout";
            subContext = "";
            return respondAndSave("Great! For workouts, I can help with exercise suggestions, weight tracking, or training advice. What would you like to know?");
        } else if (normalizedMessage.includes('nutrition') || normalizedMessage.includes('diet')) {
            userContext = "nutrition";
            subContext = "";
            return respondAndSave("Nutrition is crucial! Are you interested in meal planning, macronutrient balance, or specific diet types?");
        } else if (normalizedMessage.includes('motivation')) {
            userContext = "motivation";
            return respondAndSave(getMotivationalQuote());
        }

        // Handle workout context
        if (userContext === "workout") {
            if (normalizedMessage.includes('suggestion') || normalizedMessage.includes('exercise')) {
                subContext = "exercise";
                return respondAndSave("Sure, I can suggest exercises. Which muscle group do you want to focus on? (e.g., chest, legs, back, shoulders, arms)");
            } else if (normalizedMessage.includes('track') || normalizedMessage.includes('weight')) {
                subContext = "weight";
                return respondAndSave("For weight tracking, can you tell me the exercise, number of sets, and reps you're planning? For example: 'Bench press, 3 sets, 10 reps'");
            } else if (normalizedMessage.includes('advice') || normalizedMessage.includes('tip')) {
                subContext = "advice";
                return respondAndSave("I'd be happy to give you some training advice. What specific area are you looking for help with? (e.g., form, frequency, intensity)");
            }

            if (subContext === "exercise") {
                return respondAndSave(getWorkoutAdvice(normalizedMessage));
            }

            if (subContext === "weight") {
                const match = normalizedMessage.match(/(\d+)\s*sets?\s*,?\s*(\d+)\s*reps?/i);
                if (match) {
                    const [sets, reps] = [parseInt(match[1]), parseInt(match[2])];
                    return respondAndSave(getWeightRecommendation(sets, reps));
                } else {
                    return respondAndSave("I didn't catch the sets and reps. Can you please format it like this: '[Exercise name], [Number] sets, [Number] reps'?");
                }
            }

            if (subContext === "advice") {
                return respondAndSave(getTrainingAdvice(normalizedMessage));
            }
        }

        // Handle nutrition context
        if (userContext === "nutrition") {
            if (normalizedMessage.includes('meal') || normalizedMessage.includes('plan')) {
                subContext = "meal";
                return respondAndSave("Great! For meal planning, it's helpful to know your goals. Are you looking to build muscle, lose fat, or maintain your current weight?");
            } else if (normalizedMessage.includes('macro') || normalizedMessage.includes('balance')) {
                subContext = "macro";
                return respondAndSave("Macronutrient balance is important. What's your primary goal: muscle gain, fat loss, or general health?");
            } else if (normalizedMessage.includes('diet')) {
                subContext = "diet";
                return respondAndSave("There are many diet types. Are you interested in learning about keto, paleo, Mediterranean, or plant-based diets?");
            }

            if (subContext === "meal") {
                return respondAndSave(getMealPlanningAdvice(normalizedMessage));
            }

            if (subContext === "macro") {
                return respondAndSave(getMacroBalanceAdvice(normalizedMessage));
            }

            if (subContext === "diet") {
                return respondAndSave(getDietTypeInfo(normalizedMessage));
            }
        }

        // Handle motivation context
        if (userContext === "motivation") {
            return respondAndSave(getMotivationalQuote());
        }

        // Default response if no context matches
        return respondAndSave("I'm not sure I understood that. Could you provide more details or ask about workouts, nutrition, or motivation?");
    }

    function respondAndSave(response) {
        conversationHistory.push({ role: 'assistant', content: response });
        return response;
    }

    function getWorkoutAdvice(muscleGroup) {
        const workouts = {
            chest: ["bench press", "push-ups", "chest flys"],
            legs: ["squats", "lunges", "Romanian deadlifts"],
            back: ["pull-ups", "deadlifts", "rows"],
            shoulders: ["shoulder press", "lateral raises", "face pulls"],
            arms: ["bicep curls", "tricep dips", "hammer curls"]
        };
        for (let group in workouts) {
            if (muscleGroup.includes(group)) {
                return `For ${group}, I recommend exercises like ${workouts[group].join(", ")}. Aim for 3-4 sets of 8-12 reps for each exercise. Remember to warm up properly and focus on proper form. Would you like more details on any of these exercises?`;
            }
        }
        return "I didn't catch the specific muscle group. Could you specify if you're working on chest, legs, back, shoulders, or arms?";
    }

    function getWeightRecommendation(sets, reps) {
        // This is a simple calculation and should be replaced with a more sophisticated algorithm
        const baseWeight = 100; // Example base weight
        const adjustedWeight = baseWeight * (1 / sets) * (1 / reps) * 10;
        return `Based on ${sets} sets of ${reps} reps, I recommend starting with about ${adjustedWeight.toFixed(1)} lbs. Remember to adjust based on your fitness level and always prioritize proper form over weight. How does this sound?`;
    }

    function getTrainingAdvice(area) {
        if (area.includes('form')) {
            return "Proper form is crucial for effective workouts and injury prevention. Always start with lighter weights to perfect your form. Consider working with a trainer or using mirrors to check your posture. What specific exercise do you need form advice on?";
        } else if (area.includes('frequency')) {
            return "For most people, training each muscle group 2-3 times per week is optimal. Ensure you're allowing adequate rest between sessions. A common split is push/pull/legs or upper/lower body. What's your current workout frequency?";
        } else if (area.includes('intensity')) {
            return "Intensity can be increased through progressive overload - gradually increasing weight, reps, or sets. Aim to push yourself, but listen to your body to avoid overtraining. How are you currently managing workout intensity?";
        }
        return "For training advice, I can help with form, frequency, or intensity. Which area would you like to focus on?";
    }

    function getMealPlanningAdvice(goal) {
        if (goal.includes('muscle') || goal.includes('build')) {
            return "To build muscle, focus on a calorie surplus with high protein intake. Aim for 1.6-2.2g of protein per kg of body weight. Include complex carbs for energy and healthy fats. Would you like a sample meal plan?";
        } else if (goal.includes('lose') || goal.includes('fat')) {
            return "For fat loss, create a modest calorie deficit. Prioritize protein (1.6-2.2g per kg of body weight) to preserve muscle mass. Fill your plate with vegetables and lean proteins. Would you like tips on managing hunger during a cut?";
        } else if (goal.includes('maintain')) {
            return "To maintain weight, focus on balanced meals with a mix of proteins, complex carbs, and healthy fats. Eat at regular intervals and pay attention to portion sizes. Would you like advice on how to determine your maintenance calories?";
        }
        return "For effective meal planning, it's important to align with your goals. Are you looking to build muscle, lose fat, or maintain your current weight?";
    }

    function getMacroBalanceAdvice(goal) {
        if (goal.includes('muscle') || goal.includes('gain')) {
            return "For muscle gain, a typical macro split is 40% carbs, 30% protein, and 30% fat. Increase overall calories by 10-20% above maintenance. Focus on getting 1.6-2.2g of protein per kg of body weight. Would you like help calculating your specific macros?";
        } else if (goal.includes('fat') || goal.includes('loss')) {
            return "For fat loss, consider a macro split of 40% protein, 35% carbs, and 25% fat. This higher protein intake helps preserve muscle mass during a calorie deficit. Remember to create a modest calorie deficit of about 20%. Would you like tips on tracking your macros?";
        } else if (goal.includes('health') || goal.includes('general')) {
            return "For general health, a balanced macro split could be 45% carbs, 30% protein, and 25% fat. Focus on whole foods, plenty of vegetables, and lean proteins. Would you like advice on incorporating more whole foods into your diet?";
        }
        return "Macronutrient balance depends on your goals. Are you aiming for muscle gain, fat loss, or general health improvement?";
    }

    function getDietTypeInfo(dietType) {
        if (dietType.includes('keto')) {
            return "The ketogenic diet is high in fat, moderate in protein, and very low in carbs. It aims to put your body in a state of ketosis. While effective for some, it can be challenging to maintain. Would you like more details on keto macros?";
        } else if (dietType.includes('paleo')) {
            return "The paleo diet focuses on foods presumed to have been available to paleolithic humans. It includes vegetables, fruits, nuts, roots, and meat while excluding processed foods, grains, and dairy. Are you interested in paleo meal ideas?";
        } else if (dietType.includes('mediterranean')) {
            return "The Mediterranean diet emphasizes plant-based foods, healthy fats (especially olive oil), and moderate consumption of fish and poultry. It's associated with various health benefits. Would you like to know more about its principles?";
        } else if (dietType.includes('plant') || dietType.includes('vegan')) {
            return "A plant-based or vegan diet excludes all animal products. It can be very healthy when well-planned, ensuring all nutrient needs are met. Are you interested in plant-based protein sources or supplement recommendations?";
        }
        return "I can provide information on keto, paleo, Mediterranean, or plant-based diets. Which one are you most interested in learning about?";
    }

    function getMotivationalQuote() {
        const quotes = [
            "The only bad workout is the one that didn't happen.",
            "Your body can stand almost anything. It's your mind that you have to convince.",
            "The pain you feel today will be the strength you feel tomorrow.",
            "Fitness is not about being better than someone else. It's about being better than you used to be.",
            "Success is usually the culmination of controlling failure.",
            "The difference between try and triumph is a little umph.",
            "The hardest lift of all is lifting your butt off the couch.",
            "You don't have to be extreme, just consistent.",
            "Your health is an investment, not an expense.",
            "Strive for progress, not perfection."
        ];
        return `Here's a motivational quote for you: "${quotes[Math.floor(Math.random() * quotes.length)]}" Would you like another quote or some tips on staying motivated?`;
    }

    // Expose function globally
    window.handleChatResponse = handleChatResponse;
})();

