    import React, { useState, useEffect, useCallback } from 'react';
    import axios from 'axios';
    import { useParams, useNavigate } from 'react-router-dom';
    import './admin.css'; // Import admin styles

    function EditUser() {
      const { userId } = useParams(); // Get the user ID from the URL parameter
      const navigate = useNavigate();
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        plan: '',
        phone: '',
        // Initialize other fields from your User model if you want to edit them
        // age: '', gender: '', goal: '',
      });
      const [newPassword, setNewPassword] = useState(''); // Separate state for password change
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');

      // Fetch user data when the component mounts or userId changes
      const fetchUserData = useCallback(async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
          const token = localStorage.getItem('adminToken');
          if (!token) {
            navigate('/admin/login');
            return;
          }
          // *** IMPORTANT: Ensure backend runs on port 5000 ***
          const res = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Set form data with fetched user details (excluding password)
          setFormData({
            name: res.data.name || '',
            email: res.data.email || '',
            plan: res.data.plan || '',
            phone: res.data.phone || '',
            // Populate other fields from res.data here
            // age: res.data.age || '',
            // gender: res.data.gender || '',
            // goal: res.data.goal || '',
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError(err.response?.data?.message || 'Failed to load user data.');
          if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            navigate('/admin/login');
          }
        } finally {
          setLoading(false);
        }
      }, [userId, navigate]); // Dependencies

      useEffect(() => {
        fetchUserData();
      }, [fetchUserData]); // Run fetchUserData

      // Handle changes in form inputs
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
      };

      // Handle changes specifically for the new password input
      const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
        setError('');
        setSuccess('');
      };

      // Handle form submission to update user data
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const updatePayload = { ...formData };
        if (newPassword.trim() !== '') {
          updatePayload.password = newPassword;
        }

        try {
          const token = localStorage.getItem('adminToken');
          // *** IMPORTANT: Ensure backend runs on port 5000 ***
          await axios.put(`http://localhost:5000/api/admin/users/${userId}`, updatePayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSuccess('User updated successfully!');
          setNewPassword(''); // Clear password field
          // Optionally refetch data to show updated values if staying on page
          // fetchUserData();
        } catch (err) {
          console.error("Error updating user:", err);
          setError(err.response?.data?.message || 'Failed to update user.');
           if (err.response?.status === 401 || err.response?.status === 403) {
               localStorage.removeItem('adminToken');
               localStorage.removeItem('admin');
               navigate('/admin/login');
           }
        }
      };

      if (loading) return <div className="loading">Loading user details...</div>;

      return (
        <div className="admin-container edit-user-container">
           <div className="admin-header">
               <h2>Edit User: {formData.name || '...'}</h2>
               <button onClick={() => navigate('/admin/users')} className="back-button">
                  Back to List
               </button>
           </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleSubmit} className="edit-user-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
             <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
             </div>
            <div className="form-group">
              <label htmlFor="plan">Plan</label>
              <select id="plan" name="plan" value={formData.plan} onChange={handleChange}>
                <option value="">-- Select Plan --</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Strength Training">Strength Training</option>
                <option value="Yoga & Flexibility">Yoga & Flexibility</option>
                <option value="HIIT Training">HIIT Training</option>
              </select>
            </div>
            {/* Add more form groups here for age, gender, goal etc. if needed */}
            <div className="form-group">
              <label htmlFor="newPassword">New Password (leave blank to keep current)</label>
              <input id="newPassword" type="password" name="newPassword" value={newPassword} onChange={handlePasswordChange} placeholder="Enter new password (optional)" />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Update User</button>
              <button type="button" onClick={() => navigate('/admin/users')} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    }

    export default EditUser;
    

