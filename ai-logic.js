(function () {
    console.log('Initializing Titan AI...');

    let model = null;
    let isModelReady = false;
    let userContext = null; // Context: 'workout', 'nutrition', 'motivation'
    let chatHistory = []; // To track conversation flow

    // Initialize the AI model
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

    // Train the AI model
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

    // Predict workout weights
    async function predictWorkout(sets, reps) {
        if (!isModelReady) {
            return "The model is still initializing. Please try again later.";
        }
        try {
            const input = tf.tensor2d([[sets, reps]]);
            const prediction = model.predict(input);
            const predictedWeight = prediction.dataSync()[0];
            return `Based on your input, I recommend ${predictedWeight.toFixed(2)} lbs for ${sets} sets of ${reps} reps.`;
        } catch (error) {
            console.error('Error during prediction:', error);
            return "I encountered an error while processing your request.";
        }
    }

    // Handle chat responses
    async function handleChatResponse(message) {
        chatHistory.push(message.toLowerCase());

        if (!isModelReady) {
            return "Titan AI: The AI module is still initializing. Please try again later.";
        }

        if (message.includes('workout')) {
            userContext = 'workout';
            return "Great! I can suggest exercises or track your progress. Do you want exercise suggestions or weight tracking?";
        } else if (message.includes('nutrition')) {
            userContext = 'nutrition';
            return "Let's talk nutrition. Are you looking for meal plans, calorie tracking, or bulking tips?";
        } else if (message.includes('motivation')) {
            userContext = 'motivation';
            const quotes = [
                "Push yourself, because no one else is going to do it for you.",
                "Success starts with self-discipline.",
                "Wake up with determination. Go to bed with satisfaction.",
            ];
            return quotes[Math.floor(Math.random() * quotes.length)];
        }

        // Handle context-specific follow-ups
        if (userContext === 'workout') {
            if (message.includes('track')) {
                const input = message.match(/(\d+)\s+sets.*?(\d+)\s+reps/i);
                if (input) {
                    const sets = parseInt(input[1]);
                    const reps = parseInt(input[2]);
                    return await predictWorkout(sets, reps);
                }
                return "Tell me the number of sets and reps, and I'll recommend a weight for you.";
            }
            return "Would you like help with sets, reps, or exercise suggestions?";
        } else if (userContext === 'nutrition') {
            return "Do you need advice on meal plans or tracking macros?";
        }

        // Fallback response
        return "I didn't catch that. Can you ask about workouts, nutrition, or motivation?";
    }

    // Expose functions globally
    window.initModel = initModel;
    window.trainModel = trainModel;
    window.predictWorkout = predictWorkout;
    window.handleChatResponse = handleChatResponse;

    // Initialize and train the model
    (async () => {
        await initModel();
        await trainModel();
    })();
})();
