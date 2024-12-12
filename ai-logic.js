(function () {
    console.log('Initializing Titan AI...');

    let model = null;
    let isModelReady = false;
    let userContext = ""; // To track the ongoing topic ("workout", "nutrition", etc.)
    let subContext = ""; // To track deeper intents within the topic

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
            const trainingData = tf.tensor2d([[3, 10], [4, 8], [5, 5]]); // Example: sets, reps
            const targetData = tf.tensor2d([[50], [60], [80]]); // Example: recommended weights
            console.log('Training the model...');
            await model.fit(trainingData, targetData, {
                epochs: 50,
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

    // Function to handle chat responses
    async function handleChatResponse(message) {
        // Normalize input for easier comparison
        const normalizedMessage = message.toLowerCase().trim();

        // Start by determining the main topic
        if (userContext === "") {
            if (normalizedMessage.includes('workout')) {
                userContext = "workout";
                return "Great! Are you looking for exercise suggestions, weight tracking, or training advice?";
            } else if (normalizedMessage.includes('nutrition')) {
                userContext = "nutrition";
                return "Got it. Are you focusing on bulking, cutting, or maintaining?";
            } else if (normalizedMessage.includes('motivation')) {
                userContext = "motivation";
                return "Let me share a motivational quote: 'The pain you feel today will be the strength you feel tomorrow.' What else can I help with?";
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

        // Default response if nothing matches
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
