import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import sectionBanner from "../../assets/section-banner.webp";
import "../../styles/details.css";
import {
  FaHotel,
  FaUserCheck,
  FaMapMarkerAlt,
  FaLanguage,
  FaCalendarTimes,
  FaUser,
  FaUserShield,
  FaExchangeAlt,
  FaStar,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Details() {
  const { id } = useParams();
  const token = localStorage.getItem("access_token");
  const isAuthenticated = !!token;

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  // Renamed for modal toggle:
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(false);
  const [booking, setBooking] = useState(null);

  // For booking creation form fields
  const [newBookingData, setNewBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    people: 1,
    booking_date: "",
  });

  // For editing only people count
  const [people, setPeople] = useState(1);
  const [saving, setSaving] = useState(false);

  // Load tour and booking
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/tours/${id}/`)
      .then((res) => {
        setTour(res.data);
        setLoading(false);
        setSubmittedRating(false);
        setRating(0);
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
        setLoading(false);
      });

    if (isAuthenticated) {
      axios
        .get(`http://localhost:8000/api/bookings/by-tour/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setBooking(res.data);
          setPeople(res.data.people || 1);
          setNewBookingData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            people: res.data.people || 1,
            booking_date: res.data.booking_date || "",
          });
        })
        .catch(() => {
          setBooking(null);
          setPeople(1);
          setNewBookingData({
            name: "",
            email: "",
            phone: "",
            people: 1,
            booking_date: "",
          });
        });
    } else {
      setBooking(null);
      setPeople(1);
      setNewBookingData({
        name: "",
        email: "",
        phone: "",
        people: 1,
        booking_date: "",
      });
    }
  }, [id, isAuthenticated, token]);

  // Handle booking update (only people editable)
  const handleBookingUpdate = async (e) => {
    e.preventDefault();
    if (!booking) return;

    setSaving(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/bookings/${booking.id}/`,
        { people },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking updated successfully!");
      setShowModal(false);

      // Refresh booking info
      const res = await axios.get(`http://localhost:8000/api/bookings/by-tour/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data);
      setPeople(res.data.people || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking.");
    } finally {
      setSaving(false);
    }
  };

  // Handle new booking creation
  const handleBookingCreate = async (e) => {
    e.preventDefault();

    setSaving(true);
    try {
      await axios.post(
        `http://localhost:8000/api/bookings/create/`,
        {
          tour: id,
          ...newBookingData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking created successfully!");
      setShowModal(false);

      // Refresh booking info
      const res = await axios.get(`http://localhost:8000/api/bookings/by-tour/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data);
      setPeople(res.data.people || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create booking.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel your booking?")) return;

    try {
      await axios.patch(
        `http://localhost:8000/api/bookings/${booking.id}/`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking cancelled.");

      // After cancellation, reset booking to null so user can book anew
      setBooking(null);
      setShowModal(false);
      setPeople(1);
      setNewBookingData({
        name: "",
        email: "",
        phone: "",
        people: 1,
        booking_date: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel booking.");
    }
  };

  // Handle rating submit
  const handleRatingSubmit = async (value) => {
    if (!isAuthenticated) {
      alert("Please log in to rate this tour.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8000/api/tours/${id}/rate/`,
        { rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmittedRating(true);
      setRating(value);

      const res = await axios.get(`http://localhost:8000/api/tours/${id}/`);
      setTour(res.data);

      alert("Thank you for rating!");
    } catch (error) {
      console.error(error);
      alert("You have already rated or you're not allowed to rate.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (notFound || !tour) return <div className="text-center mt-5">Tour not found.</div>;

  return (
    <div className="details-page">
      <ToastContainer />
      <section className="details-banner">
        <img src={sectionBanner} alt="Details Banner" className="banner-image" />
        <div className="banner-content">
          <h1>
            <span className="symbol">✦</span> Tour Details
          </h1>
          <div className="breadcrumb">
            <a href="/">Home</a> <span>➔</span>
            <span> Tour Details</span>
          </div>
        </div>
      </section>

      <section className="tour-image-section" style={{ textAlign: "center", margin: "2rem 0" }}>
        <img
          src={tour.image}
          alt={tour.title}
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      </section>

      <section className="travel-info">
        <div
          className="info-header"
          style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
        >
          <h2 className="package-title" style={{ flexGrow: 1 }}>
            {tour.title}
          </h2>

          {isAuthenticated && !showModal && (
            <>
              {/* If no booking or booking is cancelled, allow new booking */}
              {(!booking || booking.status === "cancelled") && (
                <button className="book-btn" onClick={() => setShowModal(true)}>
                  Book Now
                </button>
              )}

              {/* If booking exists and active, show edit and cancel */}
              {booking && booking.status === "active" && (
                <>
                  <button className="book-btn" onClick={() => setShowModal(true)}>
                    Edit Booking
                  </button>
                  <button className="book-btn cancel-btn" onClick={handleCancelBooking}>
                    Cancel Booking
                  </button>
                </>
              )}
            </>
          )}
        </div>

        <div className="info-grid">
          <div className="info-item">
            <FaMapMarkerAlt /> Destination: <strong>{tour.country}</strong>
          </div>
          <div className="info-item">
            <FaCalendarTimes /> Duration: <strong>{tour.days} Days</strong>
          </div>
          <div className="info-item">
            <FaHotel /> Price: <strong>${tour.price}</strong>
          </div>
          <div className="info-item">
            <FaUser /> Trip Type: <strong>{tour.type}</strong>
          </div>
          <div className="info-item">
            <FaUserCheck /> Admission Fee: <strong>{tour.admission_fee ? "Yes" : "No"}</strong>
          </div>
          <div className="info-item">
            <FaUserShield /> Insurance: <strong>{tour.insurance_coverage}</strong>
          </div>
          <div className="info-item">
            <FaLanguage /> Language: <strong>{tour.language}</strong>
          </div>
          <div className="info-item">
            <FaExchangeAlt /> Hotel Transfer:{" "}
            <strong>{tour.hotel_transfer ? "Available" : "Not Available"}</strong>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", fontSize: "1.1rem" }}>
          <strong>Average Rating:</strong>{" "}
          {tour.average_rating ? `${tour.average_rating} / 5` : "No ratings yet"}
        </div>

        {isAuthenticated && !submittedRating && (
          <div style={{ margin: "1rem 0" }}>
            <strong>Rate this tour:</strong>{" "}
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => handleRatingSubmit(star)}
                style={{
                  color: rating >= star ? "gold" : "#ccc",
                  cursor: "pointer",
                  fontSize: "1.4rem",
                  marginRight: "0.25rem",
                }}
                onMouseEnter={() => setRating(star)}
                onMouseLeave={() => setRating(0)}
              />
            ))}
          </div>
        )}

        {tour.activities && tour.activities.length > 0 && (
          <div className="tour-activities" style={{ marginTop: "2rem" }}>
            <h3>Activities Included:</h3>
            <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              {tour.activities.map((activity, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Booking Modal */}
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowModal(false)} // close modal on backdrop click
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            >
              <div className="modal-content p-4">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {booking && booking.status === "active" ? "Edit Booking" : "New Booking"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  {/* Edit booking form */}
                  {booking && booking.status === "active" && (
                    <form className="booking-form mt-4" onSubmit={handleBookingUpdate}>
                      <div className="form-group mb-3">
                        <label>Tour</label>
                        <input type="text" className="form-control" value={tour.title} readOnly />
                      </div>

                      <div className="form-group mb-3">
                        <label>Booking Date</label>
                        <input
                          type="text"
                          className="form-control"
                          value={booking.booking_date}
                          readOnly
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Number of People</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={people}
                          onChange={(e) => setPeople(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Status</label>
                        <input type="text" className="form-control" value={booking.status} readOnly />
                      </div>

                      <div className="d-flex gap-2">
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
                          onClick={() => setShowModal(false)}
                        >
                          <FaUndo />
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* New booking form */}
                  {(!booking || booking.status === "cancelled") && (
                    <form className="booking-form mt-4" onSubmit={handleBookingCreate}>
                      <div className="form-group mb-3">
                        <label>Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newBookingData.name}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={newBookingData.email}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={newBookingData.phone}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, phone: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Number of People</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={newBookingData.people}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, people: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Booking Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={newBookingData.booking_date}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, booking_date: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary d-flex align-items-center gap-2"
                          disabled={saving}
                        >
                          <FaSave />
                          {saving ? "Saving..." : "Confirm Booking"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary d-flex align-items-center gap-2"
                          onClick={() => setShowModal(false)}
                        >
                          <FaUndo />
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-4" style={{ color: "#d9534f" }}>
            Please <a href="/login">log in</a> to book and rate this tour.
          </div>
        )}
      </section>
    </div>
  );
}
