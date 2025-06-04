import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        toast.success("Login successful!");

        setFormData({ username: "", password: "" });

        setTimeout(() => {
          navigate("/");  // Redirect to homepage after login
        }, 1500);
      } else {
        const errorMessage = data.detail || "Login failed. Check credentials.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} position="top-center" />

      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
          padding: "20px",
        }}
      >
        <div
          className="card p-4 shadow"
          style={{
            maxWidth: "420px",
            width: "100%",
            borderRadius: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <h2
            className="mb-4 text-center"
            style={{
              fontWeight: "700",
              fontFamily: "'Poppins', sans-serif",
              color: "#6610f2",
            }}
          >
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="form-label fw-semibold"
                style={{ color: "#333" }}
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="form-control shadow-sm"
                placeholder="Your username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "12px",
                  borderColor: "#a6c1ee",
                  padding: "12px 15px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6610f2")}
                onBlur={(e) => (e.target.style.borderColor = "#a6c1ee")}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="form-label fw-semibold"
                style={{ color: "#333" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control shadow-sm"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "12px",
                  borderColor: "#a6c1ee",
                  padding: "12px 15px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6610f2")}
                onBlur={(e) => (e.target.style.borderColor = "#a6c1ee")}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold"
              style={{
                borderRadius: "14px",
                padding: "12px",
                fontSize: "1.1rem",
                background: "linear-gradient(90deg, #6610f2 0%, #0d6efd 100%)",
                border: "none",
                boxShadow:
                  "0 6px 12px rgba(102, 16, 242, 0.4), 0 3px 6px rgba(13, 110, 253, 0.3)",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #6610f2 0%, #0d6efd 100%)")
              }
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div
            className="text-center mt-3"
            style={{ fontSize: "0.95rem", color: "#555" }}
          >
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#6610f2", fontWeight: "600" }}>
              Register
            </Link>
          </div>

          <div className="text-center mt-2">
            <Link to="/forgot-password" style={{ fontSize: "0.9rem", color: "#0d6efd" }}>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
