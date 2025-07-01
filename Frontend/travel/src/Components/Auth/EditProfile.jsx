import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    preferences: "",
    travel_history: "",
    profile_image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { username, email, preferences, travel_history, profile_image } = res.data;
        setFormData({
          username,
          email,
          preferences: (preferences?.activities || []).join(", "),
          travel_history: (travel_history || []).join(", "),
          profile_image: null,
        });
        setPreview(profile_image);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
        toast.error("Failed to load profile.");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      const file = files[0];
      setFormData({ ...formData, profile_image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const preferencesList = formData.preferences
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      const travelHistoryList = formData.travel_history
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("preferences", JSON.stringify({ activities: preferencesList }));
      data.append("travel_history", JSON.stringify(travelHistoryList));
      if (formData.profile_image) {
        data.append("profile_image", formData.profile_image);
      }

      await axios.put("http://localhost:8000/api/auth/profile/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Update failed", err.response?.data || err.message);
      toast.error(
        "Something went wrong: " +
          (err.response?.data?.detail || "please check your input.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-loader">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  return (
    <div className="edit-profile-bg">
      <ToastContainer />
      <div className="edit-profile-container">
        <h2 className="edit-profile-heading">✏️ Edit Your Profile</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form" noValidate>
          {/* Username */}
          <div className="form-group floating-label">
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="Abcde"
              placeholder=" "
            />
            <label htmlFor="username">Username</label>
          </div>

          {/* Email */}
          <div className="form-group floating-label">
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="e.g.: abc@gmail.com"
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>

          {/* Preferences */}
          <div className="form-group floating-label">
            <input
              id="preferences"
              type="text"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              placeholder="e.g., hiking, sightseeing"
              autoComplete="off"
            />
            <label htmlFor="preferences">Preferences (comma-separated)</label>
          </div>

          {/* Travel History */}
          <div className="form-group floating-label">
            <input
              id="travel_history"
              type="text"
              name="travel_history"
              value={formData.travel_history}
              onChange={handleChange}
              placeholder="e.g., Nepal, Japan, Thailand "
              autoComplete="off"
            />
            <label htmlFor="travel_history">Travel History (comma-separated)</label>
          </div>

          {/* Profile Image */}
          <div className="form-group">
            <input
              id="profile_image"
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange}
            />
            {preview && (
              <div className="preview-image">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="edit-buttons">
            <button type="submit" className="btn btn-success" disabled={saving}>
              <FaSave className="me-2" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/profile")}
            >
              <FaUndo className="me-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
