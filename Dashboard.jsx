import React from "react";

const Dashboard = () => {
  return (
    <section id="dashboard" className="dashboard-section">
      <div className="dashboard-header">
        <h1>Welcome to Your Fitness Dashboard</h1>
        <p>Track your progress and stay motivated!</p>
      </div>
      <div className="dashboard-content">
        <div className="workout-summary">
          <h2>Your Workouts</h2>
          <div id="workout-list"></div>
          <canvas id="workoutProgressChart" width="400" height="200"></canvas>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
