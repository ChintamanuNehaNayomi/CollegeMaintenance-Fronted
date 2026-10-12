
import React, { useState } from "react";
import "./App.css";

function MaintenanceRequest() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [message, setMessage] = useState("");

  const submitRequest = async (event) => {
    event.preventDefault();
    setMessage("Submitting request...");

    const requestData = {
      username: localStorage.getItem("username"),
      category,
      location,
      description,
      priority,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        setMessage("Request failed. Please check your login and try again.");
        return;
      }

      setMessage("Maintenance request submitted successfully!");
      setCategory("");
      setLocation("");
      setDescription("");
      setPriority("");
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to connect to backend. Your request has not been submitted."
      );
    }
  };

  return (
    <div className="request-page">
      <div className="request-card">
        <h1>Submit Maintenance Request</h1>
        <p className="request-subtitle">
          Tell us about the problem so we can help improve your campus.
        </p>

        <form className="request-form" onSubmit={submitRequest}>
          <label htmlFor="category">Issue Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Furniture">Furniture</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="location">Location on Campus</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Block A, Room 101"
            required
          />

          <label htmlFor="description">Problem Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the maintenance issue..."
            rows={4}
            required
          />

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">Select priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <button className="primary-button" type="submit">
            Submit Request
          </button>
        </form>

        {message && (
          <p className="request-message" role="status">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default MaintenanceRequest;
