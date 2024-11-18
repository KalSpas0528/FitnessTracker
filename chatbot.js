document.addEventListener("DOMContentLoaded", async function () {
    // Load the pre-trained model from TensorFlow.js
    const model = await tf.loadGraphModel('https://tfhub.dev/google/universal-sentence-encoder/4');

    // Get references to the input/output elements
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotOutput = document.getElementById("chatbot-output");
    const chatbotForm = document.getElementById("chatbot-form");
    const chatbotModal = document.getElementById("chatbot-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");

    // Open the chatbot modal
    const openChatbotModal = () => {
        chatbotModal.style.display = "block";
    };

    // Close the chatbot modal
    const closeChatbotModal = () => {
        chatbotModal.style.display = "none";
    };

    // Event listener for the close button on the chatbot modal
    closeModalBtn.addEventListener("click", closeChatbotModal);

    // Function to process user input and generate a response
    const getChatbotResponse = async (inputText) => {
        // Convert the input text into a tensor using the Universal Sentence Encoder
        const embeddings = await model.embed([inputText]);

        // Here, we’ll simulate a response based on the embedding (for simplicity)
        const response = generateSimpleResponse(inputText);
        return response;
    };

    // Simple response generator based on input
    const generateSimpleResponse = (inputText) => {
        // In a real scenario, this would process the input text to find a response
        return `You said: "${inputText}". I'm learning to respond better!`;
    };

    // Event listener for the chatbot form submission
    chatbotForm.addEventListener("submit", async (e) => {
        e.preventDefault();  // Prevent page reload on form submission

        const inputText = chatbotInput.value;
        chatbotInput.value = "";  // Clear the input field

        if (inputText.trim()) {
            chatbotOutput.innerHTML = "Thinking...";

            // Get the chatbot's response
            const response = await getChatbotResponse(inputText);

            // Display the response in the chatbot modal
            chatbotOutput.innerHTML = response;
        } else {
            chatbotOutput.innerHTML = "Please type something.";
        }
    });

    // Open chatbot when the button is clicked
    const chatbotButton = document.getElementById("chatbot-button");
    chatbotButton.addEventListener("click", openChatbotModal);
});
