import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaSave, FaUndo } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function EditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [booking, setBooking] = useState(null);
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/bookings/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBooking(res.data);
        setPeople(res.data.people);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load booking", err);
        toast.error("Booking not found or access denied.");
        navigate("/profile");
      });
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/bookings/${id}/`,
        { people },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update booking.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !booking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "600px" }}>
      <ToastContainer />
      <h2 className="mb-4 fw-bold text-center">✏️ Edit Booking</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label fw-semibold">Tour</label>
          <input
            type="text"
            className="form-control"
            value={booking.tour_title || `Tour #${booking.tour}`}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Booking Date</label>
          <input
            type="text"
            className="form-control"
            value={booking.booking_date}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Number of People</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Status</label>
          <input
            type="text"
            className="form-control"
            value={booking.status}
            readOnly
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center gap-2"
            disabled={saving}
          >
            <FaSave />
            {saving ? "Saving..." : "Update Booking"}
          </button>
          <button
            type="button"
            className="btn btn-secondary d-flex align-items-center gap-2"
            onClick={() => navigate("/profile")}
          >
            <FaUndo />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
