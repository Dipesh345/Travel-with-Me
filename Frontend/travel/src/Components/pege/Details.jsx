import React, { useState } from "react";
import { useParams } from "react-router-dom";
import sectionBanner from "../../assets/section-banner.webp";
import tours from "../../data/Toursdetails";
import "../../styles/details.css";
import {
  FaHotel,
  FaPlaneDeparture,
  FaUserCheck,
  FaUserClock,
  FaMapMarkerAlt,
  FaUmbrellaBeach,
  FaLanguage,
  FaCalendarTimes,
  FaUser,
  FaUserShield,
  FaExchangeAlt,
} from "react-icons/fa";

export default function Details() {
  const { id } = useParams();
  const tour = tours.find((t) => t.id.toString() === id);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    people: 1,
  });

  if (!tour) {
    return <div className="text-center mt-5">Tour not found.</div>;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thank you ${formData.name}, your booking for ${tour.title} is confirmed!`
    );
    setFormData({ name: "", email: "", phone: "", people: 1 });
    setShowBookingForm(false);
  };

  return (
    <div className="details-page">
      <section className="details-banner">
        <img
          src={sectionBanner}
          alt="Details Banner"
          className="banner-image"
        />
        <div className="banner-content">
          <h1>
            <span className="symbol">✦</span> Tour Details
          </h1>
          <div className="breadcrumb">
            <a href="/">Home</a> <span>➔</span><span> Tour Details</span>
          </div>
        </div>
      </section>

      {/* Tour Image */}
      <section
        className="tour-image-section"
        style={{ textAlign: "center", margin: "2rem 0" }}
      >
        <img src={tour.image} alt={tour.title} />
      </section>

      <section className="travel-info">
        <div className="info-header">
          <h2 className="package-title">{tour.title}</h2>
          <button
            className="book-btn"
            onClick={() => setShowBookingForm(!showBookingForm)}
          >
            {showBookingForm ? "Close Form" : "Book Now"}
          </button>
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
            <FaUserCheck /> Admission Fee: <strong>No</strong>
          </div>
          <div className="info-item">
            <FaUserShield /> Insurance: <strong>Cover 60%</strong>
          </div>
          <div className="info-item">
            <FaLanguage /> Language: <strong>English</strong>
          </div>
          <div className="info-item">
            <FaExchangeAlt /> Hotel Transfer: <strong>Available</strong>
          </div>
        </div>

        {/* Activities List */}
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

        {/* Booking Form */}
        {showBookingForm && (
          <form className="booking-form" onSubmit={handleFormSubmit}>
            <h3 style={{ marginTop: "2rem" }}>Booking Form</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Number of People:</label>
              <input
                type="number"
                value={formData.people}
                min="1"
                onChange={(e) =>
                  setFormData({ ...formData, people: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Confirm Booking
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
