(function () {
    console.log('Initializing Titan AI with TensorFlow.js-powered intelligence...');

    let conversationHistory = [];
    let userContext = "";
    let subContext = "";

    // Function to handle chat responses
    async function handleChatResponse(message) {
        conversationHistory.push({ role: 'user', content: message });
        const normalizedMessage = message.toLowerCase().trim();

        // Introduction message
        if (conversationHistory.length === 1) {
            return respondAndSave("Hello! I'm Titan AI, your fitness and nutrition assistant. I can calculate BMI, expected bench press, caloric needs, and more! I also provide advice on workouts, diet planning, and motivation. How can I help you today?");
        }

        // Reset context if user asks to start over
        if (normalizedMessage.includes("start over") || normalizedMessage.includes("reset")) {
            userContext = "";
            subContext = "";
            conversationHistory = [];
            return respondAndSave("Okay, let's start fresh! What would you like to focus on: workouts, nutrition, or calculations?");
        }

        // Check if the user is changing the topic
        if (normalizedMessage.includes('workout') || normalizedMessage.includes('exercise')) {
            userContext = "workout";
            subContext = "";
            return respondAndSave("Great! For workouts, I can suggest exercises, track progress, or help with training plans. What do you need assistance with?");
        } else if (normalizedMessage.includes('nutrition') || normalizedMessage.includes('diet')) {
            userContext = "nutrition";
            subContext = "";
            return respondAndSave("Nutrition is key to fitness! Are you looking for meal plans, macro calculations, or diet tips?");
        } else if (normalizedMessage.includes('calculator') || normalizedMessage.includes('calculate')) {
            userContext = "calculator";
            return respondAndSave("I can calculate things like BMI, expected bench press max, daily caloric needs, one-rep max, and more. What would you like to calculate?");
        } else if (normalizedMessage.includes('motivation')) {
            userContext = "motivation";
            return respondAndSave(getMotivationalQuote());
        }

        // Handle calculator context
        if (userContext === "calculator") {
            if (normalizedMessage.includes("bmi")) {
                const match = normalizedMessage.match(/\b(\d+)\b.*?\b(\d+)\b/);
                if (match) {
                    const [weight, height] = [parseInt(match[1]), parseInt(match[2])];
                    const bmi = (weight / (height / 100) ** 2).toFixed(2);
                    return respondAndSave(`Your BMI is ${bmi}. This is a simple indicator; for more insight, consider discussing with a healthcare professional.`);
                } else {
                    return respondAndSave("To calculate BMI, provide your weight (kg) and height (cm). For example: 'Calculate BMI for 70 kg and 175 cm.'");
                }
            } else if (normalizedMessage.includes("bench") || normalizedMessage.includes("expected bench")) {
                const match = normalizedMessage.match(/\b(\d+)\b\s*reps?/);
                if (match) {
                    const reps = parseInt(match[1]);
                    const maxBench = (reps * 2.5).toFixed(1); // Simplified calculation
                    return respondAndSave(`Based on your input, your estimated bench press max is ${maxBench} lbs.`);
                } else {
                    return respondAndSave("To estimate bench press max, provide the number of reps you can do at a specific weight. For example: 'Estimate bench for 10 reps.'");
                }
            } else if (normalizedMessage.includes("caloric needs") || normalizedMessage.includes("calories")) {
                const match = normalizedMessage.match(/\b(\d+)\b.*?\b(\d+)\b.*?(male|female)/);
                if (match) {
                    const [weight, height, gender] = [parseInt(match[1]), parseInt(match[2]), match[3]];
                    const bmr = gender === "male" ? (10 * weight + 6.25 * height - 5 * 30 + 5) : (10 * weight + 6.25 * height - 5 * 30 - 161);
                    const maintenanceCalories = (bmr * 1.55).toFixed(0); // Moderate activity multiplier
                    return respondAndSave(`Your estimated daily caloric needs are ${maintenanceCalories} kcal for maintenance. Adjust based on your goals (e.g., surplus for muscle gain).`);
                } else {
                    return respondAndSave("To calculate caloric needs, provide your weight (kg), height (cm), and gender. For example: 'Calculate calories for 70 kg, 175 cm, male.'");
                }
            } else {
                return respondAndSave("I can calculate BMI, bench press max, caloric needs, one-rep max, and more. What should we calculate?");
            }
        }

        // Handle workout context
        if (userContext === "workout") {
            // Add more interactive and realistic suggestions
            return respondAndSave(getWorkoutAdvice(normalizedMessage));
        }

        // Handle nutrition context
        if (userContext === "nutrition") {
            return respondAndSave(getMealPlanningAdvice(normalizedMessage));
        }

        // Handle motivation context
        if (userContext === "motivation") {
            return respondAndSave(getMotivationalQuote());
        }

        // Default response if no context matches
        return respondAndSave("I'm not sure I understood that. Could you clarify or ask about workouts, nutrition, calculators, or motivation?");
    }

    function respondAndSave(response) {
        conversationHistory.push({ role: 'assistant', content: response });
        return response;
    }

    function getWorkoutAdvice(input) {
        return "For workouts, I recommend starting with a balanced routine that includes compound and isolation exercises. Let me know what muscle group or goal you have in mind, and I can help more!";
    }

    function getMealPlanningAdvice(input) {
        return "Meal planning starts with understanding your goals. Tell me more about whether you want to gain muscle, lose fat, or maintain your weight, and I can provide tailored advice.";
    }

    function getMotivationalQuote() {
        const quotes = [
            "The only bad workout is the one that didn't happen.",
            "Your body can stand almost anything. It's your mind that you have to convince.",
            "Strive for progress, not perfection."
        ];
        return `Here's a motivational quote for you: "${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    }

    // Expose function globally
    window.handleChatResponse = handleChatResponse;
})();
