// src/admin/pages/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// Updated import to use 'loginAdmin' from your new API file
// Corrected path from ../../api/adminApi to ../api/adminApi
import { loginAdmin } from '../api/adminApi'; // Import your login function
import './AdminLogin.css'; // Import the CSS file for styling

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to display login errors
  const navigate = useNavigate(); // Define navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear any previous errors

    try {
      // Pass credentials as an object, as expected by loginAdmin(formData)
      const formData = { username, password };
      const response = await loginAdmin(formData);

      // Your interceptor will handle errors, but on success, we proceed
      localStorage.setItem('adminToken', response.data.token);
      // You might also want to store admin info
      // localStorage.setItem('admin', JSON.stringify(response.data.admin));

      navigate('/admin/dashboard'); // Redirect to the admin dashboard
    } catch (err) {
      // The error interceptor will run first, but this catch
      // will handle component-level state updates (e.g., showing the error)
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }

  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-logo">
          {/* You can replace this with an actual SVG or image */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-hard-drive">
            <line x1="22" y1="12" x2="2" y2="12"></line>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            <line x1="6" y1="16" x2="6.01" y2="16"></line>
            <line x1="10" y1="16" x2="10.01" y2="16"></line>
          </svg>
        </div>
        <h1>Admin Panel</h1>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username" // Helps browser autofill
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password" // Helps browser autofill
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Login
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </button>
        </form>

        <div className="default-credentials">
          <p>Default Credentials</p>
          <p>Username: <span>admin</span></p>
          <p>Password: <span>admin123</span></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

