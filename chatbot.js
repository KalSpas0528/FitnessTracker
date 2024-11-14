document.addEventListener("DOMContentLoaded", function () {
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotOutput = document.getElementById("chatbot-output");
    const chatbotForm = document.getElementById("chatbot-form");
    const chatbotModal = document.getElementById("chatbot-modal");
    const closeModalBtn = document.getElementById("close-chatbot-modal");

    // Handle form submission
    chatbotForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const userInput = chatbotInput.value.trim();

        if (userInput) {
            chatbotOutput.innerHTML = `You asked: ${userInput}<br>AI is generating a response...`;

            // Simulate response (can replace with real AI)
            setTimeout(function () {
                const aiResponse = generateAIResponse(userInput);
                chatbotOutput.innerHTML = `AI: ${aiResponse}`;
            }, 1500);
        }
    });

    // Simple AI response generator
    function generateAIResponse(userInput) {
        if (userInput.toLowerCase().includes("workout")) {
            return "Try focusing on compound exercises like squats and deadlifts to build strength.";
        } else if (userInput.toLowerCase().includes("nutrition")) {
            return "Ensure you're getting enough protein, around 1g per pound of body weight for muscle growth.";
        } else {
            return "Please specify if you need help with workouts or nutrition!";
        }
    }

    // Open the chatbot modal
    const aiRecommendationBtn = document.getElementById("ai-recommendation-btn");
    if (aiRecommendationBtn) {
        aiRecommendationBtn.addEventListener("click", function () {
            chatbotModal.style.display = 'block';
        });
    }

    // Close the chatbot modal
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