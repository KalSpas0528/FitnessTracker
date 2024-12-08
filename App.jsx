import React from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Chatbot from "./Chatbot";

const App = () => {
  return (
    <div className="container">
      <Sidebar />
      <main className="content">
        <Dashboard />
        <Chatbot />
      </main>
    </div>
  );
};

export default App;
