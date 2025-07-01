import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/changePassword.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/change-password/",
        {
          old_password: formData.oldPassword,
          new_password: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.success || "Password changed successfully.");
      setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      const errMsg = error.response?.data?.error;
      if (Array.isArray(errMsg)) {
        errMsg.forEach((msg) => toast.error(msg));
      } else if (errMsg) {
        toast.error(errMsg);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="password-container">
        <div className="password-card">
          <h2>Change Password</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder=" "
                className="form-control"
                required
              />
              <label htmlFor="oldPassword">Old Password</label>
            </div>

            <div className="form-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder=" "
                className="form-control"
                required
              />
              <label htmlFor="newPassword">New Password</label>
            </div>

            <div className="form-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder=" "
                className="form-control"
                required
              />
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
