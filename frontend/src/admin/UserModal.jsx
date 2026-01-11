// src/admin/components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import './UserModal.css'; // New CSS file for the modal

const UserModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'male',
    goal: 'weight_loss',
    plan: 'basic',
  });

  const isEditMode = Boolean(user);

  // When the 'user' prop or 'isOpen' prop changes, update the form
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // If editing, fill the form with user data
        // Set password to empty string; user can type a new one if they want to change it
        setFormData({
          name: user.name || '',
          email: user.email || '',
          password: '', // Always empty on open for security/UX
          phone: user.phone || '',
          age: user.age || '',
          gender: user.gender || 'male',
          goal: user.goal || 'weight_loss',
          plan: user.plan || 'basic',
        });
      } else {
        // If adding, reset the form to default values
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          age: '',
          gender: 'male',
          goal: 'weight_loss',
          plan: 'basic',
        });
      }
    }
  }, [user, isOpen, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Send the form data to the parent
  };

  // If not open, render nothing
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{isEditMode ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Leave blank to keep current" : "Required"} required={!isEditMode} />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="goal">Goal</label>
              <select id="goal" name="goal" value={formData.goal} onChange={handleChange}>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fitness">General Fitness</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="plan">Plan</label>
              <select id="plan" name="plan" value={formData.plan} onChange={handleChange}>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">{isEditMode ? 'Save Changes' : 'Create User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
