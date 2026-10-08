import React, { useState } from "react";
import MaintenanceRequest from "./MaintenanceRequest";
import MyRequests from "./MyRequests";

function StudentDashboard() {

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);

  const logout = () => {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");

    window.location.href = "/";
  };

  if (showRequestForm) {
    return (
      <div>

        <MaintenanceRequest />

        <br />

        <button onClick={() => setShowRequestForm(false)}>
          Back to Dashboard
        </button>

      </div>
    );
  }

  if (showMyRequests) {
    return (
      <div>

        <MyRequests />

        <br />

        <button onClick={() => setShowMyRequests(false)}>
          Back to Dashboard
        </button>

      </div>
    );
  }

  return (
    <div>

      <h1>College Maintenance Request System</h1>

      <h2>Student Dashboard</h2>

      <p>Welcome to your dashboard!</p>

      <hr />

      <h3>Maintenance Requests</h3>

      <button onClick={() => setShowRequestForm(true)}>
        Submit Maintenance Request
      </button>

      <br />
      <br />

      <button onClick={() => setShowMyRequests(true)}>
        View My Requests
      </button>

      <br />
      <br />

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default StudentDashboard;