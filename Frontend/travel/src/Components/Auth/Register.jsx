import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        toast.success("Registration successful!");
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });

        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorMessage = Object.values(data).flat().join(" ");
        toast.error(`Registration failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration.");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="register-container">
        <div className="register-card">
          <h2>Create your account</h2>
          <form onSubmit={handleSubmit} noValidate>

            {/* Username */}
            <div className="form-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder=" "
                className="form-control"
                required
              />
              <label htmlFor="username">Username</label>
            </div>

            {/* Email */}
            <div className="form-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="form-control"
                required
              />
              <label htmlFor="email">Email Address</label>
            </div>

            {/* Password */}
            <div className="form-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="form-control"
                required
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <FaLock className="input-icon" />
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                className="form-control"
                required
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className="submit-btn">
              Register
            </button>
          </form>

          <hr />
          <p className="bottom-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
