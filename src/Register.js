import React, { useState } from "react";
import API_BASE_URL from "./api";
import "./App.css";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setMessage("Creating your account...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), username: username.trim(), email: email.trim(), password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "Registration failed. Try another username or email.");
        return;
      }

      setMessage("Account created successfully! Redirecting to sign in...");
      window.setTimeout(() => { window.location.href = "/"; }, 900);
    } catch {
      setMessage("Unable to connect to backend. Make sure the backend is running.");
    } finally {
      setSubmitting(false);
    }
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
            <input id="fullName" type="text" placeholder="Enter your full name"
              value={name} onChange={(e) => setName(e.target.value)} required />

            <label htmlFor="newUsername">Username</label>
            <input id="newUsername" type="text" placeholder="Choose a username"
              value={username} onChange={(e) => setUsername(e.target.value)} required />

            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" placeholder="Enter your email address"
              value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="newPassword">Password</label>
            <input id="newPassword" type="password" placeholder="Create a password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              minLength={6} required />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" placeholder="Enter your password again"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6} required />

            <button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {message && <p className="login-message" role="status">{message}</p>}

          <p className="register-link">
            Already have an account? <a href="/">Sign In</a>
          </p>
        </div>

        <p className="login-footer">CampusCare · Making our campus better</p>
      </div>
    </div>
  );
}

export default Register;
