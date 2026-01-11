import React, { useState, useEffect } from 'react';
import { getUsers } from '../admin/adminApi'; // Assumes adminApi is at src/api/adminApi.js
import ProgressChart from '../admin/ProgressChart'; // The updated component
import './AdminPlans.css'; // We'll add some styling for the page

const AdminPlans = () => {
  const [planData, setPlanData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        setLoading(true);
        // 1. Fetch all users from your existing API
        const response = await getUsers();
        const payload = response.data;
        const users = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.users) ? payload.users : []);
        if (!Array.isArray(users)) {
           throw new Error("API did not return an array of users.");
        }
        setTotalUsers(users.length);

        // 2. Process the data to count users per plan
        const counts = {};
        users.forEach(user => {
          // Use user.plan.name if 'plan' is an object, or just user.plan if it's a string
          const planName = user.plan || 'Unassigned'; 
          counts[planName] = (counts[planName] || 0) + 1;
        });

        // 3. Format the data for the chart component
        const dataForChart = Object.keys(counts).map(key => ({
          name: key,
          count: counts[key],
        }));

        setPlanData(dataForChart);
        
      } catch (err) {
        console.error("Failed to fetch user plan data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlans();
  }, []); // Runs once on component mount

  if (loading) {
    return <div className="admin-page-loading">Loading Plan Data...</div>;
  }

  if (error) {
    return <div className="admin-page-error">Error: {error}</div>;
  }

  return (
    <div className="admin-plans-page">
      <h2 className="admin-page-title">User Plan Distribution</h2>
      <p className="admin-page-subtitle">
        Showing plan distribution for <strong>{totalUsers}</strong> total users.
      </p>
      
      {/* Pass the processed data to the chart component */}
      <ProgressChart data={planData} totalUsers={totalUsers} />
    </div>
  );
};

export default AdminPlans;
