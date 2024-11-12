// chatbot.js

document.addEventListener('DOMContentLoaded', function () {
    // Get chatbot input and output elements
    const chatInput = document.getElementById('chat-input');
    const chatOutput = document.getElementById('chat-output');
    const sendBtn = document.getElementById('send-btn');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', function () {
            const userMessage = chatInput.value;
            if (userMessage.trim() !== "") {
                displayMessage(userMessage, 'user');
                getAIResponse(userMessage);
                chatInput.value = ''; // Clear input field
            }
        });
    }

    // Display message in chat window
    function displayMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.textContent = message;
        chatOutput.appendChild(messageDiv);
    }

    // Send user input to AI for response and display
    async function getAIResponse(userMessage) {
        const aiMessage = await fetchAIResponse(userMessage);
        displayMessage(aiMessage, 'ai');
    }

    // Simulated AI response (can be customized further)
    async function fetchAIResponse(userMessage) {
        // Simple keyword-based responses for demonstration
        if (userMessage.toLowerCase().includes('meal')) {
            return 'How about trying a balanced meal of grilled chicken, quinoa, and steamed veggies?';
        } else if (userMessage.toLowerCase().includes('exercise')) {
            return 'How about a quick 20-minute HIIT workout? It’ll help burn calories and build strength.';
        } else if (userMessage.toLowerCase().includes('help')) {
            return 'I can give workout suggestions, meal ideas, or tips. How can I assist you today?';
        } else {
            return 'Sorry, I didn’t understand that. Can you please clarify?';
        }
    }
});
