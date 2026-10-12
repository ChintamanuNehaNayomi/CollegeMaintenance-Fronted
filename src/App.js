import Register from "./Register";
import React, { useState } from "react";
import StudentDashboard from "./StudentDashboard";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
if (window.location.pathname === "/register") {
  return <Register />;
}
  if (window.location.pathname === "/student") {
    return <StudentDashboard />;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("Signing in...");

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("username", username);
        window.location.href = "/student";
      } else {
        setMessage("Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend.");
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
          <h2>Welcome Back!</h2>
          <p className="login-subtitle">
            Sign in to access your student account.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-submit">
              Sign In
            </button>
          </form>

          {message && <p className="login-message">{message}</p>}

          <p className="register-link">
            New student? <a href="/register">Create an account</a>
          </p>
        </div>

        <p className="login-footer">
          CampusCare · Making our campus better
        </p>
      </div>
    </div>
  );
}

export default App;
