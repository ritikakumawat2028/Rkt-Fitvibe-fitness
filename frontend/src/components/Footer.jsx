import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="logo-icon">❤️</div>
              <span className="logo-text">RKT FITVIBE</span>
            </div>
            <p className="brand-text">
              Transform your fitness journey with personalized training, expert
              guidance, and a supportive community. Your wellness transformation
              starts here.
            </p>

            <div className="social-links">
              <div className="social-icon">😉</div>
              <div className="social-icon">☺️</div>
              <div className="social-icon">🤗</div>
              <div className="social-icon">🥰</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/programs">Programs</Link></li>
              <li><Link to="/traniers">Trainers</Link></li>
              <li><Link to="/workout">Workout</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="footer-title">Services</h3>
            <ul className="footer-list">
              <li>Personal Training</li>
              <li>Group Classes</li>
              <li>Nutrition Coaching</li>
              <li>Yoga Classes</li>
              <li>HIIT Training</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>© 2025 RKT FITVIBE. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
