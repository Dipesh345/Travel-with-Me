import React, { useEffect, useState } from "react";

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar navbar-expand-lg custom-nav position-fixed w-100 ${scrolled ? "black-them" : "white-them"}`}>
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

            <div className="input-group ms-2 flex-grow-1" style={{ height: "40px" }}>
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

            <button className="btn btn-light ms-2 rounded-circle" style={{ width: "40px", height: "40px" }}>
              <i className="bi bi-mic"></i>
            </button>
          </div>

          {/* Desktop: Title */}
          <a className="navbar-brand site-title d-none d-lg-block" href="#">
            Travel with <span className="highlight-me">me</span>
          </a>

          {/* Desktop: Search Bar + Mic */}
          <div className="d-none d-lg-flex mx-auto align-items-center" style={{ maxWidth: "600px", flex: 1 }}>
            <div className="input-group w-100 rounded-pill shadow-sm overflow-hidden" style={{ height: "40px" }}>
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
            <button className="btn btn-light ms-3 rounded-circle" style={{ width: "40px", height: "40px" }}>
              <i className="bi bi-mic"></i>
            </button>
          </div>

          {/* Desktop: Nav Items + Notification + User */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {[
              "Home",
              "About",
              "Tour",
              "Blog",
              "Contact"
            ].map((item) => (
              <a className="nav-link" href="#" key={item}>
                {item}
              </a>
            ))}

            {/* Notification Dropdown */}
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
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notifDropdown">
                <li className="dropdown-item">You have 3 new messages</li>
                <li className="dropdown-item">New comment on your post</li>
              </ul>
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-light rounded-circle dropdown-toggle"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ width: "40px", height: "40px" }}
              >
                <i className="bi bi-person-circle fs-5"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li><a className="dropdown-item" href="#">My Profile</a></li>
                <li><a className="dropdown-item" href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Offcanvas Menu */}
      <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileMenuLabel">Menu</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between">
          <div>
            <ul className="navbar-nav">
              <li className="nav-item mb-2">
                <a className="nav-link text-white" href="#">My Profile</a>
              </li>
              {[
                "Home",
                "About",
                "Tour",
                "Blog",
                "Contact",
                "Notification"
              ].map((item) => (
                <li className="nav-item mb-2" key={item}>
                  <a className="nav-link text-white" href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <button className="btn btn-outline-light w-100">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
