
import React, { useState } from "react";
import "./App.css";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage(
      "Your form is ready! Account creation will work after backend connection."
    );
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">🏫</div>
          <h1>CampusCare</h1>
          <p>College Maintenance Request System</p>
        </div>

        <div className="login-content">
          <h2>Create Account</h2>
          <p className="login-subtitle">
            Register to report and track campus maintenance issues.
          </p>

          <form onSubmit={handleRegister}>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="newUsername">Username</label>
            <input
              id="newUsername"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="newPassword">Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />

            <button type="submit" className="login-submit">
              Create Account
            </button>
          </form>

          {message && (
            <p className="login-message" role="status">
              {message}
            </p>
          )}

          <p className="register-link">
            Already have an account? <a href="/">Sign In</a>
          </p>
        </div>

        <p className="login-footer">
          CampusCare · Making our campus better
        </p>
      </div>
    </div>
  );
}

export default Register;
