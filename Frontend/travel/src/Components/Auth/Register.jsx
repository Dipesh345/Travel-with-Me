import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.confirmPassword, // Note: some APIs expect password2 or confirm password field
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        toast.success("Registration successful!");

        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Navigate to login after 2 seconds so user sees the toast
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Handle API validation errors
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

      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
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
            boxShadow:
              "0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)",
          }}
        >
          <h2
            className="mb-4 text-center"
            style={{
              fontWeight: "700",
              fontFamily: "'Poppins', sans-serif",
              color: "#0d6efd",
            }}
          >
            Create your account
          </h2>

          <form onSubmit={handleSubmit}>
            {[
              {
                id: "username",
                label: "Username",
                type: "text",
                placeholder: "e.g. travellover123",
                name: "username",
                value: formData.username,
              },
              {
                id: "email",
                label: "Email Address",
                type: "email",
                placeholder: "your.email@example.com",
                name: "email",
                value: formData.email,
              },
              {
                id: "password",
                label: "Password",
                type: "password",
                placeholder: "Enter a strong password",
                name: "password",
                value: formData.password,
              },
              {
                id: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                placeholder: "Re-enter your password",
                name: "confirmPassword",
                value: formData.confirmPassword,
              },
            ].map(({ id, label, type, placeholder, name, value }) => (
              <div className="mb-4" key={id}>
                <label
                  htmlFor={id}
                  className="form-label fw-semibold"
                  style={{ color: "#333" }}
                >
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  className="form-control shadow-sm"
                  placeholder={placeholder}
                  name={name}
                  value={value}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: "12px",
                    borderColor: "#a1c4fd",
                    padding: "12px 15px",
                    fontSize: "1rem",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
                  onBlur={(e) => (e.target.style.borderColor = "#a1c4fd")}
                />
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold"
              style={{
                borderRadius: "14px",
                padding: "12px",
                fontSize: "1.1rem",
                background: "linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)",
                border: "none",
                boxShadow:
                  "0 6px 12px rgba(13, 110, 253, 0.5), 0 3px 6px rgba(102, 16, 242, 0.4)",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #6610f2 0%, #0d6efd 100%)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)")
              }
            >
              Register
            </button>
          </form>

          <hr className="my-4" />

          <p className="text-center mb-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-decoration-none fw-semibold"
              style={{ color: "#0d6efd" }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
