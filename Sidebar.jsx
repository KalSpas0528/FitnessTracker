import React from "react";

const Sidebar = () => {
  const handleButtonClick = (sectionId) => {
    document.querySelectorAll("section").forEach((section) =>
      section.classList.add("hidden")
    );
    document.getElementById(sectionId).classList.remove("hidden");
  };

  return (
    <nav className="sidebar">
      <div className="account-info">
        <img src="https://via.placeholder.com/30" alt="Account Icon" className="account-icon" />
        <span id="login-status">Logged Out</span>
      </div>
      <ul>
        <li><button onClick={() => handleButtonClick("dashboard")}>Dashboard</button></li>
        <li><button onClick={() => handleButtonClick("workout-form-section")}>Add Workout</button></li>
        <li><button onClick={() => handleButtonClick("nutrition-section")}>Nutrition</button></li>
        <li><button onClick={() => handleButtonClick("motivation-section")}>Motivation</button></li>
        <li><button onClick={() => handleButtonClick("login-section")}>Login</button></li>
        <li><button onClick={() => handleButtonClick("signup-section")}>Signup</button></li>
        <li><button onClick={() => document.getElementById("chatbot-modal").style.display = "flex"}>Chat with Titan AI</button></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
