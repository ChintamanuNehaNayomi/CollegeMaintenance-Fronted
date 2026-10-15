import React, { useState } from "react";
import API_BASE_URL from "./api";
import { ROLE_DASHBOARD_PATHS, clearAuthentication } from "./auth";

const ROLE_LABELS = {
  STUDENT: "Student",
  STAFF: "Staff",
  ADMIN: "Admin",
};

function LoginPage({ role }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const label = ROLE_LABELS[role];

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);
    clearAuthentication();

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username: username.trim(), password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.accessToken) {
        if (response.status === 401) {
          setMessage(data.message || "Invalid username or password.");
        } else if (response.status >= 500) {
          setMessage("The sign-in service is temporarily unavailable. Please try again later.");
        } else if (!response.ok) {
          setMessage(
            data.message || `Unable to sign in (error ${response.status}).`
          );
        } else {
          setMessage("The server returned an incomplete sign-in response.");
        }
        return;
      }

      if (data.role !== role) {
        setMessage(
          "This account does not have the selected role. Please choose the correct login option."
        );
        return;
      }

      if (!data.refreshToken || !data.username) {
        setMessage("The server returned an incomplete sign-in response.");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      window.location.assign(ROLE_DASHBOARD_PATHS[role]);
    } catch {
      setMessage("Unable to connect to the backend. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-container">
      <section className="login-card" aria-labelledby="login-heading">
        <header className="login-brand">
          <div className="login-logo" aria-hidden="true">🏫</div>
          <h1>CampusCare</h1>
          <p>College Maintenance Request System</p>
        </header>

        <div className="login-content">
          <a className="back-home-link" href="/">
            ← Back to home
          </a>
          <h2 id="login-heading">{label} Login</h2>
          <p className="login-subtitle">
            Sign in with the {label.toLowerCase()} account provided to you.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor={`${role.toLowerCase()}-username`}>Username</label>
            <input
              id={`${role.toLowerCase()}-username`}
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />

            <label htmlFor={`${role.toLowerCase()}-password`}>Password</label>
            <div className="password-field">
              <input
                id={`${role.toLowerCase()}-password`}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              className="login-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : `Sign in as ${label}`}
            </button>
          </form>

          {message && (
            <p className="login-message" role="alert">
              {message}
            </p>
          )}

          {role === "STUDENT" && (
            <p className="register-link">
              New student? <a href="/register">Create an account</a>
            </p>
          )}
        </div>

        <p className="login-footer">CampusCare · Making our campus better</p>
      </section>
    </main>
  );
}

export default LoginPage;
