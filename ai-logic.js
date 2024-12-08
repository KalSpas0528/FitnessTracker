
import * as tf from '@tensorflow/tfjs';

// Example Training Data
// Columns: [Exercise (one-hot), Sets, Reps, Weight] -> [Recommended Weight]
const trainingData = tf.tensor2d([
    [1, 0, 0, 3, 10, 75], // Lat Pulldowns: 3 sets, 10 reps, 75 lbs
    [0, 1, 0, 4, 12, 90], // Bench Press: 4 sets, 12 reps, 90 lbs
    [0, 0, 1, 3, 10, 25], // Hammer Curls: 3 sets, 10 reps, 25 lbs
]);

const outputData = tf.tensor2d([
    [80], // Recommendation for Lat Pulldowns
    [100], // Recommendation for Bench Press
    [30], // Recommendation for Hammer Curls
]);

// Define the Model Architecture
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [6], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1 })); // Output layer for recommended weight

model.compile({
    optimizer: tf.train.adam(),
    loss: 'meanSquaredError',
});

// Train the Model
async function trainModel() {
    await model.fit(trainingData, outputData, {
        epochs: 50,
        batchSize: 4,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch}: Loss = ${logs.loss}`);
            },
        },
    });
    console.log('Model training complete');
}

// Predict the next weight for an input
async function predictNextWeight(inputData) {
    const inputTensor = tf.tensor2d([inputData]);
    const prediction = model.predict(inputTensor);
    const predictedWeight = prediction.dataSync()[0];
    inputTensor.dispose();
    prediction.dispose();
    return predictedWeight;
}

// Example Usage
(async () => {
    await trainModel();

    // Predict for a new workout [Exercise: Bench Press, 4 sets, 10 reps, 95 lbs]
    const newWorkout = [0, 1, 0, 4, 10, 95];
    const recommendation = await predictNextWeight(newWorkout);
    console.log(`Recommended next weight: ${recommendation} lbs`);
})();

// Export functions for use in other parts of your app (optional if needed elsewhere)
export { trainModel, predictNextWeight };
