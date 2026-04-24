// src/admin/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; // For active link styling
import './Sidebar.css'; // Import sidebar specific CSS

// Placeholder Icons (replace with actual icon library like react-icons)
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"></path></svg>
);
const PlansIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);
const TrainerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);


const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <DashboardIcon />
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <DashboardIcon />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="sidebar-category-title">DATABASE TABLES</li>
            <li>
              <NavLink to="/admin/Plans" className={({ isActive }) => isActive ? 'active' : ''}>
                <PlansIcon />
                <span>Plans</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/trainers" className={({ isActive }) => isActive ? 'active' : ''}>
                <TrainerIcon />
                <span>Trainers</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                <UsersIcon />
                <span>Users</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;