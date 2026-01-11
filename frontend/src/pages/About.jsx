import React, { useState } from "react";
import "./About.css";
import mvcard1 from "../assests/mvcard1.jpg";
import vcvard2 from "../assests/vcvard2.jpg";

function About() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && review.trim() !== "") {
      setSubmitted(true);
      console.log("User Review:", { rating, review });
      // later connect this with backend API
    }
  };

  return (
    <>
      {/* About Section */}
      <section className="about-section">
        <div className="about-overlay"></div>
        <div className="about-content">
          <h1 className="about-title">
            About <span className="about-highlight">RKT FITVIBE</span>
          </h1>
          <p className="about-text">
            We're more than just a gym. We're a community dedicated to
            transforming lives through fitness, wellness, and support.
          </p>

          <div className="about-boxes">
            <div className="about-box">
              <div className="box-icon red">📅</div>
              <h3 className="box-title">Founded 2018</h3>
              <p className="box-text">6 years of transforming lives</p>
            </div>

            <div className="about-box">
              <div className="box-icon blue">🙎</div>
              <h3 className="box-title">5000+ Members</h3>
              <p className="box-text">Active fitness community</p>
            </div>

            <div className="about-box">
              <div className="box-icon green">🏆</div>
              <h3 className="box-title">50+ Awards</h3>
              <p className="box-text">Recognition for excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="purpose-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Purpose</h2>
            <p>
              We believe fitness is not just about physical transformation, but
              about building confidence, discipline, and a healthier lifestyle.
            </p>
          </div>

          <div className="mission-vision">
            <div
              className="mv-card mission"
            style={{ backgroundImage: `url(${mvcard1})` }}

            >
              <div className="mv-overlay"></div>
              <div className="mv-content">
                <div className="mv-icon red">
                  <i className="ri-target-line"></i>
                </div>
                <h3>Our Mission</h3>
                <p>
                  To empower individuals to achieve their fitness goals through
                  personalized training, cutting-edge equipment, and a supportive
                  community that celebrates every milestone.
                </p>
              </div>
            </div>

            <div
              className="mv-card vision"
                        style={{ backgroundImage: `url(${vcvard2})` }}

            >
              <div className="mv-overlay"></div>
              <div className="mv-content">
                <div className="mv-icon orange">
                  <i className="ri-eye-line"></i>
                </div>
                <h3>Our Vision</h3>
                <p>
                  To become the leading fitness destination that revolutionizes
                  how people approach wellness, creating lasting transformations
                  that extend beyond the gym.
                </p>
              </div>
            </div>
          </div>

          <div className="core-values">
            <h3>Our Core Values</h3>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon red">
                  <i className="ri-heart-line"></i>❤️
                </div>
                <h4>Passion</h4>
                <p>
                  We're passionate about fitness and helping others discover their potential
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon blue">
                  <i className="ri-shield-check-line"></i>✅
                </div>
                <h4>Integrity</h4>
                <p>Honest guidance and transparent practices in everything we do</p>
              </div>
              <div className="value-card">
                <div className="value-icon green">
                  <i className="ri-lightbulb-line"></i>💡
                </div>
                <h4>Innovation</h4>
                <p>Constantly evolving our methods and technology for better results</p>
              </div>
              <div className="value-card">
                <div className="value-icon purple">
                  <i className="ri-team-line"></i>🧑‍🤝‍🧑
                </div>
                <h4>Community</h4>
                <p>Building strong connections and supporting each other's journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>
       <section className="facility-section">
      <div className="container">
        {/* Section Title */}
        <div className="section-header">
          <h2>Our State-of-the-Art Facility</h2>
          <p>
            Explore our premium fitness facility designed to provide the perfect environment for your workout journey.
          </p>
        </div>

        {/* Facility Grid */}
        <div className="facility-grid">
          <div className="facility-card bg-gym1">
            <div className="card-overlay">
              <h3>Strength Training Zone</h3>
            </div>
          </div>

          <div className="facility-card bg-gym2">
            <div className="card-overlay">
              <h3>Cardio Section</h3>
            </div>
          </div>

          <div className="facility-card bg-gym3">
            <div className="card-overlay">
              <h3>Yoga Studio</h3>
            </div>
          </div>

          <div className="facility-card bg-gym4">
            <div className="card-overlay">
              <h3>Group Fitness Class</h3>
            </div>
          </div>

          <div className="facility-card bg-gym5">
            <div className="card-overlay">
              <h3>Personal Training Area</h3>
            </div>
          </div>

          <div className="facility-card bg-gym6">
            <div className="card-overlay">
              <h3>Recovery Zone</h3>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="amenities-section">
          <h3>Premium Amenities</h3>
          <div className="amenities-grid">
            <div className="amenity-card">
              <div className="amenity-icon red">🚗</div>
              <h4>Free Parking</h4>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon blue">🧥</div>
              <h4>Locker Rooms</h4>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon green">💧</div>
              <h4>Showers</h4>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon purple">📶</div>
              <h4>Free WiFi</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
     {/* <!-- ⭐ Review Section --> */}
  <div class="review-section">
    <h1 className="hesding"><ul>Review Section ✨</ul></h1>
    <h2>What Our Members Say</h2>
    <div class="reviews">
      <div class="review-card">
        <p>"FitVibe has completely transformed my fitness journey! The trainers are amazing."</p>
        <h4>- Sarah M.</h4>
      </div>
      <div class="review-card">
        <p>"I lost 10kg in 3 months thanks to their Fat Loss Program. Highly recommended!"</p>
        <h4>- John D.</h4>
      </div>
      <div class="review-card">
        <p>"The Yoga & Flexibility sessions helped me with back pain. Love it!"</p>
        <h4>- Priya S.</h4>
      </div>
    </div>
  </div>
   {/* 🌟 Add Review Form */}
        <div className="add-review">
          <h3>Leave a Review</h3>
          {submitted ? (
            <p className="thank-you">Thank you for your feedback! 💪</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={index <= (hover || rating) ? "on" : "off"}
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHover(index)}
                      onMouseLeave={() => setHover(rating)}
                    >
                      <span className="star">&#9733;</span>
                    </button>
                  );
                })}
              </div>
              <textarea
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
              <button type="submit" className="submit-btn">Submit Review</button>
            </form>
          )}
        </div>
    </>
  );
}

export default About;
