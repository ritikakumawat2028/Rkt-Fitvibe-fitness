// src/admin/components/RecentActivity.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { getRecentActivity } from '../admin/adminApi'; // We will add this function
import './RecentActivity.css';

// --- Helper function to format time ---
// (This is a simple version, you can use a library like date-fns for more)
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return "just now";
};


const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        // This will call our new API function
        const response = await getRecentActivity(); 
        setActivities(response.data);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []); // Runs once on component mount

  return (
    <div className="recent-activity card">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {loading ? (
          <p>Loading activity...</p>
        ) : activities.length === 0 ? (
          <p>No recent activity found.</p>
        ) : (
          activities.map((activity) => (
            <div className="activity-item" key={activity._id}>
              {/* This is now dynamic based on user data */}
              <p className="activity-type">New user registration</p>
              <span className="activity-details">
                {activity.name} ({activity.email}) • {timeAgo(activity.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
