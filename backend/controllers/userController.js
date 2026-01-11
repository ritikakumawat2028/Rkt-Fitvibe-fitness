    // backend/controllers/userController.js
    import User from "../models/User.js";
    // Import other models as needed later (e.g., ProgramEnrollment, WorkoutSession)

    // @desc    Get logged-in user's profile
    // @route   GET /api/users/me
    // @access  Private (User only via userAuth middleware)
    export const getUserProfile = async (req, res) => { // Make sure 'export' is here
      // req.user should be attached by the userAuth middleware
      if (req.user) {
        // Return only necessary, non-sensitive profile data
        res.json({
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          plan: req.user.plan,
          phone: req.user.phone, 
          age: req.user.age,
          gender: req.user.gender,
          goal: req.user.goal,
          createdAt: req.user.createdAt,
        });
      } else {
        // This case should ideally not happen if userAuth middleware works correctly
        res.status(404).json({ message: "User not found after authentication." });
      }
    };

    // @desc    Get logged-in user's dashboard data (Placeholder/Example)
    // @route   GET /api/users/me/dashboard
    // @access  Private (User only via userAuth middleware)
    export const getUserDashboard = async (req, res) => { // Make sure 'export' is here
        // req.user is available here too
        const userId = req.user._id;

        try {
            // --- Placeholder Logic ---
            // In a real application, you would perform database queries here:
            // 1. Fetch user's active program enrollment.
            // 2. Query WorkoutSession collection for completed workouts (count, aggregate calories/duration).
            // 3. Determine achievements based on aggregated stats.
            // 4. Find the next upcoming workout session for the user.

            // Example static data based on user's plan (similar to frontend initialization)
             const planWorkouts = {
                'Strength Training': { name: "Upper Body Workout", duration: 60, trainer: "Rohit Mehra", estCalories: 400 },
                'Yoga & Flexibility': { name: "Morning Yoga", duration: 60, trainer: "Priya Sharma", estCalories: 200 },
                'HIIT Training': { name: "HIIT Cardio", duration: 30, trainer: "Vikram Rao", estCalories: 300 },
                default: { name: "Full Body Basics", duration: 40, trainer: "Anjali Singh", estCalories: 250 }
            };

            const userPlanKey = req.user.plan && planWorkouts[req.user.plan] ? req.user.plan : 'default';
            const selectedWorkout = planWorkouts[userPlanKey];

            // Simulate fetching stats (replace with real aggregation later)
            const simulatedStats = {
                totalWorkouts: 5,
                caloriesBurned: 1250, 
                hoursTrained: 4.5, 
                programsCompleted: 0, 
            };

            const dashboardData = {
                stats: simulatedStats,
                achievements: [ // Fetch/calculate achievements based on stats
                     { title: "First Step!", description: "Completed your first workout", icon: "ri-run-line", completed: simulatedStats.totalWorkouts >= 1 },
                     { title: "Burn 1000", description: "Burned 1000 total calories", icon: "ri-fire-line", completed: simulatedStats.caloriesBurned >= 1000 },
                     { title: "Consistency King", description: "Worked out 7 days in a row", icon: "ri-calendar-check-line", completed: false }, // Needs more complex tracking
                ],
                todayWorkout: { // Fetch next workout logic needed
                    ...selectedWorkout,
                    time: "6:30 AM", 
                    completed: false 
                }
            };

            res.json(dashboardData);
        } catch (error) {
            console.error("Error fetching dashboard data for user:", userId, error);
            res.status(500).json({ message: "Server error fetching dashboard data" });
        }
    };

    // --- Add other user-specific controllers later ---
    // export const updateUserProfile = async (req, res) => { ... };
    // export const getCurrentProgram = async (req, res) => { ... };
    // export const logWorkout = async (req, res) => { ... };
    

