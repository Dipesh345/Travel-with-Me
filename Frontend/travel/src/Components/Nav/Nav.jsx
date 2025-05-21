import React from 'react';

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-2">
      <div className="container-fluid align-items-center">

        {/* Logo */}
        <a className="navbar-brand fw-bold me-3" href="#">
          Travel<span className="text-danger">With Me</span>
        </a>

        {/* Center: Search bar + mic icon */}
        <div className="d-none d-lg-flex mx-auto align-items-center" style={{ flex: 1, maxWidth: '600px' }}>
          <div className="input-group w-100 rounded-pill shadow-sm overflow-hidden" style={{ height: '40px' }}>
            <input
              type="text"
              className="form-control border-0 px-3"
              placeholder="Search"
              aria-label="Search"
              style={{ borderRadius: '0' }}
            />
            <button className="btn btn-light border-start" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </div>

          {/* Mic icon */}
          <button className="btn btn-light ms-3 rounded-circle" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-mic"></i>
          </button>
        </div>

        {/* Right side: Toggler, nav links, icons */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-2">

            {/* Links */}
            {['Home', 'About', 'Tour', 'Blog', 'Contact'].map((item) => (
              <li className="nav-item" key={item}>
                <a className="nav-link" href="#">{item}</a>
              </li>
            ))}

            {/* Notification */}
            <li className="nav-item">
              <button className="btn btn-light rounded-circle position-relative" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-bell fs-5"></i>
                {/* Optional notification badge */}
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">New alerts</span>
                </span>
              </button>
            </li>

            {/* User Profile Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="btn btn-light rounded-circle dropdown-toggle"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ width: '40px', height: '40px' }}
              >
                <i className="bi bi-person-circle fs-5"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="#">My Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
