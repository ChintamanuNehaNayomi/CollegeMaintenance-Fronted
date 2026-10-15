import React, { useCallback, useEffect, useState } from "react";
import API_BASE_URL, { authenticatedFetch } from "./api";
import { clearAuthentication } from "./auth";
import "./App.css";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [staffAccounts, setStaffAccounts] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffMessage, setStaffMessage] = useState("");
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [creatingStaff, setCreatingStaff] = useState(false);
  const username = localStorage.getItem("username") || "Administrator";

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/admin/requests`
      );

      if (!response.ok) {
        setMessage(
          response.status === 403
            ? "Your account does not have administrator access."
            : `Unable to load requests (error ${response.status}).`
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

  const loadStaffAccounts = useCallback(async () => {
    setStaffLoading(true);
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/admin/staff`);

      if (!response.ok) {
        setStaffMessage(
          response.status === 403
            ? "Your account does not have administrator access."
            : `Unable to load staff accounts (error ${response.status}).`
        );
        return;
      }

      const data = await response.json();
      setStaffAccounts(Array.isArray(data) ? data : []);
      setStaffMessage("");
    } catch {
      setStaffMessage("Unable to connect to the backend. Please try again.");
    } finally {
      setStaffLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
    loadStaffAccounts();
  }, [loadRequests, loadStaffAccounts]);

  const createStaffAccount = async (event) => {
    event.preventDefault();
    setCreatingStaff(true);
    setStaffMessage("");

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/admin/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: staffUsername.trim(),
          password: staffPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStaffMessage(
          data.detail ||
            data.message ||
            (response.status === 403
              ? "Your account does not have administrator access."
              : "Unable to create the staff account.")
        );
        return;
      }

      setStaffUsername("");
      setStaffPassword("");
      await loadStaffAccounts();
      setStaffMessage(`Staff account "${data.username}" created successfully.`);
    } catch {
      setStaffMessage("Unable to connect to the backend. Please try again.");
    } finally {
      setCreatingStaff(false);
    }
  };

  const updateRequest = async (id, action) => {
    setMessage("");
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/admin/requests/${id}/${action}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        setMessage(`Unable to ${action} this request (error ${response.status}).`);
        return;
      }

      setMessage(`Request ${action}d successfully.`);
      await loadRequests();
    } catch {
      setMessage("Unable to connect to the backend. Please try again.");
    }
  };

  const assignStaff = async (id) => {
    const staffUsername = window.prompt("Enter the username of an existing staff account:");
    if (!staffUsername || !staffUsername.trim()) {
      return;
    }

    setMessage("");
    try {
      const query = new URLSearchParams({
        staffUsername: staffUsername.trim(),
      });
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/admin/requests/${id}/assign?${query}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        setMessage(
          response.status === 403
            ? "Your account does not have administrator access."
            : "Unable to assign staff. Check that the username belongs to a staff account."
        );
        return;
      }

      setMessage("Staff assigned successfully.");
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
          <h1>Administrator Dashboard</h1>
          <p>College Maintenance Request System</p>
        </div>
        <button className="logout-button" onClick={logout}>Logout</button>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <p className="dashboard-eyebrow">ADMINISTRATOR PORTAL</p>
          <h2>Welcome, {username}</h2>
          <p>Review requests, update decisions, and assign work to staff.</p>
        </div>

        <section className="manage-staff-section" aria-labelledby="manage-staff-heading">
          <div className="dashboard-section-heading">
            <div>
              <h2 id="manage-staff-heading">Manage Staff</h2>
              <p className="section-description">
                Create staff sign-in accounts and review existing staff usernames.
              </p>
            </div>
            <button
              className="secondary-button refresh-button"
              type="button"
              onClick={loadStaffAccounts}
            >
              Refresh Staff
            </button>
          </div>

          <form className="staff-account-form" onSubmit={createStaffAccount}>
            <h3>Add Staff Account</h3>
            <label htmlFor="staff-username">Username</label>
            <input
              id="staff-username"
              type="text"
              autoComplete="off"
              value={staffUsername}
              onChange={(event) => setStaffUsername(event.target.value)}
              placeholder="Enter a staff username"
              required
            />
            <label htmlFor="staff-password">Password</label>
            <input
              id="staff-password"
              type="password"
              autoComplete="new-password"
              value={staffPassword}
              onChange={(event) => setStaffPassword(event.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
            <button
              className="action-button action-assign"
              type="submit"
              disabled={creatingStaff}
            >
              {creatingStaff ? "Creating..." : "Add Staff Account"}
            </button>
          </form>

          {staffMessage && (
            <p className="dashboard-message" role="status">{staffMessage}</p>
          )}
          {staffLoading && (
            <p className="dashboard-message">Loading staff accounts...</p>
          )}
          {!staffLoading && !staffMessage && staffAccounts.length === 0 && (
            <p className="dashboard-empty">No staff accounts have been created yet.</p>
          )}
          {!staffLoading && staffAccounts.length > 0 && (
            <div className="staff-account-list" aria-label="Existing staff accounts">
              {staffAccounts.map((account) => (
                <div className="staff-account-item" key={account.username}>
                  <span aria-hidden="true">👤</span>
                  <span>{account.username}</span>
                  <span className="status-badge">Staff</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="dashboard-section-heading">
          <h2>All Maintenance Requests</h2>
          <button className="secondary-button refresh-button" onClick={loadRequests}>
            Refresh
          </button>
        </div>

        {message && <p className="dashboard-message" role="status">{message}</p>}
        {loading && <p className="dashboard-message">Loading requests...</p>}
        {!loading && !message && requests.length === 0 && (
          <p className="dashboard-empty">There are no maintenance requests yet.</p>
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
              <p><strong>Assigned staff:</strong> {request.assignedTo || "Not assigned"}</p>

              <div className="request-actions">
                {request.status === "PENDING" && (
                  <>
                    <button className="action-button action-approve" onClick={() => updateRequest(request.id, "approve")}>
                      Approve
                    </button>
                    <button className="action-button action-reject" onClick={() => updateRequest(request.id, "reject")}>
                      Reject
                    </button>
                  </>
                )}
                {request.status !== "REJECTED" && request.status !== "COMPLETED" && (
                  <button className="action-button action-assign" onClick={() => assignStaff(request.id)}>
                    Assign Staff
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

export default AdminDashboard;
