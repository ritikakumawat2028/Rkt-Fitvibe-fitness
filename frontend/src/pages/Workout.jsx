import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Workout.css";

/* --- UPDATED: SIMULATED WORKOUT DATABASE --- */
// This now includes all the workouts from your Programs.js file
const workoutDatabase = {
  // --- Original Entries ---
  "Full Body Blast": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
    description: "A comprehensive workout hitting all major muscle groups to build strength and endurance.",
    exercises: [
      { name: "Squats", reps: "3 sets of 12" },
      { name: "Push Ups", reps: "3 sets of 15" },
      { name: "Bent-Over Rows", reps: "3 sets of 12" },
      { name: "Overhead Press", reps: "3 sets of 10" },
      { name: "Plank", reps: "3 sets of 60s" },
      { name: "Bicep Curls", reps: "2 sets of 15" },
    ],
  },
  "Core & Cardio": {
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    description: "Burn calories and strengthen your core with this high-energy circuit.",
    exercises: [
      { name: "Jumping Jacks", reps: "3 sets of 60s" },
      { name: "Crunches", reps: "3 sets of 20" },
      { name: "Russian Twists", reps: "3 sets of 20" },
      { name: "Mountain Climbers", reps: "3 sets of 45s" },
      { name: "Leg Raises", reps: "3 sets of 15" },
    ],
  },
  "Upper Body Strength": {
    image: "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=1200&q=80",
    description: "Focus on building muscle and definition in your chest, back, shoulders, and arms.",
    exercises: [
      { name: "Bench Press", reps: "4 sets of 10" },
      { name: "Pull Ups", reps: "4 sets to failure" },
      { name: "Lateral Raises", reps: "3 sets of 15" },
      { name: "Tricep Dips", reps: "3 sets of 15" },
      { name: "Face Pulls", reps: "3 sets of 20" },
    ],
  },

  // --- NEW: Entries for "Strength Training" Program ---
  "Upper Body Workout": {
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    description: "A focused session to build strength and definition in your chest, back, and shoulders.",
    exercises: [
      { name: "Dumbbell Bench Press", reps: "4 sets of 10" },
      { name: "Lat Pulldowns", reps: "4 sets of 12" },
      { name: "Seated Cable Rows", reps: "3 sets of 12" },
      { name: "Arnold Press", reps: "3 sets of 10" },
      { name: "Tricep Pushdowns", reps: "3 sets of 15" },
    ],
  },
  "Lower Body Strength": {
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80",
    description: "Build a powerful foundation with these essential lower body exercises.",
    exercises: [
      { name: "Barbell Squats", reps: "4 sets of 8-10" },
      { name: "Romanian Deadlifts", reps: "3 sets of 12" },
      { name: "Leg Press", reps: "3 sets of 15" },
      { name: "Walking Lunges", reps: "3 sets of 10/leg" },
      { name: "Calf Raises", reps: "4 sets of 20" },
    ],
  },

  // --- NEW: Entries for "Yoga & Flexibility" Program ---
  "Morning Yoga": {
    image: "https://images.unsplash.com/photo-1591291621226-9745812c3b8c?auto=format&fit=crop&w=1200&q=80",
    description: "Start your day with an energizing flow to awaken your body and focus your mind.",
    exercises: [
      { name: "Sun Salutation A", reps: "5 rounds" },
      { name: "Cat-Cow Stretch", reps: "10 rounds" },
      { name: "Warrior II", reps: "60s per side" },
      { name: "Triangle Pose", reps: "60s per side" },
      { name: "Savasana", reps: "5 minutes" },
    ],
  },
  "Evening Flexibility": {
    image: "https://images.unsplash.com/photo-1599901860904-16e6f59018ce?auto=format&fit=crop&w=1200&q=80",
    description: "Unwind and release tension with this calming flexibility and deep-stretch routine.",
    exercises: [
      { name: "Seated Forward Fold", reps: "2 minutes" },
      { name: "Pigeon Pose", reps: "90s per side" },
      { name: "Spinal Twist", reps: "60s per side" },
      { name: "Child's Pose", reps: "2 minutes" },
      { name: "Legs Up the Wall", reps: "5 minutes" },
    ],
  },

  // --- NEW: Entries for "HIIT Training" Program ---
  "HIIT Cardio": {
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    description: "A high-intensity interval session designed to torch calories and boost your cardiovascular endurance.",
    exercises: [
      { name: "Burpees", reps: "45s work, 15s rest" },
      { name: "High Knees", reps: "45s work, 15s rest" },
      { name: "Jump Squats", reps: "45s work, 15s rest" },
      { name: "Skaters", reps: "45s work, 15s rest" },
      { name: "Repeat Circuit", reps: "4 rounds" },
    ],
  },
  "HIIT Core": {
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
    description: "Strengthen your entire core with this fast-paced and challenging HIIT-style ab workout.",
    exercises: [
      { name: "Mountain Climbers", reps: "40s work, 20s rest" },
      { name: "Plank Jacks", reps: "40s work, 20s rest" },
      { name: "Bicycle Crunches", reps: "40s work, 20s rest" },
      { name: "V-Ups", reps: "40s work, 20s rest" },
      { name: "Repeat Circuit", reps: "4 rounds" },
    ],
  },
};


// Helper to get a dynamic fallback image
const getFallbackImage = (title) => {
  const keywords = ["fitness", "workout", "gym", "exercise", title];
  return `https://source.unsplash.com/500x400/?${keywords.join(",")}`;
}


const Workout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [modalWorkout, setModalWorkout] = useState(null);

  const dailyTip = "Remember to stay hydrated! Drinking water before, during, and after your workout helps regulate body temperature and lubricate your joints.";

  const calculateProgress = (workouts) => {
    if (!workouts || workouts.length === 0) return 0;
    const completed = workouts.filter((w) => w.completed).length;
    return Math.round((completed / workouts.length) * 100);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    const loadEnrollment = async () => {
      // Try to load the active enrollment from the SERVER first
      try {
        const res = await fetch("http://localhost:5000/api/users/enrollment", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const enrollment = data.enrollment || {};

          // Cache a minimal copy locally for quick access
          const simpleWorkouts = (enrollment.workouts || []).map((w) => ({
            title: w.title,
            duration: w.duration,
            calories: w.calories,
            completed: w.completed,
          }));

          localStorage.setItem(
            `userProgramData_${storedUser.email}`,
            JSON.stringify({
              name: storedUser.name,
              email: storedUser.email,
              plan: enrollment.planName,
              enrolledAt: enrollment.startedAt,
              workouts: simpleWorkouts,
              progress: 0,
            })
          );

          // Enrich workouts with description/images from workoutDatabase for display
          const enhancedFromServer = simpleWorkouts.map((w) => {
            const dbEntry = workoutDatabase[w.title] || {};
            return {
              ...dbEntry,
              ...w,
              image: w.image || dbEntry.image || getFallbackImage(w.title),
            };
          });

          setUserWorkouts(enhancedFromServer);
          setProgress(calculateProgress(enhancedFromServer));
          return; // Done, no need to fall back to local-only data
        }
      } catch (err) {
        console.error("Failed to load enrollment from server:", err);
        // If server call fails, we simply fall back to local data below
      }

      // --- Fallback: use any locally cached enrollment if present ---
      const userData = JSON.parse(
        localStorage.getItem(`userProgramData_${storedUser.email}`)
      );

      if (userData && userData.workouts) {
        const enhancedWorkouts = userData.workouts.map((w) => {
          const dbEntry = workoutDatabase[w.title] || {};
          return {
            ...dbEntry,
            ...w,
            image: w.image || dbEntry.image || getFallbackImage(w.title),
          };
        });

        setUserWorkouts(enhancedWorkouts);
        setProgress(calculateProgress(enhancedWorkouts));
      } else {
        // No enrollment anywhere – send user to select a program
        navigate("/programs");
      }
    };

    loadEnrollment();
  }, [navigate]);

  const openWorkoutModal = (index) => setModalWorkout(userWorkouts[index]);
  const closeModal = () => setModalWorkout(null); // Function to close modal

  const completeWorkout = async () => {
    if (!modalWorkout || !user) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Tell the server that this workout is completed so data is persisted
      const res = await fetch("http://localhost:5000/api/users/workouts/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: modalWorkout.title }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update workout status");
      }

      const enrollment = data.enrollment || {};

      // Rebuild simple workout list from server response
      const simpleWorkouts = (enrollment.workouts || []).map((w) => ({
        title: w.title,
        duration: w.duration,
        calories: w.calories,
        completed: w.completed,
      }));

      const existingData =
        JSON.parse(localStorage.getItem(`userProgramData_${user.email}`)) || {};

      localStorage.setItem(
        `userProgramData_${user.email}`,
        JSON.stringify({
          ...existingData,
          plan: enrollment.planName || existingData.plan,
          enrolledAt: enrollment.startedAt || existingData.enrolledAt,
          workouts: simpleWorkouts,
        })
      );

      // Enrich for UI (images, descriptions, exercises)
      const enhancedWorkouts = simpleWorkouts.map((w) => {
        const dbEntry = workoutDatabase[w.title] || {};
        return {
          ...dbEntry,
          ...w,
          image: w.image || dbEntry.image || getFallbackImage(w.title),
        };
      });

      setUserWorkouts(enhancedWorkouts);
      setProgress(calculateProgress(enhancedWorkouts));

      closeModal(); // Stay on the workout page so the user sees the updated progress
    } catch (err) {
      console.error("Error marking workout complete:", err);
      alert(err.message || "Something went wrong while completing the workout.");
    }
  };

  const handleProgramEnd = () => {
    if (!user) return;

    const completedWorkouts = userWorkouts.filter((w) => w.completed).length;
    const totalCalories = userWorkouts.reduce(
      (acc, w) => acc + (w.completed ? w.calories || 0 : 0),
      0
    );
    const totalHours = userWorkouts.reduce(
      (acc, w) => acc + (w.completed ? w.duration || 0 : 0),
      0
    );

    const dashboardKey = `dashboardData_${user.email}`;
    const dashboardData = JSON.parse(localStorage.getItem(dashboardKey)) || {
      stats: {},
      achievements: [],
    };

    const oldStats = dashboardData.stats || {};
    dashboardData.stats = {
      totalWorkouts: (oldStats.totalWorkouts || 0) + completedWorkouts,
      caloriesBurned: (oldStats.caloriesBurned || 0) + totalCalories,
      hoursTrained: (oldStats.hoursTrained || 0) + totalHours,
      programsCompleted: (oldStats.programsCompleted || 0) + 1,
    };

    localStorage.setItem(dashboardKey, JSON.stringify(dashboardData));
    localStorage.removeItem(`userProgramData_${user.email}`);
    navigate("/dashboard");
  };

  if (!user) return null;

  const todayWorkoutIndex = userWorkouts.findIndex(w => !w.completed);
  const todayWorkout = todayWorkoutIndex !== -1 ? userWorkouts[todayWorkoutIndex] : null;
  const popularWorkouts = userWorkouts.filter((w, i) => i !== todayWorkoutIndex);

  return (
    <div className="workout-container">
      {/* Header */}
      <header className="header-section">
        <div className="user-info">
          <div className="avatar"></div>
          <div>
            <h2>
              Good Morning, <span className="highlight">{user.name}</span>
            </h2>
            <p>
              Workout Progress —{" "}
              {userWorkouts.filter((w) => !w.completed).length} Exercises Left
            </p>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      </header>

      {/* Today's Workout */}
      {todayWorkout && (
        <section className="today-section">
          <h3 className="section-title">Today’s Workout</h3>
          <div className="today-card">
            <img
              src={todayWorkout.image}
              alt={todayWorkout.title}
            />
            <div className="today-overlay">
              <p>
                ⏱ {todayWorkout.duration} min | 🔥 {todayWorkout.calories}{" "}
                kcal
              </p>
              <h2>{todayWorkout.title}</h2>
              <button className="start-btn" onClick={() => openWorkoutModal(todayWorkoutIndex)}>
                Start
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Popular Workouts */}
      {popularWorkouts.length > 0 && (
        <section className="popular-section">
          <h3>Upcoming Exercises</h3>
          <div className="popular-grid">
            {popularWorkouts.map((w, i) => {
              const originalIndex = userWorkouts.findIndex(uw => uw.title === w.title);
              return (
                <div key={i} className="popular-card">
                  <img
                    src={w.image} 
                    alt={w.title}
                  />
                  <div className="card-content">
                    <h4>{w.title}</h4>
                    <p>
                      ⏱ {w.duration} min • 🔥 {w.calories} kcal
                    </p>
                    <button
                      className="small-btn"
                      onClick={() => openWorkoutModal(originalIndex)}
                    >
                      {w.completed ? "Done" : "Start"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Daily Tip Feature (moved below sections) */}
      <section className="daily-tip-section">
        <div className="tip-icon">💡</div>
        <div className="tip-content">
          <h4>Daily Fitness Tip</h4>
          <p>{dailyTip}</p>
        </div>
      </section>

      {/* End Program */}
      <div className="end-program">
        <button className="end-btn" onClick={handleProgramEnd}>
          End Program & Go to Dashboard
        </button>
      </div>

      {/* --- UPDATED DYNAMIC MODAL --- */}
      {modalWorkout && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalWorkout.image} alt={modalWorkout.title} className="modal-image" />

            <div className="modal-details">
              <h2>{modalWorkout.title}</h2>
              <p className="modal-stats">
                ⏱ {modalWorkout.duration} min | 🔥 {modalWorkout.calories} kcal
              </p>
              <p className="modal-description">
                {modalWorkout.description || "Focus on your form and complete all the sets. You've got this!"}
              </p>

              <h4 className="exercise-list-title">Session Exercises:</h4>
              <ul className="exercise-list">
                {modalWorkout.exercises && modalWorkout.exercises.length > 0 ? (
                  modalWorkout.exercises.map((ex, i) => (
                    <li key={i} className="exercise-item">
                      <span className="exercise-name">{ex.name}</span>
                      <span className="exercise-reps">{ex.reps}</span>
                    </li>
                  ))
                ) : (
                  <li className="exercise-item-none">No specific exercises listed for this session.</li>
                )}
              </ul>

              <button className="done-btn" onClick={completeWorkout}>
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;