(function () {
    console.log('Initializing Titan AI...');

    let model = null;
    let isModelReady = false;
    let userContext = ""; // Main topic (e.g., "workout", "nutrition")
    let subContext = ""; // Sub-topic (e.g., "exercise", "track")

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
            ]); // Expanded: sets, reps
            const targetData = tf.tensor2d([
                [50], [60], [80], [70], [40]
            ]); // Expanded: recommended weights
            console.log('Training the model...');
            await model.fit(trainingData, targetData, {
                epochs: 100, // Increased epochs for better training
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

    // Function to provide nutrition advice
    function getNutritionAdvice(goal) {
        if (goal === "bulking") {
            return "For bulking, aim for a calorie surplus with plenty of protein (e.g., chicken, fish, eggs), carbs (e.g., rice, potatoes), and healthy fats (e.g., nuts, avocado).";
        } else if (goal === "cutting") {
            return "For cutting, focus on a calorie deficit while maintaining protein intake to preserve muscle. Include leafy greens and lean protein.";
        } else if (goal === "maintaining") {
            return "To maintain, eat at your maintenance calories with a balanced mix of protein, carbs, and fats. Avoid processed foods when possible.";
        } else {
            return "I can help you with bulking, cutting, or maintaining. Let me know your goal!";
        }
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
                if (normalizedMessage.includes('chest')) {
                    return "For chest, I recommend bench press, push-ups, and chest flys. How many sets and reps would you like advice on?";
                } else if (normalizedMessage.includes('legs')) {
                    return "For legs, I recommend squats, lunges, and Romanian deadlifts. Need help with sets and weights?";
                } else {
                    return "Let me know which muscle group you're working on! (e.g., chest, legs, back)";
                }
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
                    return getNutritionAdvice("bulking");
                } else if (normalizedMessage.includes('cutting')) {
                    return getNutritionAdvice("cutting");
                } else if (normalizedMessage.includes('maintaining')) {
                    return getNutritionAdvice("maintaining");
                } else {
                    return "Are you focusing on bulking, cutting, or maintaining?";
                }
            }
        }

        // Handle motivation context
        if (userContext === "motivation") {
            return getMotivationalQuote();
        }

        // Default response if no context matches
        return "I'm still learning! Could you provide more details about your question?";
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
