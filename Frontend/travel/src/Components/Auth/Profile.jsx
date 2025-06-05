import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlaneDeparture, FaUser, FaEnvelope, FaEdit, FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";
import defaultProfile from "../../assets/default-profile.jpg";

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [token]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="container my-5 animate__animated animate__fadeIn"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Banner */}
        <div
          className="rounded-4 mb-5 p-5 text-white shadow-lg d-flex flex-column justify-content-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1280&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "220px",
            textShadow: "2px 2px 8px rgba(0,0,0,0.75)",
            fontWeight: 700,
          }}
        >
          <h2 className="display-4">Welcome, {user.username} 🌍</h2>
          <p className="lead fw-semibold">Here’s your travel profile overview</p>
        </div>

        {/* Profile Card */}
        <div
          className="card rounded-4 p-4 shadow-lg"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            transition: "box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 8px 32px 0 rgba(31, 38, 135, 0.37)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")
          }
        >
          <div className="row g-4 align-items-center">
            <div className="col-md-4 text-center">
              <img
                src={user.profile_image || defaultProfile}
                alt="Profile"
                className="rounded-circle border border-4 border-white shadow"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px 5px rgba(0, 123, 255, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="col-md-8 text-dark d-flex flex-column justify-content-center">
              <h3 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                <FaUser />
                {user.username}
              </h3>
              <p className="mb-4 fs-5 d-flex align-items-center gap-2 text-success">
                <FaEnvelope />
                {user.email}
              </p>

              {/* Travel Preferences */}
              <section>
                <h5 className="text-secondary fw-semibold border-bottom pb-2 mb-3">
                  ✈️ Travel Preferences
                </h5>
                {user.preferences && Object.keys(user.preferences).length > 0 ? (
                  <div className="d-flex flex-wrap gap-3">
                    {Object.entries(user.preferences).map(([key, value]) => (
                      <span
                        key={key}
                        className="badge bg-info text-dark border border-info py-2 px-3 fw-semibold"
                        title={`${key}: ${
                          Array.isArray(value) ? value.join(", ") : value
                        }`}
                        style={{
                          cursor: "default",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          userSelect: "none",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.boxShadow =
                            "0 0 10px rgba(13, 110, 253, 0.7)";
                          e.currentTarget.style.zIndex = "10";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.zIndex = "auto";
                        }}
                      >
                        <strong>{key}:</strong>{" "}
                        {Array.isArray(value) ? value.join(", ") : value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted fst-italic">No preferences set.</p>
                )}
              </section>

              {/* Travel History */}
              <section className="mt-4">
                <h5 className="text-secondary fw-semibold border-bottom pb-2 mb-3">
                  🧳 Travel History
                </h5>
                {user.travel_history && user.travel_history.length > 0 ? (
                  <div className="d-flex flex-wrap gap-3">
                    {user.travel_history.map((item, index) => (
                      <span
                        key={index}
                        className="badge bg-warning text-dark border border-warning py-2 px-3 d-flex align-items-center gap-1 fw-semibold"
                        title={item}
                        style={{
                          cursor: "default",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          userSelect: "none",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.boxShadow =
                            "0 0 10px rgba(255, 193, 7, 0.7)";
                          e.currentTarget.style.zIndex = "10";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.zIndex = "auto";
                        }}
                      >
                        <FaPlaneDeparture />
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted fst-italic">No travel history available.</p>
                )}
              </section>

              {/* Account Actions */}
              <section className="mt-5">
                <h5 className="text-secondary fw-semibold border-bottom pb-2 mb-3">
                  🔐 Account Actions
                </h5>
                <div className="d-flex flex-wrap gap-3">
                  <Link
                    to="/edit-profile"
                    className="btn btn-outline-success btn-lg fw-semibold d-flex align-items-center gap-2"
                  >
                    <FaEdit /> Edit Profile
                  </Link>
                  <Link
                    to="/change-password"
                    className="btn btn-outline-primary btn-lg fw-semibold d-flex align-items-center gap-2"
                  >
                    <FaKey /> Change Password
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
