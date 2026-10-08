import React, { useState } from "react";

function MaintenanceRequest() {

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [message, setMessage] = useState("");

  const submitRequest = async (event) => {

    event.preventDefault();

    const username = localStorage.getItem("username");

    const requestData = {
      username: username,
      category: category,
      location: location,
      description: description,
      priority: priority
    };

    try {

      const response = await fetch(
        "http://localhost:8080/api/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization":
              "Bearer " + localStorage.getItem("accessToken")
          },
          body: JSON.stringify(requestData)
        }
      );

      if (response.ok) {

        setMessage("Maintenance request submitted successfully!");

        setCategory("");
        setLocation("");
        setDescription("");
        setPriority("");

      } else {

        setMessage("Failed to submit request.");

      }

    } catch (error) {

      console.error(error);
      setMessage("Unable to connect to backend.");

    }
  };

  return (
    <div>

      <h1>Submit Maintenance Request</h1>

      <form onSubmit={submitRequest}>

        <label>Category</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>

        <br /><br />

        <label>Location</label>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Example: Block A, Room 101"
          required
        />

        <br /><br />

        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the problem"
          required
        />

        <br /><br />

        <label>Priority</label>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="">Select Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <br /><br />

        <button type="submit">
          Submit Request
        </button>

      </form>

      <p>{message}</p>

    </div>
  );
}

export default MaintenanceRequest;