import React from "react";

const Dashboard = () => {
  return (
    <section id="dashboard">
      <h2>Your Workouts</h2>
      <div id="workout-list"></div>
      <canvas id="workoutProgressChart" width="400" height="200"></canvas>
    </section>
  );
};

export default Dashboard;
