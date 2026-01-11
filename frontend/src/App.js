// App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

// --- Public Pages ---
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Traniers from "./pages/Traniers";
import Dashboard from "./pages/Dashboard"; // This is the USER dashboard
import Workout from "./pages/Workout";
import Register from "./pages/Register";
import Login from "./pages/Login";

// --- Admin Pages ---
// Note: Your imports suggest these are flat in /admin, which is fine.
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminUsers from "./admin/AdminUsers";
import AdminDashboard from "./admin/AdminDashboard";
import AdminPlans from "./admin/AdminPlans" // This is the ADMIN dashboard
import AdminTrainers from "./admin/AdminTrainers";
// The old "AdminPanel" page is no longer needed as AdminLayout handles this.

// --- Public Components ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.css";

/**
 * MainLayout Component
 * This wraps all public-facing pages to include the Navbar and Footer.
 */
const MainLayout = ({ user, setUser }) => {
  return (
    <div className="app-container">
      <Navbar user={user} setUser={setUser} />
      <main className="main-content">
        <Outlet /> {/* Renders the child route (Home, About, etc.) */}
      </main>
      <Footer />
    </div>
  );
};

/**
 * ProtectedRoute Component
 * This checks if an admin is logged in before rendering the admin pages.
 * If not, it redirects to the admin login page.
 */
const ProtectedRoute = () => {
  // Check for an admin-specific token
  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  if (!isAdminLoggedIn) {
    // Not logged in, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in, render the AdminLayout, which in turn
  // will render the correct admin page (Dashboard, Users, etc.)
  return <AdminLayout />;
};

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* --- 1. Public Routes --- */}
        {/* All routes inside here will have the main Navbar and Footer */}
        <Route element={<MainLayout user={user} setUser={setUser} />}>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/traniers" element={<Traniers />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* User Dashboard */}
          <Route path="/workout" element={<Workout />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Route>

        {/* --- 2. Admin Routes --- */}
        {/* The admin login page stands alone (no Navbar/Footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* All other admin routes are nested under "/admin" 
          They are protected by the <ProtectedRoute> component.
        */}
        <Route path="/admin" element={<ProtectedRoute />}>
          {/* /admin will redirect to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          {/* /admin/dashboard will render AdminDashboard inside AdminLayout */}
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* /admin/users will render AdminUsers inside AdminLayout */}
          <Route path="users" element={<AdminUsers />} />
          <Route path="Plans" element={<AdminPlans />} />
          <Route path="trainers" element={<AdminTrainers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
