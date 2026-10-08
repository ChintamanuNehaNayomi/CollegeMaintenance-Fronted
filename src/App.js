import React, { useState } from "react";
import StudentDashboard from "./StudentDashboard";
import "./App.css";

function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (window.location.pathname === "/student") {
    return <StudentDashboard />;
  }

  const handleLogin = async (event) => {

    event.preventDefault();

    try {

      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (data.accessToken) {

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

      <h1>College Maintenance Request System</h1>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <label>Username</label>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

      <p>{message}</p>

      <p>
        New user? <a href="/">Create Account</a>
      </p>

    </div>
  );
}

export default App;