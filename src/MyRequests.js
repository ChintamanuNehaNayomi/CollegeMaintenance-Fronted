
import React, { useEffect, useState } from "react";
import "./App.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("Loading your requests...");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("accessToken");

    if (!username || !token) {
      setMessage("Please sign in to view your requests.");
      return;
    }

    fetch(
      `http://localhost:8080/api/requests/${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from server.");
        }

        setRequests(data);
        setMessage(
          data.length === 0 ? "No maintenance requests found." : ""
        );
      })
      .catch((error) => {
        console.error("Loading requests failed:", error);
        setMessage(
          "Unable to load requests. Please check the backend connection and try again."
        );
      });
  }, []);

  return (
    <div className="my-requests-page">
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

        {requests.length > 0 && (
          <div className="requests-table-wrapper">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.category}</td>
                    <td>{request.location}</td>
                    <td>{request.description}</td>
                    <td>{request.priority}</td>
                    <td>{request.status}</td>
                    <td>{request.requestDate || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRequests;
