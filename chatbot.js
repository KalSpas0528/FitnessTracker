document.addEventListener("DOMContentLoaded", function () {
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotOutput = document.getElementById("chatbot-output");
    const chatbotForm = document.getElementById("chatbot-form");
    const chatbotModal = document.getElementById("chatbot-modal");
    const closeModalBtn = document.getElementById("close-chatbot-modal");
    const aiRecommendationBtn = document.getElementById("ai-recommendation-btn");

    // TensorFlow.js model variable
    let model;

    // Load the TensorFlow.js model
    async function loadModel() {
        try {
            model = await tf.loadGraphModel('https://your-model-url/model.json'); // Replace with actual model URL
            console.log("Model Loaded Successfully");
        } catch (error) {
            console.error("Error loading the AI model:", error);
        }
    }

    // Call load model on page load
    loadModel();

    // Open the chatbot modal
    if (aiRecommendationBtn) {
        aiRecommendationBtn.addEventListener("click", function () {
            chatbotModal.style.display = 'block';
        });
    }

    // Close chatbot modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function () {
            chatbotModal.style.display = 'none';
        });
    }

    // Close chatbot modal if clicked outside of it
    window.addEventListener("click", function (event) {
        if (event.target === chatbotModal) {
            chatbotModal.style.display = 'none';
        }
    });

    // Handle form submission
    chatbotForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userInput = chatbotInput.value.trim();
        if (!userInput) {
            chatbotOutput.innerHTML = "Please enter a message.";
            return;
        }

        // Show user input and loading message
        chatbotOutput.innerHTML = `You asked: ${userInput}<br>AI is generating a response...`;

        try {
            // Get AI response
            const aiResponse = await getAIResponse(userInput);
            chatbotOutput.innerHTML = `AI: ${aiResponse}`;
        } catch (error) {
            console.error("Error generating AI response:", error);
            chatbotOutput.innerHTML = "AI: Sorry, I couldn't process your request. Please try again.";
        }
    });

    // Function to interact with the TensorFlow.js model
    async function getAIResponse(userInput) {
        if (!model) {
            throw new Error("Model not loaded");
        }

        // Preprocess input
        const inputTensor = preprocessInput(userInput);

        // Run the model and post-process output
        const prediction = await model.executeAsync(inputTensor);
        const response = postprocessOutput(prediction);

        return response;
    }

    // Example of input preprocessing (adapt to your model's requirements)
    function preprocessInput(input) {
        // Convert text input into a TensorFlow.js tensor
        // Replace this example with preprocessing suitable for your model
        return tf.tensor([input.length]); // Example only (length of input)
    }

    // Example of output post-processing
    function postprocessOutput(prediction) {
        // Convert model output tensor into meaningful text
        const output = prediction.dataSync(); // Get tensor data
        return `Prediction: ${Array.from(output).join(", ")}`; // Example processing
    }
});
