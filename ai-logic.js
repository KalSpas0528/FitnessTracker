(function () {
    console.log('Initializing Titan AI...');

    let model = null;
    let isModelReady = false;
    let userContext = ""; // Track user intent (e.g., "workout", "nutrition", etc.)

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
            const trainingData = tf.tensor2d([[3, 10], [4, 8], [5, 5]]);
            const targetData = tf.tensor2d([[50], [60], [80]]);
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
            return "The model is still initializing. Please try again later.";
        }
        try {
            const input = tf.tensor2d([[sets, reps]]);
            const prediction = model.predict(input);
            const predictedWeight = prediction.dataSync()[0];
            return `Recommended weight: ${predictedWeight.toFixed(2)} lbs for ${sets} sets of ${reps} reps.`;
        } catch (error) {
            console.error('Error during prediction:', error);
            return "I encountered an error while processing your request.";
        }
    }

    // Function to handle chat responses
    async function handleChatResponse(message) {
        if (!isModelReady) {
            return "Titan AI: The AI module is still initializing. Please try again later.";
        }

        // Update user context based on input
        if (message.includes('workout')) {
            userContext = "workout";
            return "I can suggest exercises or track your progress. What would you like help with?";
        } else if (message.includes('nutrition')) {
            userContext = "nutrition";
            return "I can assist with tracking your calorie intake and macros. Ask me anything!";
        } else if (message.includes('motivation')) {
            userContext = "motivation";
            const quotes = [
                "The only bad workout is the one that didn't happen.",
                "Your body can stand almost anything. It's your mind that you have to convince.",
                "The pain you feel today will be the strength you feel tomorrow.",
            ];
            return quotes[Math.floor(Math.random() * quotes.length)];
        }

        // Handle follow-ups based on context
        if (userContext === "workout") {
            return "Would you like exercise suggestions or help with tracking sets and reps?";
        } else if (userContext === "nutrition") {
            return "Do you need help with gaining weight, losing weight, or meal planning?";
        }

        // Default response
        return "I'm still learning! Can you ask something specific about workouts, nutrition, or motivation?";
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
