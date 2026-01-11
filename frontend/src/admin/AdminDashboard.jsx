// src/admin/pages/AdminDashboard.jsx
import React from 'react';
import DashboardStatsGrid from '../dash/DashboardStatsGrid';
import DashboardTableOverview from '../dash/DashboardTableOverview';
import RecentActivity from '../dash/RecentActivity';
import './AdminDashboard.css';

// NOTE: Sidebar and Header are rendered by AdminLayout; this component only renders page content
const AdminDashboard = () => {
  return (
    <div className="dashboard-content-area">
      <DashboardStatsGrid />
      <div className="dashboard-bottom-row">
        <DashboardTableOverview />
        <RecentActivity />
      </div>
    </div>
  );
};

export default AdminDashboard;
