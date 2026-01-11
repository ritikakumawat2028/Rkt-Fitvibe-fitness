// src/admin/components/DashboardHeader.jsx
import React from 'react';
import './DashboardHeader.css'; // Import header specific CSS

// Placeholder Icons
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

const DashboardHeader = ({ username, onLogout, toggleSidebar }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle-button" onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <h2>Dashboard</h2> {/* This matches your image */}
      </div>
      <div className="header-right">
        <span>Welcome, {username}</span>
        <button onClick={onLogout} className="logout-button">
          <LogoutIcon />
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;