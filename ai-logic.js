// Simple AI model using TensorFlow.js
(function() {
    console.log('Initializing AI system...');

    // Initialize TensorFlow model
    async function initModel() {
        try {
            const model = tf.sequential();
            model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
            model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
            console.log('AI model initialized successfully');
            return model;
        } catch (error) {
            console.error('Error initializing AI model:', error);
            return null;
        }
    }

 // AI logic for predicting workout weights using TensorFlow.js
(function () {
    console.log('Initializing AI system...');

    let model = null;

    // Function to initialize or load the model
    async function initModel() {
        try {
            // Create a sequential model
            model = tf.sequential();

            // Add a hidden layer and an output layer
            model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [2] })); // Input: sets, reps
            model.add(tf.layers.dense({ units: 1 })); // Output: recommended weight

            // Compile the model
            model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

            console.log('AI model initialized successfully');
            return model;
        } catch (error) {
            console.error('Error initializing AI model:', error);
            return null;
        }
    }

    // Function to train the model with sample data
    async function trainModel() {
        try {
            if (!model) {
                console.error('Model is not initialized');
                return;
            }

            // Example training data: [sets, reps] -> [weight]
            const trainingData = tf.tensor2d([
                [3, 10], // 3 sets, 10 reps
                [4, 8],  // 4 sets, 8 reps
                [5, 5],  // 5 sets, 5 reps
            ]);
            const targetData = tf.tensor2d([
                [50], // Expected weight
                [60],
                [80],
            ]);

            // Train the model
            console.log('Training the model...');
            await model.fit(trainingData, targetData, {
                epochs: 100,
                callbacks: {
                    onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: Loss = ${logs.loss}`),
                },
            });
            console.log('Model training completed');
        } catch (error) {
            console.error('Error training the AI model:', error);
        }
    }

    // Function to make predictions
    async function predictWorkout(sets, reps) {
        try {
            if (!model) {
                console.error('Model is not initialized');
                return null;
            }

            // Input for prediction: [sets, reps]
            const input = tf.tensor2d([[sets, reps]]);
            const prediction = model.predict(input);

            // Extract and return the predicted value
            const predictedWeight = prediction.dataSync()[0];
            console.log(`Predicted weight for ${sets} sets of ${reps} reps: ${predictedWeight} lbs`);
            return predictedWeight;
        } catch (error) {
            console.error('Prediction error:', error);
            return null;
        }
    }

    // Expose functions globally
    window.initModel = initModel;
    window.trainModel = trainModel;
    window.predictWorkout = predictWorkout;

    // Initialize and train the model on startup
    (async () => {
        await initModel();
        await trainModel();
    })();
})();

} )
 