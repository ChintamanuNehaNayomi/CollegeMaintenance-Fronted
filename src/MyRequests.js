import React, { useEffect, useState } from "react";

function MyRequests() {

  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {

    const username = localStorage.getItem("username");

    fetch(`http://localhost:8080/api/requests/${username}`, {
      method: "GET",
      headers: {
        "Authorization":
          "Bearer " + localStorage.getItem("accessToken")
      }
    })
      .then(response => response.json())
      .then(data => {
        setRequests(data);
      })
      .catch(error => {
        console.error(error);
        setMessage("Unable to load requests.");
      });

  }, []);

  return (
    <div>

      <h1>My Maintenance Requests</h1>

      {message && <p>{message}</p>}

      {requests.length === 0 ? (

        <p>No maintenance requests found.</p>

      ) : (

        <table border="1">

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

            {requests.map(request => (

              <tr key={request.id}>

                <td>{request.category}</td>
                <td>{request.location}</td>
                <td>{request.description}</td>
                <td>{request.priority}</td>
                <td>{request.status}</td>
                <td>{request.requestDate}</td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default MyRequests;