import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import trainerBanner from "../assests/trainer.png"; 
import priyaImg from "../assests/traniers/Priya.jpg";
import  arjunImg from "../assests/traniers/Arjun.webp";
import rajeshImg from "../assests/traniers/Rajesh.jpg";
import "./Traniers.css";

const fallbackImages = [arjunImg, priyaImg, rajeshImg];
const getTrainerImage = (trainer, index) => {
  if (trainer.image) return trainer.image;

  const name = (trainer.name || "").toLowerCase();

  // Explicit swap: Rajesh Kumar uses Priya image, Priya Sharma uses Rajesh image
  if (name.includes("priya")) return priyaImg;
  if (name.includes("rajesh")) return arjunImg;
  // if (name.includes("rajesh")) return rajeshImg;

  return fallbackImages[index % fallbackImages.length];
};

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Fetch available trainers for authenticated users
    fetch(`${API_URL}/api/users/trainers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTrainers(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load trainers"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleBook = async (trainer) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const selectedPlan = localStorage.getItem("selectedPlan");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (!selectedPlan) {
      // Force user to select plan first
      navigate("/programs");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planName: selectedPlan, trainerId: trainer._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Enroll failed");

      // Persist minimal client-side state for quick resume
      localStorage.setItem(
        `userProgramData_${user.email}`,
        JSON.stringify({
          name: user.name,
          email: user.email,
          plan: data.enrollment.planName,
          enrolledAt: data.enrollment.startedAt,
          workouts: data.enrollment.workouts.map(w => ({ title: w.title, duration: w.duration, calories: w.calories, completed: w.completed })),
          progress: 0,
        })
      );
      navigate("/workout");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <section className="hero-section"  style={{
         backgroundImage: `url(${trainerBanner})`,
         backgroundSize: "cover",
         backgroundPosition: "center",
         backgroundRepeat: "no-repeat",
         minHeight: "100vh",
         position: "relative",
       }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            Meet Our <span className="highlight">Expert Trainers</span>
          </h1>
          <p>
            Our certified professionals bring years of experience, passion, and
            personalized expertise to help you achieve your fitness goals.
          </p>
          <div className="stats">
            <div className="stat-card">
              <div className="icon">🏅</div>
              <h3>{trainers.length}+ Trainers</h3>
              <p>Certified professionals</p>
            </div>
            <div className="stat-card">
              <div className="icon">⏱️</div>
              <h3>100+ Years</h3>
              <p>Combined experience</p>
            </div>
            <div className="stat-card">
              <div className="icon">⭐</div>
              <h3>98% Success</h3>
              <p>Client satisfaction rate</p>
            </div>
          </div>
        </div>
      </section>
      <section className="trainers-section">
        <div className="container">
          <h2>Find Your Perfect Trainer</h2>
          <p>Choose from our diverse team of certified professionals to match your goals.</p>

          {loading && <p>Loading trainers...</p>}
          {error && <p className="error">{error}</p>}

          <div className="trainers-cards">
            {trainers.map((tr, idx) => (
              <div className="trainer-card" key={tr._id || idx}>
                <div className="img-container">
                  <img src={getTrainerImage(tr, idx)} alt={tr.name} />
                  <div className="price">{tr.rate || "₹1,200/hr"}</div>
                  <div className="rating">⭐ {tr.rating || 4.8}</div>
                </div>
                <h3>{tr.name}</h3>
                <p className="specialty">{tr.specialty}</p>
                <p className="experience">{tr.experience || "5+ years"}</p>
                <div className="actions">
                  <button className="view-btn" onClick={() => {}}>View Profile</button>
                  <button className="book-btn" onClick={() => handleBook(tr)}>Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Trainers;
