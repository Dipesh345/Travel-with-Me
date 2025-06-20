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
} from "react-icons/fa";

export default function Details() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(false);
  const [booking, setBooking] = useState(null); // store existing booking if any

  const token = localStorage.getItem("access_token");
  const isAuthenticated = !!token;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    people: 1,
    booking_date: "",
  });

  // Fetch tour details and user's booking for this tour
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
      // Fetch booking for this tour by logged in user
      axios
        .get(`http://localhost:8000/api/bookings/by-tour/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setBooking(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            people: res.data.people || 1,
            booking_date: res.data.booking_date || "",
          });
        })
        .catch(() => {
          setBooking(null);
          setFormData({
            name: "",
            email: "",
            phone: "",
            people: 1,
            booking_date: "",
          });
        });
    }
  }, [id, isAuthenticated, token]);

  // Handle booking create or update
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please log in to book a tour.");
      return;
    }

    try {
      if (booking) {
        // Update existing booking
        await axios.put(
          `http://localhost:8000/api/bookings/${booking.id}/`,
          {
            tour: id,
            people: formData.people,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            booking_date: formData.booking_date,
            status: "active",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(`Your booking for ${tour.title} has been updated!`);
      } else {
        // Create new booking
        await axios.post(
          "http://localhost:8000/api/bookings/create/",
          {
            tour: id,
            people: formData.people,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            booking_date: formData.booking_date,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(`Thank you ${formData.name}, your booking for ${tour.title} is confirmed!`);
      }

      // Refresh booking data
      const res = await axios.get(`http://localhost:8000/api/bookings/by-tour/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data);
      setShowBookingForm(false);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book the tour. Please try again.");
    }
  };

  // Cancel booking (set status to cancelled)
  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel your booking?")) return;

    try {
      await axios.patch(
        `http://localhost:8000/api/bookings/${booking.id}/`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Your booking has been cancelled.");

      setBooking(null);
      setShowBookingForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        people: 1,
        booking_date: "",
      });
    } catch (error) {
      console.error("Cancel booking failed:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  // Handle rating submit to backend
  const handleRatingSubmit = async (value) => {
    if (!isAuthenticated) {
      alert("Please log in to rate this tour.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8000/api/tours/${id}/rate/`,
        { rating: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubmittedRating(true);
      setRating(value);

      // Refresh tour details to get updated average rating from backend
      const res = await axios.get(`http://localhost:8000/api/tours/${id}/`);
      setTour(res.data);

      alert("Thank you for rating!");
    } catch (error) {
      console.error("Rating failed:", error);
      alert("You have already rated or you're not allowed to rate.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (notFound || !tour) return <div className="text-center mt-5">Tour not found.</div>;

  return (
    <div className="details-page">
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
        <img src={tour.image} alt={tour.title} style={{ maxWidth: "100%", borderRadius: "10px" }} />
      </section>

      <section className="travel-info">
        <div
          className="info-header"
          style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
        >
          <h2 className="package-title" style={{ flexGrow: 1 }}>
            {tour.title}
          </h2>

          {isAuthenticated && !showBookingForm && (
            <>
              {!booking && (
                <button className="book-btn" onClick={() => setShowBookingForm(true)}>
                  Book Now
                </button>
              )}

              {booking && booking.status === "active" && (
                <>
                  <button className="book-btn" onClick={() => setShowBookingForm(true)}>
                    Edit Booking
                  </button>
                  <button className="book-btn cancel-btn" onClick={handleCancelBooking}>
                    Cancel Booking
                  </button>
                </>
              )}

              {booking && booking.status === "cancelled" && (
                <div style={{ color: "red", fontWeight: "bold" }}>Booking Cancelled</div>
              )}
            </>
          )}

          {showBookingForm && (
            <button className="book-btn" onClick={() => setShowBookingForm(false)}>
              Close Form
            </button>
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

        {isAuthenticated && showBookingForm && booking?.status !== "cancelled" && (
          <form className="booking-form" onSubmit={handleFormSubmit}>
            <h3 style={{ marginTop: "2rem" }}>
              {booking ? "Edit Booking" : "Booking Form"}
            </h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Number of People:</label>
              <input
                type="number"
                value={formData.people}
                min="1"
                onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Booking Date:</label>
              <input
                type="date"
                value={formData.booking_date}
                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              {booking ? "Update Booking" : "Confirm Booking"}
            </button>
          </form>
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
