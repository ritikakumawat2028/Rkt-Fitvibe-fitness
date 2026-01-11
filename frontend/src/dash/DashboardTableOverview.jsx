// src/admin/components/DashboardTableOverview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './DashboardTableOverview.css';
import { getAdminStats } from '../admin/adminApi';

// Placeholder Icons
const ViewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const TableOverview = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Updated the list to include paths to your admin pages
  const [tables, setTables] = React.useState([]);

  React.useEffect(() => {
    getAdminStats()
      .then((res) => {
        const data = res.data;
        const rows = [
          { name: 'Users', records: String(data?.totalUsers ?? 0), size: '—', path: '/admin/users' },
          { name: 'Trainers', records: String(data?.totalTrainers ?? 0), size: '—', path: '/admin/trainers' },
          { name: 'Plans', records: String(data?.distinctPlans ?? 0), size: '—', path: '/admin/Plans' },
        ];
        setTables(rows);
      })
      .catch(() => setTables([]));
  }, []);

  return (
    <div className="table-overview card">
      <h3>Table Overview</h3>
      <div className="table-list">
        {tables.map((table, index) => (
          <div className="table-item" key={index}>
            <div className="table-details">
              <h4>{table.name}</h4>
              <p>{table.records} records • {table.size}</p>
            </div>
            {/* This button now navigates to the specific admin page
              (e.g., /admin/users, /admin/plans) when clicked.
            */}
            <button
              className="view-button"
              onClick={() => navigate(table.path)}
            >
              <ViewIcon /> View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOverview;
