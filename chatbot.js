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
// Function to send a message and get a response from the AI
function sendMessageToAI(userInput) {
    // Example function that could call an AI model or process the input
    let aiResponse = "This is a placeholder for AI's response based on " + userInput;
    displayAIResponse(aiResponse);
}

// Function to display the AI's response in the modal
function displayAIResponse(response) {
    const responseContainer = document.getElementById('chatbot-response-container');
    const newMessage = document.createElement('p');
    newMessage.textContent = response;
    responseContainer.appendChild(newMessage);
}

// Add event listener for sending messages
document.getElementById('send-message-btn').addEventListener('click', function () {
    const userInput = document.getElementById('user-input').value;
    sendMessageToAI(userInput);
});
// Toggle Chatbot Modal
const chatbotButton = document.getElementById('chatbotButton');
const chatbotModal = document.getElementById('chatbotModal');
const closeButton = document.querySelector('.close-button');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotOutput = document.getElementById('chatbotOutput');
const sendChatbotMessage = document.getElementById('sendChatbotMessage');

chatbotButton.onclick = () => chatbotModal.style.display = 'block';
closeButton.onclick = () => chatbotModal.style.display = 'none';

// Send Message to Chatbot
sendChatbotMessage.onclick = () => {
  const userInput = chatbotInput.value;
  chatbotOutput.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
  generateResponse(userInput);
  chatbotInput.value = '';
};

// Simple AI response based on input
function generateResponse(input) {
  let response;

  if (input.includes('recommendation')) {
    response = 'Here’s a workout suggestion based on your recent logs!';
    // Integrate with your actual workout data logic here
  } else {
    response = "I'm here to help! Ask about your workout history or goals.";
  }

  chatbotOutput.innerHTML += `<p><strong>Titan AI:</strong> ${response}</p>`;
}
