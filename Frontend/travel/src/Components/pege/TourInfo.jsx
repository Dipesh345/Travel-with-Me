import React from "react";
import {
  FaHotel,
  FaUserCheck,
  FaMapMarkerAlt,
  FaLanguage,
  FaCalendarTimes,
  FaUser,
  FaUserShield,
  FaExchangeAlt,
} from "react-icons/fa";

export default function TourInfo({ tour }) {
  return (
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
  );
}
