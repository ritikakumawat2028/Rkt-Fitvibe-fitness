import React, { useState } from "react";
import homebg from "../assests/homebg.png"; 
import "./Home.css";

function Home({ user }) {
  const [gender, setGender] = useState("");

  return (
    <div className="home-container">
      <section className="hero-section"  style={{
    backgroundImage: `url(${homebg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    position: "relative",
  }}>
        {/* Background overlay */}
        <div className="overlay"></div>

        {/* Content */}
        <div className="hero-content">
          <h1>
            Transform Your <br />
            <span className="highlight">FITNESS JOURNEY</span>
          </h1>
          <p>
            Personalized training, expert guidance, and a community that supports
            your transformation every step of the way.
          </p>

          {/*  Show Buttons only if NOT logged in */}
          {!user && (
            <div className="hero-buttons">
              <a href="/register" className="btn-primary">
                Start Your Journey
              </a>
              <a href="/login" className="btn-secondary">
                Member Login
              </a>
            </div>
          )}

          {/* Show Gender Card only if NOT logged in */}
          {!user && (
            <div className="plan-card">
              <h3>Get Your Personalized Plan</h3>
              <p>Select your gender to begin your fitness journey</p>
              <div className="gender-options">
                <button
                  className="male"
                  onClick={() => setGender("Male")}
                >
                  Male
                </button>
                <button
                  className="female"
                  onClick={() => setGender("Female")}
                >
                  Female
                </button>
                <button
                  className="other"
                  onClick={() => setGender("Other")}
                >
                  Other
                </button>
              </div>
              {gender && <p>You selected: {gender}</p>}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">↓</div>
      </section>

      {/*  Always visible after login & before login */}
      <section className="motivation">
        <div className="container">
          <h2 className="motivation-title">Daily Motivation</h2>

          <div className="motivation-box">
            <div className="quote-icon">❝</div>
            <p className="quote-text">
              Success is the sum of small efforts repeated day in and day out.
            </p>
            <div className="dots">
              <span></span>
              <span></span>
              <span className="active"></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="playlists">
        <div className="container">
          <h2 className="title">Workout Playlists</h2>
          <div className="playlist-grid">
            <div className="playlist-card red">
              <div className="icon">🎵</div>
              <h3>High Energy Hits</h3>
              <p>Perfect for intense cardio and HIIT workouts</p>
              <a
                className="playlist-button"
                href="https://open.spotify.com/playlist/37i9dQZF1DX8FwnYE6PRvL"
                target="_blank"
                rel="noreferrer"
              >
                ▶ Play on Spotify
              </a>
            </div>
            <div className="playlist-card orange">
              <div className="icon">💪</div>
              <h3>Strength Training</h3>
              <p>Powerful beats for weightlifting sessions</p>
              <a
                className="playlist-button"
                href="https://youtube.com/playlist?list=PLe1px9-uNQToJhrFIBpVsviZMABuLE5x8&si=Y_oGcAo29LfyNpJY"
                target="_blank"
                rel="noreferrer"
              >
                ▶ Watch on YouTube
              </a>
            </div>
            <div className="playlist-card purple">
              <div className="icon">🌿</div>
              <h3>Yoga & Meditation</h3>
              <p>Calming sounds for mindful movement</p>
              <a
                className="playlist-button"
                href="https://open.spotify.com/playlist/37i9dQZF1DX9uKNf5jGX6m?si=a1Tuo0j-TQSbZ6N-2DrggA"
                target="_blank"
                rel="noreferrer"
              >
                ▶ Play on Spotify
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose">
        <div className="container">
          <h2 className="title">Why Choose RKT FITVIBE?</h2>
          <div className="why-grider">
            <div className="why-card">
              <div className="why-icon red">⭐</div>
              <h3>Expert Trainers</h3>
              <p>Certified professionals with years of experience in fitness training</p>
            </div>
            <div className="why-card">
              <div className="why-icon blue">📊</div>
              <h3>Personalized Plans</h3>
              <p>Custom workout and nutrition plans tailored to your goals</p>
            </div>
            <div className="why-card">
              <div className="why-icon green">📈</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your transformation with detailed analytics and reports</p>
            </div>
            <div className="why-card">
              <div className="why-icon purple">👥</div>
              <h3>Community Support</h3>
              <p>Join a motivating community of fitness enthusiasts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
