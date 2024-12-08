let model;

// TensorFlow.js model initialization
async function initModel() {
    model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    console.log("AI model initialized");
}

// Train the model with existing workout data
async function trainModel(workouts) {
    if (workouts.length < 5) {
        console.log("Not enough data to train the model");
        return;
    }

    const tensorData = tf.tensor2d(workouts.map(w => [w.sets, w.reps, w.weight, 1]));
    const tensorLabels = tf.tensor2d(workouts.map(w => [w.weight]));

    await model.fit(tensorData, tensorLabels, {
        epochs: 50,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
            }
        }
    });

    console.log("Model training complete");
}

// Predict next weight for a given exercise
async function predictNextWeight(sets, reps) {
    const input = tf.tensor2d([[sets, reps, 0, 1]]);
    const prediction = model.predict(input);
    const result = await prediction.data();
    return Math.round(result[0]);
}

export { initModel, trainModel, predictNextWeight };

