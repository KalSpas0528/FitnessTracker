import React from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";

const App = () => {
  return (
    <div className="container">
      <Sidebar />
      <main className="content">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
