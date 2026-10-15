import React, { useEffect, useState } from "react";
import API_BASE_URL, { authenticatedFetch } from "./api";
import "./App.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("Loading your requests...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("accessToken");

    if (!username || !token) {
      setMessage("Please sign in to view your requests.");
      setLoading(false);
      return;
    }

    const loadRequests = async () => {
      try {
        const response = await authenticatedFetch(
          `${API_BASE_URL}/api/requests/${encodeURIComponent(username)}`
        );

        if (!response.ok) {
          setMessage(
            response.status === 403
              ? "You can only view your own requests."
              : `Unable to load requests (error ${response.status}).`
          );
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          setMessage("The server returned an unexpected response.");
          return;
        }

        setRequests(data);
        setMessage(
          data.length === 0 ? "You have not submitted any requests yet." : ""
        );
      } catch {
        setMessage("Unable to connect to the backend. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <section className="my-requests-page">
      <div className="my-requests-card">
        <h1>My Maintenance Requests</h1>
        <p className="requests-subtitle">
          Track the maintenance issues you have reported on campus.
        </p>

        {message && (
          <p className="requests-message" role="status">
            {message}
          </p>
        )}
        {loading && <p className="requests-message">Loading requests...</p>}

        {requests.length > 0 && (
          <div className="requests-table-wrapper">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.category}</td>
                    <td>{request.location}</td>
                    <td>{request.priority}</td>
                    <td>{request.requestDate || "Not available"}</td>
                    <td>
                      <span className={`status-badge status-${(request.status || "").toLowerCase()}`}>
                        {request.status || "Unknown"}
                      </span>
                    </td>
                    <td>{request.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default MyRequests;
