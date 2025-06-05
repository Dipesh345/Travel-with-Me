import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          preferences: JSON.stringify(preferences || {}, null, 2),
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
      const preferencesJSON = JSON.parse(formData.preferences);
      const travelHistoryList = formData.travel_history
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("preferences", JSON.stringify(preferencesJSON));
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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "700px" }}>
      <ToastContainer />
      <h2 className="mb-4 fw-bold text-center">✏️ Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label fw-semibold">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Preferences (JSON format)</label>
          <textarea
            name="preferences"
            className="form-control"
            rows="4"
            value={formData.preferences}
            onChange={handleChange}
            placeholder={`Example:\n{\n  "activities": ["hiking", "sightseeing"],\n  "budget": "medium"\n}`}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Travel History (comma-separated)</label>
          <input
            type="text"
            name="travel_history"
            className="form-control"
            value={formData.travel_history}
            onChange={handleChange}
            placeholder="e.g., Nepal, Thailand, Japan"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Profile Image</label>
          <input
            type="file"
            name="profile_image"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
          />
          {preview && (
            <div className="mt-2 text-center">
              <img
                src={preview}
                alt="Preview"
                className="rounded-circle border mt-2"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center gap-2"
            disabled={saving}
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
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
};

export default EditProfile;
