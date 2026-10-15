import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import LoginPage from "./LoginPage";
import Register from "./Register";
import StaffDashboard from "./StaffDashboard";
import StudentDashboard from "./StudentDashboard";
import WelcomePage from "./WelcomePage";
import API_BASE_URL, { authenticatedFetch } from "./api";
import { clearAuthentication } from "./auth";
import "./App.css";

const DASHBOARDS = {
  "/student": { role: "STUDENT", component: StudentDashboard },
  "/staff": { role: "STAFF", component: StaffDashboard },
  "/admin": { role: "ADMIN", component: AdminDashboard },
};

function ProtectedDashboard({ role, Dashboard }) {
  const [state, setState] = useState("checking");

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setState("denied");
      return () => {
        active = false;
      };
    }

    authenticatedFetch(`${API_BASE_URL}/api/me`)
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            clearAuthentication();
          }
          throw new Error(
            response.status === 401 || response.status === 403
              ? "denied"
              : "unavailable"
          );
        }

        const user = await response.json();
        if (
          user.role !== role ||
          user.role !== localStorage.getItem("role")
        ) {
          throw new Error("denied");
        }

        if (active) {
          setState("authorized");
        }
      })
      .catch((error) => {
        if (active) {
          setState(error.message === "denied" ? "denied" : "unavailable");
        }
      });

    return () => {
      active = false;
    };
  }, [role]);

  if (state === "checking") {
    return <main className="access-denied">Verifying your account...</main>;
  }

  if (state === "unavailable") {
    return (
      <main className="access-denied">
        <div className="access-denied-card">
          <h1>Unable to verify your account</h1>
          <p>Please check your connection and try again.</p>
        </div>
      </main>
    );
  }

  if (state !== "authorized") {
    return (
      <main className="access-denied">
        <div className="access-denied-card">
          <span className="access-denied-icon" aria-hidden="true">🔒</span>
          <h1>Sign in required</h1>
          <p>
            Please sign in with the correct account before opening this
            dashboard.
          </p>
          <a className="primary-button access-home-link" href="/">
            Back to welcome page
          </a>
        </div>
      </main>
    );
  }

  return <Dashboard />;
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const dashboard = DASHBOARDS[path];

  if (dashboard) {
    const Dashboard = dashboard.component;
    return <ProtectedDashboard role={dashboard.role} Dashboard={Dashboard} />;
  }

  if (path === "/login/student") {
    return <LoginPage role="STUDENT" />;
  }
  if (path === "/login/staff") {
    return <LoginPage role="STAFF" />;
  }
  if (path === "/login/admin") {
    return <LoginPage role="ADMIN" />;
  }
  if (path === "/register") {
    return <Register />;
  }

  if (path === "/login") {
    window.location.replace("/");
    return null;
  }

  return <WelcomePage />;
}

export default App;
