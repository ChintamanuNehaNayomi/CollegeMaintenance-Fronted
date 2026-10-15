
import React, { useState } from "react";
import MaintenanceRequest from "./MaintenanceRequest";
import MyRequests from "./MyRequests";
import { clearAuthentication } from "./auth";
import "./App.css";

function StudentDashboard() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);

  const logout = () => {
    clearAuthentication();
    window.location.href = "/";
  };

  if (showRequestForm) {
    return (
      <div className="dashboard-page">
        <MaintenanceRequest />
        <button
          className="back-button"
          onClick={() => setShowRequestForm(false)}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (showMyRequests) {
    return (
      <div className="dashboard-page">
        <MyRequests />
        <button
          className="back-button"
          onClick={() => setShowMyRequests(false)}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const username = localStorage.getItem("username") || "Student";

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>CampusCare</h1>
          <p>College Maintenance Request System</p>
        </div>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <p className="eyebrow">STUDENT PORTAL</p>
          <h2>Welcome, {username}! 👋</h2>
          <p>
            A better campus starts with you. Report maintenance issues
            and keep track of your requests in one place.
          </p>
        </section>

        <h2 className="section-title">Your Maintenance Services</h2>

        <div className="dashboard-cards">
          <article className="dashboard-card">
            <div className="card-icon">🛠️</div>
            <h3>Report an Issue</h3>
            <p>
              Report problems with classrooms, electrical equipment,
              plumbing, furniture, and other campus facilities.
            </p>
            <button
              className="primary-button"
              onClick={() => setShowRequestForm(true)}
            >
              Submit Request →
            </button>
          </article>

          <article className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Track Your Requests</h3>
            <p>
              View your submitted maintenance requests and check their
              current status.
            </p>
            <button
              className="secondary-button"
              onClick={() => setShowMyRequests(true)}
            >
              View My Requests →
            </button>
          </article>
        </div>

        <section className="info-banner">
          <span>💡</span>
          <div>
            <h3>Help us improve your campus</h3>
            <p>
              Provide clear details when reporting an issue so the
              maintenance team can understand the problem.
            </p>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        CampusCare · College Maintenance Request System
      </footer>
    </div>
  );
}

export default StudentDashboard;
