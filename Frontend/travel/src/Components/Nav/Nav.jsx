import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { toast, ToastContainer } from "react-toastify";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    if (token) {
      fetch("http://127.0.0.1:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((data) => {
          setUserInfo(data);
        })
        .catch(() => {
          setUserInfo(null);
        });
    } else {
      setUserInfo(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setUserInfo(null);
    toast.success("Logged out successfully!");
  };

  // Navigation items with their routes
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Tour", path: "/destinations" },
    { name: "Blog", path: "/blogs" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <nav
        className={`navbar navbar-expand-lg custom-nav position-fixed w-100 ${
          scrolled ? "black-them" : "white-them"
        }`}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Mobile: Hamburger + Search Bar */}
          <div className="d-lg-none d-flex align-items-center w-100">
            <button
              className="btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
            >
              <i className="bi bi-list fs-3 text-white"></i>
            </button>

            <div
              className="input-group ms-2 flex-grow-1"
              style={{ height: "40px" }}
            >
              <input
                type="text"
                className="form-control border-0 px-3"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-light border-start" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>

            <button
              className="btn btn-light ms-2 rounded-circle"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="bi bi-mic"></i>
            </button>
          </div>

          {/* Desktop: Title */}
          <Link className="navbar-brand site-title d-none d-lg-block" to="/">
            Travel with <span className="highlight-me">me</span>
          </Link>

          {/* Desktop: Search Bar + Mic */}
          <div
            className="d-none d-lg-flex mx-auto align-items-center"
            style={{ maxWidth: "600px", flex: 1 }}
          >
            <div
              className="input-group w-100 rounded-pill shadow-sm overflow-hidden"
              style={{ height: "40px" }}
            >
              <input
                type="text"
                className="form-control border-0 px-3"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-light border-start" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
            <button
              className="btn btn-light ms-3 rounded-circle"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="bi bi-mic"></i>
            </button>
          </div>

          {/* Desktop: Nav Items + Notification + User */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {navItems.map(({ name, path }) => (
              <Link key={name} className="nav-link" to={path}>
                {name}
              </Link>
            ))}

            <div className="dropdown">
              <button
                className="btn btn-light rounded-circle position-relative dropdown-toggle"
                id="notifDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ width: "40px", height: "40px" }}
              >
                <i className="bi bi-bell fs-5"></i>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="notifDropdown"
              >
                <li className="dropdown-item">You have 3 new messages</li>
                <li className="dropdown-item">New comment on your post</li>
              </ul>
            </div>

            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-light rounded-pill dropdown-toggle d-flex align-items-center"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ height: "40px" }}
                >
                  <i className="bi bi-person-circle fs-5 me-1"></i>{" "}
                  Hi, {userInfo?.username || "User"}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                className="btn btn-light rounded-circle"
                style={{ width: "40px", height: "40px" }}
                onClick={() => navigate("/login")}
                title="Login"
              >
                <i className="bi bi-person-circle fs-5"></i>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Offcanvas Menu */}
      <div
        className="offcanvas offcanvas-start text-bg-dark"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileMenuLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between">
          <div>
            <ul className="navbar-nav">
              {isLoggedIn && (
                <li className="nav-item mb-2">
                  <span className="nav-link text-white">
                    Hi, {userInfo?.username || "User"}
                  </span>
                </li>
              )}
              {navItems.map(({ name, path }) => (
                <li className="nav-item mb-2" key={name}>
                  <Link className="nav-link text-white" to={path}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {isLoggedIn ? (
              <button
                className="btn btn-outline-light w-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="btn btn-outline-light w-100"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
