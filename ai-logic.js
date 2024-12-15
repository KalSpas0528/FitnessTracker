(function () {
    console.log('Initializing Enhanced Titan AI...');

    let model = null;
    let isModelReady = false;
    let userContext = ""; // Main topic (e.g., "workout", "nutrition", "motivation")
    let subContext = ""; // Sub-topic (e.g., "exercise", "track", "calculate")
    let userMemory = {}; // Stores persistent user data (e.g., goals, preferences)

    // Function to initialize the AI model
    async function initModel() {
        try {
            model = tf.sequential();
            model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [2] })); // Input: [sets, reps]
            model.add(tf.layers.dense({ units: 1 })); // Output: recommended weight
            model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
            console.log('AI model initialized successfully');
        } catch (error) {
            console.error('Error initializing AI model:', error);
        }
    }

    // Function to train the AI model
    async function trainModel() {
        try {
            if (!model) {
                console.error('Model is not initialized');
                return;
            }
            const trainingData = tf.tensor2d([
                [3, 10], [4, 8], [5, 5], [6, 12], [2, 15]
            ]); // Example: sets, reps
            const targetData = tf.tensor2d([
                [50], [60], [80], [70], [40]
            ]); // Example: recommended weights
            console.log('Training the model...');
            await model.fit(trainingData, targetData, {
                epochs: 100,
                callbacks: {
                    onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: Loss = ${logs.loss}`),
                },
            });
            console.log('Model training completed');
            isModelReady = true;
        } catch (error) {
            console.error('Error training the AI model:', error);
        }
    }

    // Function to predict workout weights
    async function predictWorkout(sets, reps) {
        if (!isModelReady) {
            return "The AI model is still initializing. Please try again later.";
        }
        try {
            const input = tf.tensor2d([[sets, reps]]);
            const prediction = model.predict(input);
            const predictedWeight = prediction.dataSync()[0];
            return `Based on my calculations, I recommend using approximately ${predictedWeight.toFixed(2)} lbs for ${sets} sets of ${reps} reps.`;
        } catch (error) {
            console.error('Error during prediction:', error);
            return "I encountered an error while calculating your suggestion.";
        }
    }

    // Function to store user preferences
    function storeUserData(key, value) {
        userMemory[key] = value;
        console.log(`Stored ${key}: ${value}`);
    }

    // Function to retrieve user preferences
    function retrieveUserData(key) {
        return userMemory[key] || null;
    }

    // Function to provide personalized nutrition advice
    function getNutritionAdvice(goal, weight, activityLevel) {
        let baseCalories = weight * (activityLevel === "high" ? 15 : activityLevel === "moderate" ? 13 : 11);
        if (goal === "bulking") {
            return `To bulk, aim for a daily intake of about ${baseCalories + 500} calories, focusing on protein-rich foods (e.g., chicken, fish, eggs), complex carbs (e.g., oats, rice, sweet potatoes), and healthy fats (e.g., nuts, avocado).`;
        } else if (goal === "cutting") {
            return `To cut, reduce your intake to around ${baseCalories - 500} calories per day. Prioritize lean protein, vegetables, and moderate carbs while avoiding processed sugars.`;
        } else {
            return `To maintain your weight, aim for around ${baseCalories} calories per day, ensuring a balance of macronutrients and staying hydrated.`;
        }
    }

    // Function to provide contextual workout advice
    function getWorkoutAdvice(muscleGroup) {
        const workouts = {
            chest: ["bench press", "push-ups", "chest flys"],
            legs: ["squats", "lunges", "Romanian deadlifts"],
            back: ["pull-ups", "deadlifts", "rows"],
            shoulders: ["shoulder press", "lateral raises", "face pulls"],
            arms: ["bicep curls", "tricep dips", "hammer curls"],
        };
        return workouts[muscleGroup]
            ? `For ${muscleGroup}, I recommend exercises like ${workouts[muscleGroup].join(", ")}. Let me know if you need help with sets, reps, or form.`
            : "I didn’t catch that muscle group. Could you specify chest, legs, back, shoulders, or arms?";
    }

    // Function to handle chat responses
    async function handleChatResponse(message) {
        const normalizedMessage = message.toLowerCase().trim();

        // Reset context if user asks to start over
        if (normalizedMessage.includes("start over") || normalizedMessage.includes("reset")) {
            userContext = "";
            subContext = "";
            return "Okay, let’s start fresh! What do you want to talk about: workouts, nutrition, or motivation?";
        }

        // Determine the main topic
        if (userContext === "") {
            if (normalizedMessage.includes('workout')) {
                userContext = "workout";
                return "Great! Are you looking for exercise suggestions, weight tracking, or training advice?";
            } else if (normalizedMessage.includes('nutrition')) {
                userContext = "nutrition";
                return "Got it. Are you focusing on bulking, cutting, or maintaining?";
            } else if (normalizedMessage.includes('motivation')) {
                userContext = "motivation";
                return getMotivationalQuote();
            } else {
                return "I didn't catch that. Can you ask about workouts, nutrition, or motivation?";
            }
        }

        // Handle workout context
        if (userContext === "workout") {
            if (subContext === "") {
                if (normalizedMessage.includes('exercise')) {
                    subContext = "exercise";
                    return "Which muscle group do you want to focus on? (e.g., chest, legs, back)";
                } else if (normalizedMessage.includes('track')) {
                    subContext = "track";
                    return "Tell me your sets and reps, and I’ll calculate a recommended weight for you.";
                } else {
                    return "Would you like exercise suggestions, weight tracking, or training advice?";
                }
            }

            if (subContext === "exercise") {
                return getWorkoutAdvice(normalizedMessage);
            }

            if (subContext === "track") {
                const numbers = normalizedMessage.match(/\d+/g);
                if (numbers && numbers.length === 2) {
                    const [sets, reps] = numbers.map(Number);
                    return await predictWorkout(sets, reps);
                } else {
                    return "Please provide your sets and reps as numbers. For example, '3 sets of 10 reps'.";
                }
            }
        }

        // Handle nutrition context
        if (userContext === "nutrition") {
            if (subContext === "") {
                if (normalizedMessage.includes('bulking')) {
                    storeUserData("goal", "bulking");
                    return "What’s your current weight and activity level (low, moderate, high)?";
                } else if (normalizedMessage.includes('cutting')) {
                    storeUserData("goal", "cutting");
                    return "What’s your current weight and activity level (low, moderate, high)?";
                } else if (normalizedMessage.includes('maintaining')) {
                    storeUserData("goal", "maintaining");
                    return "What’s your current weight and activity level (low, moderate, high)?";
                } else {
                    return "Are you focusing on bulking, cutting, or maintaining?";
                }
            }

            const goal = retrieveUserData("goal");
            const match = normalizedMessage.match(/\d+/);
            if (goal && match) {
                const weight = parseInt(match[0], 10);
                const activityLevel = normalizedMessage.includes("high") ? "high" : normalizedMessage.includes("moderate") ? "moderate" : "low";
                return getNutritionAdvice(goal, weight, activityLevel);
            } else {
                return "Please provide your weight and activity level (low, moderate, or high).";
            }
        }

        // Default response if no context matches
        return "I'm still learning! Could you provide more details about your question?";
    }

    // Function to provide motivational quotes
    function getMotivationalQuote() {
        const quotes = [
            "The pain you feel today will be the strength you feel tomorrow.",
            "Success is the sum of small efforts, repeated day in and day out.",
            "Don’t limit your challenges. Challenge your limits.",
            "Motivation is what gets you started. Habit is what keeps you going."
        ];
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    // Expose functions globally
    window.initModel = initModel;
    window.trainModel = trainModel;
    window.predictWorkout = predictWorkout;
    window.handleChatResponse = handleChatResponse;

    // Initialize and train the model on startup
    (async () => {
        await initModel();
        await trainModel();
    })();
})();
