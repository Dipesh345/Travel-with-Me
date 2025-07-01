import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/login.css";
import loginBg from "../../assets/login.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        toast.success("Login successful!");
        setFormData({ username: "", password: "" });
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(data.detail || "Invalid credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} position="top-center" />

      <div className="login-full-wrapper">
        <div className="background-angle"></div>

        <div className="login-box">
          <div
            className="login-image"
            style={{ backgroundImage: `url(${loginBg})` }}
          >
            <div className="quote">
              TRAVEL IS THE ONLY THING<br />YOU BUY THAT MAKES YOU RICHER
            </div>
          </div>

          <div className="login-form">
            <h2 className="brand-title">TRAVEL BLOGGER</h2>

            <div className="social-icons">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-google"></i>
              <i className="fab fa-linkedin-in"></i>
            </div>

            <p className="or-text">or use your email account</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Email"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>
              </div>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Your Password?
              </Link>

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "LOG IN"}
              </button>
            </form>

            <div className="register-text">
              Don’t have an account?{" "}
              <Link to="/register" className="register-link">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
