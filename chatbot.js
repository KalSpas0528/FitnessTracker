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

        // Here, you would normally send this embedding to a backend for further processing,
        // but for now, let's just simulate a basic response based on the similarity of embeddings
        const response = getResponseBasedOnEmbedding(embeddings);
        return response;
    };

    // Simulated response function
    const getResponseBasedOnEmbedding = (embedding) => {
        // This would ideally compare embeddings to known responses or intent classifications
        // For simplicity, we're just returning a generic response.
        return "I'm still learning! I'll get better at this.";
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
