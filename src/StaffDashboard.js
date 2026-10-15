import React, { useCallback, useEffect, useState } from "react";
import API_BASE_URL, { authenticatedFetch } from "./api";
import { clearAuthentication } from "./auth";
import "./App.css";

function StaffDashboard() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username") || "Staff member";

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/staff/requests`);

      if (!response.ok) {
        setMessage(
          response.status === 403
            ? "Your account does not have staff access."
            : `Unable to load assigned requests (error ${response.status}).`
        );
        return;
      }

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
      setMessage("");
    } catch {
      setMessage("Unable to connect to the backend. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateStatus = async (id, status) => {
    setMessage("");
    try {
      const query = new URLSearchParams({ status });
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/staff/requests/${id}/status?${query}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        setMessage(`Unable to update request status (error ${response.status}).`);
        return;
      }

      setMessage("Request status updated.");
      await loadRequests();
    } catch {
      setMessage("Unable to connect to the backend. Please try again.");
    }
  };

  const logout = () => {
    clearAuthentication();
    window.location.assign("/");
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Staff Dashboard</h1>
          <p>College Maintenance Request System</p>
        </div>
        <button className="logout-button" onClick={logout}>Logout</button>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <p className="dashboard-eyebrow">STAFF PORTAL</p>
          <h2>Welcome, {username}</h2>
          <p>View your assigned work and keep its status up to date.</p>
        </div>

        <div className="dashboard-section-heading">
          <h2>Assigned Requests</h2>
          <button className="secondary-button refresh-button" onClick={loadRequests}>
            Refresh
          </button>
        </div>

        {message && <p className="dashboard-message" role="status">{message}</p>}
        {loading && <p className="dashboard-message">Loading assigned requests...</p>}
        {!loading && !message && requests.length === 0 && (
          <p className="dashboard-empty">No requests are currently assigned to you.</p>
        )}

        <div className="request-list">
          {requests.map((request) => (
            <article className="request-card dashboard-request-card" key={request.id}>
              <div className="request-card-heading">
                <h3>{request.category}</h3>
                <span className={`status-badge status-${(request.status || "").toLowerCase()}`}>
                  {request.status || "Unknown"}
                </span>
              </div>
              <p><strong>Student:</strong> {request.username}</p>
              <p><strong>Location:</strong> {request.location}</p>
              <p><strong>Description:</strong> {request.description}</p>
              <p><strong>Priority:</strong> {request.priority}</p>
              {request.requestDate && (
                <p><strong>Submitted:</strong> {request.requestDate}</p>
              )}

              <div className="request-actions">
                {request.status === "APPROVED" && (
                  <button className="action-button action-assign" onClick={() => updateStatus(request.id, "IN_PROGRESS")}>
                    Start Work
                  </button>
                )}
                {request.status === "IN_PROGRESS" && (
                  <button className="action-button action-approve" onClick={() => updateStatus(request.id, "COMPLETED")}>
                    Mark Completed
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default StaffDashboard;
