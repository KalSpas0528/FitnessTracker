import * as tf from '@tensorflow/tfjs';

// Example Training Data
const trainingData = tf.tensor2d([
    [1, 0, 0, 3, 10, 75], // Example: Exercise (Lat Pulldown)
    [0, 1, 0, 4, 12, 90], // Example: Exercise (Bench Press)
    [0, 0, 1, 3, 10, 25], // Example: Exercise (Hammer Curls)
]);

const outputData = tf.tensor2d([
    [80], // Recommendation for Lat Pulldown
    [100], // Recommendation for Bench Press
    [30], // Recommendation for Hammer Curls
]);

// Model Initialization
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [6], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1 })); // Output layer for predictions

model.compile({ optimizer: tf.train.adam(), loss: 'meanSquaredError' });

// Train Model
async function trainModel() {
    await model.fit(trainingData, outputData, {
        epochs: 50,
        batchSize: 4,
        callbacks: {
            onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: Loss = ${logs.loss}`),
        },
    });
    console.log("Model training complete.");
}

// Generate AI Response
async function generateAIResponse(input) {
    try {
        const inputTensor = tf.tensor2d([input]);
        const prediction = model.predict(inputTensor);
        const response = prediction.dataSync()[0];
        inputTensor.dispose();
        prediction.dispose();
        return `Based on your input, I recommend ${response.toFixed(2)} lbs.`;
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "I'm sorry, I couldn't process your request.";
    }
}

export { trainModel, generateAIResponse };
