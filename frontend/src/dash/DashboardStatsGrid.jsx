// src/admin/components/DashboardStatsGrid.jsx
import React, { useEffect, useState } from 'react';
import './DashboardStatsGrid.css';
import { getAdminStats } from '../admin/adminApi';

// Placeholder Icons
const DatabaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);
const RecordsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const SizeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l10 10-10 10L2 12 12 2z"></path><path d="M12 2v20"></path><path d="M22 12h-20"></path></svg>
);
const UsersOutlineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const DashboardStatsGrid = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  const fmtSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const cards = [
    { icon: <DatabaseIcon />, value: (stats?.collectionCount ?? 0).toString(), label: 'Database Tables', color: '#6c7bff' },
    { icon: <RecordsIcon />, value: (stats?.totalRecords ?? 0).toString(), label: 'Total Records', color: '#8a2be2' },
    { icon: <SizeIcon />, value: fmtSize(stats?.databaseSize), label: 'Database Size', color: '#28a745' },
    { icon: <UsersOutlineIcon />, value: (stats?.totalUsers ?? 0).toString(), label: 'Total Users', color: '#ffc107' },
    { icon: <UsersOutlineIcon />, value: (stats?.totalTrainers ?? 0).toString(), label: 'Total Trainers', color: '#20c997' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((stat, index) => (
        <div className="stat-card card" key={index}>
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-info">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsGrid;