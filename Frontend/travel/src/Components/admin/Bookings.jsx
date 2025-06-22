import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/bookings/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Failed to fetch bookings", err));
  }, []);

  return (
    <div>
      <h2 className="mb-4">📋 Tour Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Tour</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>People</th>
              <th>Booking Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.tour__title || "—"}</td>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>{b.people}</td>
                <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
