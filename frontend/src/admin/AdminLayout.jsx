// src/admin/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../dash/Sidebar';
import DashboardHeader from '../dash/DashboardHeader';
import './AdminLayout.css'; // New CSS file for the layout

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* This overlay is for mobile view when sidebar is open */}
      {isSidebarOpen && <div className="sidebar-overlay mobile-only" onClick={toggleSidebar}></div>}
      
      <div className={`main-content-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <DashboardHeader
          username="admin"
          onLogout={handleLogout}
          toggleSidebar={toggleSidebar}
        />
        <main className="page-content-area">
          {/* Outlet renders the current route's component (e.g., AdminDashboard or AdminUsers) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;