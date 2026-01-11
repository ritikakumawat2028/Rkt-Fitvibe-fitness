import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ---- Reusable Components ----
const StatCard = ({ icon, value, label, color }) => (
  <div className="stat">
    <div className={`icon ${color}`}>
      <i className={icon}></i>
    </div>
    <div className="value">{value}</div>
    <div className="label">{label}</div>
  </div>
);

const AchievementCard = ({ icon, title, description, completed }) => (
  <div className={`achievement ${completed ? "success" : "pending"}`}>
    <div className={`icon ${completed ? "green" : "gray"}`}>
      <i className={icon}></i>
    </div>
    <div className="details">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
    {completed && (
      <div className="check">
        <i className="ri-check-line"></i>
      </div>
    )}
  </div>
);

// --- UPDATED: Using the component definition from your latest code ---
const QuickActionButton = ({ icon, label, color, onClick }) => (
  <button className={`quick-action ${color}`} onClick={onClick}>
    <i className={icon}></i> {label}
  </button>
);

// ---- Main Dashboard ----
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    caloriesBurned: 0,
    hoursTrained: 0,
    programsCompleted: 0,
  });
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const navigate = useNavigate();

  // --- NEW: State for the Nutrition Modal ---
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);

  // ---- Load User and Personalized Data ----
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    const userDataKey = `dashboardData_${storedUser.email}`;
    const storedData = localStorage.getItem(userDataKey);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Ensure stats object is complete, providing defaults if needed
      setStats(parsedData.stats || { totalWorkouts: 0, caloriesBurned: 0, hoursTrained: 0, programsCompleted: 0 });
      setAchievements(parsedData.achievements || []);
      setTodayWorkout(parsedData.todayWorkout);
    } else {
      initializeUserData(storedUser);
    }
  }, [navigate]);

  // ---- Initialize Data based on Plan ----
  const initializeUserData = (user) => {
    const planWorkouts = {
      Beginner: { name: "Full Body Basics", duration: 40, trainer: "Anjali Singh", estCalories: 250 },
      Intermediate: { name: "Strength & Conditioning", duration: 60, trainer: "Rohit Mehra", estCalories: 400 },
      Advanced: { name: "HIIT Power Session", duration: 75, trainer: "Vikram Rao", estCalories: 550 },
    };

    const selectedWorkout = planWorkouts[user.plan] || planWorkouts.Beginner;

    const newData = {
      stats: { totalWorkouts: 0, caloriesBurned: 0, hoursTrained: 0, programsCompleted: 0 },
      achievements: [
        { title: "First Step!", description: "Completed your first workout", icon: "ri-run-line", completed: false },
        { title: "Consistency King", description: "Worked out 7 days in a row", icon: "ri-calendar-check-line", completed: false },
        { title: "Burn 1000", description: "Burned 1000 total calories", icon: "ri-fire-line", completed: false },
      ],
      todayWorkout: { ...selectedWorkout, time: "6:30 AM", completed: false },
    };

    setStats(newData.stats);
    setAchievements(newData.achievements);
    setTodayWorkout(newData.todayWorkout);
    localStorage.setItem(`dashboardData_${user.email}`, JSON.stringify(newData));
  };

  // ---- Save Data per User ----
  const saveUserData = (updatedData) => {
    if (!user) return;
    localStorage.setItem(`dashboardData_${user.email}`, JSON.stringify(updatedData));
  };

  // ---- Mark Workout as Completed ----
  // --- Renamed from startWorkout in your code to avoid confusion ---
  const completeTodayWorkout = () => {
    // --- Added null check for todayWorkout ---
    if (!todayWorkout || todayWorkout.completed) return;

    const updatedStats = {
      totalWorkouts: stats.totalWorkouts + 1,
      // --- Added null check for estCalories ---
      caloriesBurned: stats.caloriesBurned + (todayWorkout.estCalories || 0),
      hoursTrained: stats.hoursTrained + (todayWorkout.duration || 0) / 60,
      programsCompleted: stats.programsCompleted, // Assuming this is updated elsewhere
    };

    const updatedAchievements = achievements.map((a) => {
      if (a.title === "First Step!") return { ...a, completed: true };
      // --- Added null check for caloriesBurned ---
      if ((updatedStats.caloriesBurned || 0) >= 1000 && a.title === "Burn 1000") return { ...a, completed: true };
      return a;
    });

    const updatedWorkout = { ...todayWorkout, completed: true };

    setStats(updatedStats);
    setAchievements(updatedAchievements);
    setTodayWorkout(updatedWorkout);

    saveUserData({ stats: updatedStats, achievements: updatedAchievements, todayWorkout: updatedWorkout });
  };

  // ---- Logout ----
  const handleLogout = () => {
    localStorage.removeItem("user");
    // Optionally remove user-specific data too
    // if (user) {
    //   localStorage.removeItem(`dashboardData_${user.email}`);
    // }
    navigate("/login");
  };

  // --- NEW: Handlers for Quick Actions ---

  // 1. Redirects to /workout (Using navigate directly)
  const startNewWorkout = () => {
    navigate("/workout");
  };

  // 2. Redirects to /programs
  const viewPrograms = () => {
    navigate("/programs");
  };

  // 3. Opens the new nutrition modal
  const openNutritionModal = () => {
    setIsNutritionModalOpen(true);
  };

  // 4. Closes the new nutrition modal
  const closeNutritionModal = () => {
    setIsNutritionModalOpen(false);
  };

  // --- Derived values for reminders section ---
  // Treat "hasWorkoutToday" as whether today's workout is completed
  const hasWorkoutToday = !!todayWorkout?.completed;
  // Use total workouts as a simple proxy for weekly workout count to avoid undefined errors
  const weeklyWorkoutCount = stats.totalWorkouts || 0;

  if (!user || !todayWorkout) return null; // Loading state or redirect handled by useEffect

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="welcome-banner">
        <h1>Welcome back, {user.name}!</h1>
        <p>
          Plan: <b>{user.plan || "Beginner"}</b> • Ready for today’s workout?
        </p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Fitness Overview */}
      <div className="fitness-grid">
        {/* Left */}
        <div className="fitness-left">
          <div className="card">
            <h3>Your Fitness Stats</h3>
            <div className="stats-grid">
              <StatCard icon="ri-run-line" value={stats.totalWorkouts || 0} label="Total Workouts" color="red" />
              <StatCard icon="ri-fire-line" value={stats.caloriesBurned || 0} label="Calories Burned" color="orange" />
              <StatCard icon="ri-time-line" value={(stats.hoursTrained || 0).toFixed(1)} label="Hours Trained" color="blue" />
              <StatCard icon="ri-trophy-line" value={stats.programsCompleted || 0} label="Programs Completed" color="green" />
            </div>
          </div>

          <div className="card">
            <h3>Achievements</h3>
            <div className="achievements">
              {achievements.map((a, i) => <AchievementCard key={i} {...a} />)}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="fitness-right">
          <div className="card gradient-card">
            <h3>Today's Workout</h3>
            <div className="workout-grid">
              <div>
                <h4>{todayWorkout.name}</h4>
                <p><i className="ri-time-line"></i> {todayWorkout.duration} mins</p>
                <p><i className="ri-user-line"></i> Trainer: {todayWorkout.trainer}</p>
                <p><i className="ri-calendar-line"></i> {todayWorkout.time}</p>
              </div>
              <div className="calories">
                <div className="value">{todayWorkout.estCalories}</div>
                <div className="label">Calories</div>
              </div>
            </div>
            <button
              className={`start-btn ${todayWorkout.completed ? "completed" : ""}`}
              onClick={completeTodayWorkout} // Calls the function to mark today's workout done
              disabled={todayWorkout.completed}
            >
              {todayWorkout.completed ? "Completed ✅" : "Complete Workout"}
            </button>
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <div className="quick-grid">
              {/* --- UPDATED: Wired up onClick handlers --- */}
              <QuickActionButton 
                icon="ri-play-circle-line" 
                label="Start Workout" 
                color="red" 
                onClick={startNewWorkout} // Redirects to /workout
              />
              <QuickActionButton 
                icon="ri-line-chart-line" 
                label="View Progress" 
                color="blue" 
                onClick={viewPrograms} // Redirects to /programs
              />
              <QuickActionButton 
                icon="ri-apple-line" 
                label="Nutrition Plan" 
                color="orange" 
                onClick={openNutritionModal} // Opens the modal
              />
            </div>
          </div>

          {/* Today's Reminders moved into the right column */}
          <div className="card reminders-card">
            <h3>Today's Reminders</h3>
            <div className="reminders-list">
              <div className="reminder-item yellow">
                <div className="reminder-icon">💧</div>
                <div className="reminder-text">
                  <div className="reminder-title">Hydration Goal</div>
                  <div className="reminder-sub">
                    {hasWorkoutToday
                      ? "You trained today—aim to drink enough water to recover."
                      : "Stay hydrated even on lighter days. Sip water regularly."}
                  </div>
                </div>
              </div>

              <div className="reminder-item green">
                <div className="reminder-icon">🏃</div>
                <div className="reminder-text">
                  <div className="reminder-title">Movement Goal</div>
                  <div className="reminder-sub">
                    {weeklyWorkoutCount > 0
                      ? `You've logged ${weeklyWorkoutCount} workout${
                          weeklyWorkoutCount === 1 ? "" : "s"
                        } this week. Keep the streak going!`
                      : "No workouts logged in this period yet—start with a short session."}
                  </div>
                </div>
              </div>

              <div className="reminder-item blue">
                <div className="reminder-icon">🌙</div>
                <div className="reminder-text">
                  <div className="reminder-title">Recovery & Sleep</div>
                  <div className="reminder-sub">
                    {hasWorkoutToday
                      ? "Plan for good sleep and light stretching to recover from today's workout."
                      : "Use today to rest, stretch, and prepare for your next workout."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW: Nutrition Modal JSX --- */}
      {isNutritionModalOpen && (
        <div className="modal-overlay" onClick={closeNutritionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-details">
              <h2>Nutrition Tips</h2>
              <p className="modal-description">
                A balanced diet is key to achieving your fitness goals. Here are some quick tips to get you started:
              </p>
              
              <ul className="nutrition-list">
                <li>
                  <strong>Prioritize Protein:</strong> Aim for a protein source in every meal (chicken, fish, beans, tofu) to help repair and build muscle.
                </li>
                <li>
                  <strong>Stay Hydrated:</strong> Drink at least 8-10 glasses of water a day. Dehydration can significantly decrease performance.
                </li>
                <li>
                  <strong>Eat Whole Foods:</strong> Focus on unprocessed foods like fruits, vegetables, whole grains, and lean proteins.
                </li>
                <li>
                  <strong>Don't Fear Healthy Fats:</strong> Avocados, nuts, seeds, and olive oil are essential for hormone balance and long-term energy.
                </li>
                <li>
                  <strong>Time Your Carbs:</strong> Eat complex carbohydrates (like oats or brown rice) before your workout for energy, and after to refuel.
                </li>
                <li>
                  <strong>Limit Processed Sugars:</strong> Sugary drinks and snacks can cause energy crashes and hinder progress.
                </li>
              </ul>
              
              <button className="done-btn" onClick={closeNutritionModal}>
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

