import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">❤️</div>
          <span className="logo-text">RKT FITVIBE</span>
        </Link>

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileOpen ? "nav-links--open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/traniers">Traniers</Link>
          <Link to="/workout">Workout</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        {/* Auth Buttons or Profile */}
        {!user ? (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </div>
        ) : (
          <div className="navbar-profile">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="profile-btn"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {/* <button
                  onClick={() => navigate("/profile")}
                  className="dropdown-item"
                >
                  Profile
                </button> */}
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}

export default Navbar;
