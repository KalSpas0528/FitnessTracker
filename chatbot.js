document.addEventListener("DOMContentLoaded", function () {
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotOutput = document.getElementById("chatbot-output");
    const chatbotForm = document.getElementById("chatbot-form");
    const chatbotModal = document.getElementById("chatbot-modal");
    const closeModalBtn = document.getElementById("close-chatbot-modal");

    // Load the TensorFlow.js model
    let model;

    async function loadModel() {
        model = await tf.loadGraphModel('://youhttpsr-model-url/model.json');
        console.log("Model Loaded");
    }

    // Call load model on page load
    loadModel();

    // Handle form submission
    chatbotForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const userInput = chatbotInput.value.trim();

        if (userInput) {
            chatbotOutput.innerHTML = `You asked: ${userInput}<br>AI is generating a response...`;

            // Send the user input to the model
            const aiResponse = await getAIResponse(userInput);
            chatbotOutput.innerHTML = `AI: ${aiResponse}`;
        }
    });

    // Function to interact with the TensorFlow.js model
    async function getAIResponse(userInput) {
        // Preprocess the input text
        const inputTensor = preprocessInput(userInput);

        // Run the model
        const prediction = await model.executeAsync(inputTensor);
        
        // Post-process the prediction (this depends on your model's output)
        const outputText = postprocessOutput(prediction);

        return outputText;
    }

    // Example of input preprocessing (to match model's expected input format)
    function preprocessInput(input) {
        // TensorFlow.js expects the input as a tensor. Here we simulate this.
        return tf.tensor([input]);  // You need to adapt based on your model
    }

    // Example of output post-processing (convert model output to text)
    function postprocessOutput(prediction) {
        // Assuming the prediction is a tensor with text output.
        const output = prediction.dataSync();  // Convert tensor to array
        return output.join(" ");  // Join the output into a string
    }

    // Open the chatbot modal
    const aiRecommendationBtn = document.getElementById("ai-recommendation-btn");
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
});
document.getElementById("sendButton").addEventListener("click", function() {
    const userInput = document.getElementById("userInput").value;
    if (userInput.trim() === "") {
      alert("Please enter a message.");
      return;
    }
  
    // Clear the input box
    document.getElementById("userInput").value = "";
  
    // Display user's message in chat
    const userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user-message");
    userMessage.textContent = userInput;
    document.getElementById("chatBox").appendChild(userMessage);
  
    // Call the AI model (assuming it's set up with TensorFlow.js)
    getAIResponse(userInput);
  });
  
  async function getAIResponse(userMessage) {
    // Fetch AI response (assuming model loaded)
    const modelResponse = await generateAIResponse(userMessage); // Replace with actual function
    
    // Display AI response in chat
    const aiMessage = document.createElement("div");
    aiMessage.classList.add("chat-message", "ai-message");
    aiMessage.textContent = modelResponse;
    document.getElementById("chatBox").appendChild(aiMessage);
  }
  
  async function generateAIResponse(userMessage) {
    // Logic for sending input to AI model and returning response
    // For now, you can use a dummy response:
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("AI response to: " + userMessage); // Replace this with real AI processing logic
      }, 1000);
    });
  }
  