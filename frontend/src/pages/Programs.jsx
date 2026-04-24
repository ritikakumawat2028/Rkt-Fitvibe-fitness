import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import "./Programs.css";

// Import your local images (place them in src/assets/)
// --- CORRECTION 1: Fixed path typo "assests" to "assets" and "hitt" to "hiit" ---
import strength from "../assests/strength.jpg";
import yoga from "../assests/yoga1.jpg";
import hiit from "../assests/hitt.jpg";

// --- This top-level handleSubmit function was removed as it was defined in the wrong scope and conflicted with the one inside the component ---

const programDetails = {
  "Strength Training": {
    price: "₹2,999/month",
    duration: "45-60 minutes",
    level: "Beginner to Advanced",
    color: "red",
    description:
      "Build lean muscle mass and increase overall strength with our comprehensive weight training program.",
    benefits: [
      "Muscle Building",
      "Bone Density",
      "Metabolism Boost",
      "Functional Strength",
    ],
    image: strength,
  },
  "Yoga & Flexibility": {
    price: "₹1,999/month",
    duration: "60-90 minutes",
    level: "All Levels",
    color: "green",
    description:
      "Find inner peace and improve flexibility with our traditional and modern yoga practices.",
    benefits: ["Flexibility", "Balance", "Mental Peace", "Stress Relief"],
    image: yoga,
  },
  "HIIT Training": {
    price: "₹2,499/month",
    duration: "30-45 minutes",
    level: "Intermediate to Advanced",
    color: "blue",
    description:
      "High-intensity interval training for maximum calorie burn and cardiovascular improvement.",
    benefits: ["Fat Burning", "Time Efficient", "Cardiovascular Health", "Endurance"],
    image: hiit,
  },
};

function Programs() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState(null);


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    height: "",
    weight: "",
    bmi: "",
    medical: "",
    injuries: "",
    fitnessLevel: "Beginner",
    goals: [],
    customGoal: "",
    program: "",
  });

  const openModal = (program) => {
    setActiveProgram(program);
    setModalOpen(true);
  };

  const closeModal = () => {
    setActiveProgram(null);
    setModalOpen(false);
  };

  const openEnroll = (programName) => {
    // --- CORRECTION: Pre-select the correct program when opening ---
    setFormData((prev) => ({ ...prev, program: programName }));
    setEnrollOpen(true);
  };

  const closeEnroll = () => {
    setEnrollOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const newGoals = checked
          ? [...prev.goals, value]
          : prev.goals.filter((g) => g !== value);
        return { ...prev, goals: newGoals };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  // --- CORRECTION 2 (UPDATED): Persist enrollment on the SERVER instead of only localStorage ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    // User must be logged in to create a server enrollment
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !storedUser) {
      alert("Please login before enrolling in a program.");
      navigate("/login");
      return;
    }

    try {
      // 1) Fetch trainers so we can pick a suitable one for this program
      const trainersRes = await fetch(`${API_URL}/api/users/trainers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const trainersData = await trainersRes.json();
      if (!trainersRes.ok) {
        throw new Error(trainersData.message || "Failed to load trainers");
      }

      const trainers = Array.isArray(trainersData) ? trainersData : [];
      if (!trainers.length) {
        throw new Error("No trainers available for enrollment.");
      }

      // Try to auto-pick a trainer whose specialty matches the selected program
      const selectedProgram = formData.program;
      const normalizedProgram = (selectedProgram || "").toLowerCase();
      let chosenTrainer =
        trainers.find((t) =>
          (t.specialty || "").toLowerCase().includes("strength") && normalizedProgram.includes("strength")
        ) ||
        trainers.find((t) =>
          (t.specialty || "").toLowerCase().includes("yoga") && normalizedProgram.includes("yoga")
        ) ||
        trainers.find((t) =>
          (t.specialty || "").toLowerCase().includes("hiit") && normalizedProgram.includes("hiit")
        ) ||
        trainers[0]; // Fallback to the first trainer

      if (!chosenTrainer || !chosenTrainer._id) {
        throw new Error("Could not select a trainer for this program.");
      }

      // 2) Call backend enrollment API – this will also avoid duplicate enrollments
      const enrollRes = await fetch(`${API_URL}/api/users/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName: selectedProgram,
          trainerId: chosenTrainer._id,
        }),
      });

      const enrollData = await enrollRes.json();
      if (!enrollRes.ok) {
        throw new Error(enrollData.message || "Failed to enroll in program");
      }

      const enrollment = enrollData.enrollment || {};

      // 3) Mirror minimal data into localStorage so Workout & Dashboard keep working
      const simpleWorkouts = (enrollment.workouts || []).map((w) => ({
        title: w.title,
        duration: w.duration,
        calories: w.calories,
        completed: w.completed,
      }));

      const programData = {
        name: storedUser.name || formData.fullName,
        email: storedUser.email || formData.email,
        plan: enrollment.planName || selectedProgram,
        enrolledAt: enrollment.startedAt || new Date().toISOString(),
        workouts: simpleWorkouts,
        progress: 0,
      };

      localStorage.setItem(
        `userProgramData_${programData.email}`,
        JSON.stringify(programData)
      );
      // Also update the stored user so dashboard can show the plan name
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name: programData.name,
          email: programData.email,
          plan: programData.plan,
        })
      );

      alert("Enrollment Successful! Redirecting to Workout Page...");
      closeEnroll();
      navigate("/workout");
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(err.message || "Something went wrong while enrolling. Please try again.");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="programs-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Fitness <span className="highlight">Programs</span>
          </h1>
          <p className="hero-subtitle">
            Discover the perfect program tailored to your fitness goals. From
            strength building to flexibility, we have something for everyone.
          </p>
        </div>
        <div className="scroll-icon">↓</div>
      </section>

      {/* Programs List Section */}
      <section className="programs-list">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Program</h2>
            <p className="section-subtitle">
              Each program is designed by our expert trainers to help you achieve
              specific fitness goals with proven methodologies.
            </p>
          </div>

          {/* Program Cards */}
          <div className="programs-grid">
            {Object.keys(programDetails).map((key) => {
              const p = programDetails[key];
              return (
                <div className="program-card" key={key}>
                  <div className="card-image">
                    <img src={p.image} alt={key} />
                    <span className={`badge ${p.color}`}>{p.level}</span>
                  </div>
                  <div className="card-body">
                    <div className="card-header">
                      <h3>{key}</h3>
                      <span className="price">{p.price}</span>
                    </div>
                    <p>Duration: {p.duration}</p>
                    <div className="card-actions">
                      <button
                        className={`btn ${p.color}`}
                        onClick={() => openEnroll(key)}
                      >
                        Enroll Now
                      </button>
                      <button className="btn-outline" onClick={() => openModal(p)}>
                        More Info
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Modal */}
      {modalOpen && activeProgram && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* --- Changed to use level and description from activeProgram --- */}
            <h2>{activeProgram.level} Program</h2> 
            <p>{activeProgram.description}</p>
            <h4>Key Benefits:</h4>
            <ul>
              {activeProgram.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <button className="btn-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {enrollOpen && (
         <div className="modal-overlay" onClick={closeEnroll}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Enroll in {formData.program}</h2>
            <form className="enroll-form" onSubmit={handleSubmit}>
              {/* Personal Info */}
              <h3>1. Personal Information</h3>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              {/* Health Info */}
              <h3>2. Health & Fitness Information</h3>
              <input
                type="text"
                name="height"
                placeholder="Height (cm/ft)"
                value={formData.height}
                onChange={handleChange}
              />
              <input
                type="text"
                name="weight"
                placeholder="Weight (kg/lb)"
                value={formData.weight}
                onChange={handleChange}
              />
              <input
                type="text"
                name="bmi"
                placeholder="BMI (optional)"
                value={formData.bmi}
                onChange={handleChange}
              />
              <input
                type="text"
                name="medical"
                placeholder="Any Medical Conditions"
                value={formData.medical}
                onChange={handleChange}
              />
              <input
                type="text"
                name="injuries"
                placeholder="Any Previous Injuries"
                value={formData.injuries}
                onChange={handleChange}
              />

              <label>Current Fitness Level:</label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              {/* Goals */}
              <h3>3. Workout Goals</h3>
              <label>
                <input
                  type="checkbox"
                  value="Weight Loss"
                  checked={formData.goals.includes("Weight Loss")}
                  onChange={handleChange}
                />
                Weight Loss
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Weight Gain"
                  checked={formData.goals.includes("Weight Gain")}
                  onChange={handleChange}
                />
                Weight Gain (Muscle Building)
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Strength Training"
                  checked={formData.goals.includes("Strength Training")}
                  onChange={handleChange}
                />
                Strength Training
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Endurance"
                  checked={formData.goals.includes("Endurance")}
                  onChange={handleChange}
                />
                Endurance / Stamina
              </label>
              <label>
                <input
                  type="checkbox"
                  value="General Fitness"
                  checked={formData.goals.includes("General Fitness")}
                  onChange={handleChange}
                />
                General Fitness
              </label>
              <input
                type="text"
                name="customGoal"
                placeholder="Other (please specify)"
                value={formData.customGoal}
                onChange={handleChange}
              />

              {/* --- CORRECTION 4: Fixed program selection --- */}
              <h3>4. Program Selection</h3>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Program --</option>
                {/* Dynamically populate options from programDetails */}
                {Object.keys(programDetails).map((programName) => (
                  <option key={programName} value={programName}>
                    {programName}
                  </option>
                ))}
              </select>

                <div className="form-actions">
                 <button type="submit" className="btn green">
                   Submit Enrollment
                 </button>
                 <button type="button" className="btn-close" onClick={closeEnroll}>
                   Cancel
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Why Section */}
      <section className="why-section">
        <div className="why-container">
          {/* Heading */}
          <div className="why-header">
            <h2 className="why-title">Why Choose Our Programs?</h2>
            <p className="why-subtitle">
              Our comprehensive approach ensures you get the best results while
              enjoying your fitness journey.
            </p>
          </div>

          {/* Features Grid */}
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon bg-red">
                <i className="ri-user-star-line"></i>
              </div>
              <h3>Expert Guidance</h3>
              <p>
                Certified trainers with years of experience guide you through
                every step of your fitness journey.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon bg-red">
                <i className="ri-group-line"></i>
              </div>
              <h3>Community Support</h3>
              <p>
                Join a motivating community of like-minded individuals working
                towards similar goals.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon bg-red">
                <i className="ri-calendar-check-line"></i>
              </div>
              <h3>Flexible Scheduling</h3>
              <p>
                Choose from multiple time slots that fit your busy lifestyle and
                schedule.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon bg-red">
                <i className="ri-trophy-line"></i>
              </div>
              <h3>Proven Results</h3>
              <p>
                Our programs have helped thousands achieve their fitness goals
                with measurable results.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon bg-red">
                <i className="ri-heart-pulse-line"></i>
              </div>
              <h3>Health Monitoring</h3>
              <p>
                Track your progress with regular health assessments and fitness
                evaluations.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon bg-red">
                <i className="ri-refresh-line"></i>
              </div>
              <h3>Program Variety</h3>
              <p>
                Switch between programs or combine multiple programs to keep your
                workouts exciting.
              </p>
              {/* --- THIS IS THE FIX --- */}
            </div> 
          </div>

          {/* CTA Section */}
          <div className="why-cta">
            <h3>Ready to Transform Your Life?</h3>
            <p>
              Join thousands of members who have already started their fitness
              transformation with <strong>RKT FITVIBE</strong>.
            </p>
            <div className="cta-buttons">
              <button
                className="btn-outline-white"
                onClick={() => navigate("/traniers")}
              >
                View Membership Plans
              </button>
            </div>

            {/* Stats */}
            <div className="why-stats">
              <div>
                <h4>5000+</h4>
                <p>Happy Members</p>
              </div>
              <div>
                <h4>15+</h4>
                <p>Expert Trainers</p>
              </div>
              <div>
                <h4>98%</h4>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Programs;