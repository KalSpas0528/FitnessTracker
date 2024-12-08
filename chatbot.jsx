import * as tf from '@tensorflow/tfjs';

const trainingData = tf.tensor2d([
    [1, 0, 0, 3, 10, 75], // Example inputs
]);
const outputData = tf.tensor2d([[80]]); // Example output

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [6], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1 }));

model.compile({ optimizer: tf.train.adam(), loss: 'meanSquaredError' });

export async function trainModel() {
    await model.fit(trainingData, outputData, { epochs: 10 });
}

export async function handleChatResponse(userInput) {
    // Example input parsing logic (update as needed)
    const inputData = [1, 0, 0, 3, 10, 75];
    const inputTensor = tf.tensor2d([inputData]);
    const prediction = model.predict(inputTensor).dataSync()[0];
    return `Based on your input, I recommend ${prediction.toFixed(2)} lbs.`;
}
