import React, { useState } from "react";
import { predictNextWeight } from "./ai-logic";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    // Simulated AI response
    let aiMessage = { sender: "ai", text: "AI is thinking..." };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const response = await predictNextWeight([1, 0, 0, 3, 10, 75]); // Example input
      aiMessage.text = `Based on your input, I recommend ${response.toFixed(2)} lbs.`;
    } catch (err) {
      aiMessage.text = "Sorry, I couldn't process your request.";
      console.error(err);
    }

    setMessages((prev) => [...prev.slice(0, -1), aiMessage]); // Replace "thinking" with actual response
    setUserInput("");
  };

  return (
    <div id="chatbot-modal" className="chatbot-modal">
      <div className="chatbot-content">
        <span onClick={() => (document.getElementById("chatbot-modal").style.display = "none")} className="close">&times;</span>
        <h2>AI Chatbot</h2>
        <div id="chatbot-output">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender}`}>{msg.text}</div>
          ))}
        </div>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your question..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
