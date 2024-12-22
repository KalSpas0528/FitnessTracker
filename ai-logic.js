(function () {
    console.log('Initializing Titan AI powered by TensorFlow.js...');

    let conversationHistory = [];
    let userContext = "";
    let subContext = "";

    // Mock TensorFlow.js functionality (conceptual simulation)
    function tensorflowCalculate(model, input) {
        console.log(`Using TensorFlow.js model: ${model}`);
        // Placeholder for TensorFlow-like computations
        return input * 2; // Simulated operation for demonstration
    }

    // Function to handle chat responses
    async function handleChatResponse(message) {
        conversationHistory.push({ role: 'user', content: message });
        const normalizedMessage = message.toLowerCase().trim();

        // Reset context if user asks to start over
        if (normalizedMessage.includes("start over") || normalizedMessage.includes("reset")) {
            userContext = "";
            subContext = "";
            conversationHistory = [];
            return respondAndSave("Okay, let's start fresh! Would you like to calculate BMI, expected bench press, caloric needs, or something else?");
        }

        // Check for calculation requests
        if (normalizedMessage.includes("bmi")) {
            userContext = "bmi";
            return respondAndSave("To calculate your BMI, please provide your weight (in kg) and height (in meters), separated by a comma. For example: '70, 1.75'");
        } else if (normalizedMessage.includes("bench") || normalizedMessage.includes("press")) {
            userContext = "bench";
            return respondAndSave("Let's estimate your bench press potential. Please provide your weight (in kg) and reps performed at that weight, separated by a comma. For example: '80, 5'");
        } else if (normalizedMessage.includes("calories") || normalizedMessage.includes("caloric needs")) {
            userContext = "calories";
            return respondAndSave("To estimate your daily caloric needs, please provide your weight (in kg), height (in cm), age, and activity level (sedentary, moderate, or active), separated by commas.");
        }

        // Handle BMI calculation
        if (userContext === "bmi") {
            const match = normalizedMessage.match(/(\d+(\.\d+)?),\s*(\d+(\.\d+)?)/);
            if (match) {
                const weight = parseFloat(match[1]);
                const height = parseFloat(match[3]);
                const bmi = tensorflowCalculate("BMI_Model", weight / (height * height));
                return respondAndSave(`Your BMI is approximately ${bmi.toFixed(2)}. A healthy BMI typically ranges from 18.5 to 24.9. Do you need advice on improving your BMI?");
            } else {
                return respondAndSave("I didn't catch that. Please format your input like this: 'weight, height'. For example: '70, 1.75'");
            }
        }

        // Handle bench press calculation
        if (userContext === "bench") {
            const match = normalizedMessage.match(/(\d+(\.\d+)?),\s*(\d+)/);
            if (match) {
                const weight = parseFloat(match[1]);
                const reps = parseInt(match[3]);
                const estimatedMax = tensorflowCalculate("Bench_Model", weight * (1 + reps / 30));
                return respondAndSave(`Based on ${reps} reps at ${weight} kg, your estimated one-rep max is approximately ${estimatedMax.toFixed(1)} kg. Do you want tips to improve your bench press?");
            } else {
                return respondAndSave("I didn't catch that. Please format your input like this: 'weight, reps'. For example: '80, 5'");
            }
        }

        // Handle caloric needs calculation
        if (userContext === "calories") {
            const match = normalizedMessage.match(/(\d+),\s*(\d+),\s*(\d+),\s*(sedentary|moderate|active)/);
            if (match) {
                const weight = parseInt(match[1]);
                const height = parseInt(match[2]);
                const age = parseInt(match[3]);
                const activity = match[4].toLowerCase();

                const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Simplified Harris-Benedict for men
                const activityMultiplier = activity === "active" ? 1.55 : activity === "moderate" ? 1.3 : 1.2;
                const caloricNeeds = tensorflowCalculate("Calorie_Model", bmr * activityMultiplier);

                return respondAndSave(`Your estimated daily caloric needs are approximately ${caloricNeeds.toFixed(0)} calories. Would you like meal planning tips to meet this target?");
            } else {
                return respondAndSave("I didn't catch that. Please format your input like this: 'weight, height, age, activity level'. For example: '70, 175, 25, moderate'");
            }
        }

        // Default response if no context matches
        return respondAndSave("I'm not sure I understood that. Would you like to calculate BMI, bench press potential, or caloric needs?");
    }

    function respondAndSave(response) {
        conversationHistory.push({ role: 'assistant', content: response });
        return response;
    }

    // Expose function globally
    window.handleChatResponse = handleChatResponse;
})();
