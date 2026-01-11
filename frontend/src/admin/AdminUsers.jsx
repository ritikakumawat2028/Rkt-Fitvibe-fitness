// src/admin/pages/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for the public 'register' route

// Import all necessary API functions
import {
  getUsers,
  deleteUserById,
  updateUserById,
} from '../admin/adminApi';

// Import the sub-components
import UserTable from './UserTable';
import UserModal from './UserModal';

// Import the CSS
import './AdminUsers.css';

// ... (Your Icons) ...
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const AddIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
// Removed ExportIcon, but you can add it back if you build that feature
// ...

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(25);
  const [error, setError] = useState(null);

  // --- New State for Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = "Add" mode, user object = "Edit" mode

  // --- Data Fetching ---
  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    getUsers()
      .then(response => {
        const payload = response.data;
        if (Array.isArray(payload)) {
          setUsers(payload);
        } else if (payload && Array.isArray(payload.users)) {
          setUsers(payload.users);
        } else {
          console.error("API did not return an array:", payload);
          setUsers([]);
          setError("Failed to load user data.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch users:", err);
        setError(err.message || "An unknown error occurred.");
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array means this runs once on load

  // --- CRUD Handlers ---

  const handleDeleteUser = async (userId) => {
    // We can't use window.confirm() per your instructions.
    // In a real app, you'd have a custom confirmation modal here.
    // For now, we delete directly.
    try {
      await deleteUserById(userId);
      // Remove user from state to update UI instantly
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleModalSubmit = async (userData) => {
    try {
      if (editingUser) {
        // --- UPDATE User (Edit Mode) ---
        // Don't send an empty password to the backend if user didn't change it
        const { password, ...dataToUpdate } = userData;
        if (password) {
          dataToUpdate.password = password; // Only include password if it's a new one
        }
        await updateUserById(editingUser._id, dataToUpdate);
      } else {
        // --- CREATE User (Add Mode) ---
        // We use the public /api/register route from your server.js
        // We use a separate axios call because it's not a protected /api/admin route
        await axios.post('http://localhost:5000/api/register', userData);
      }
      fetchUsers(); // Refresh the user list
      handleCloseModal(); // Close the modal
    } catch (err) {
      console.error("Failed to save user:", err);
      setError("Failed to save user. " + (err.response?.data?.message || err.message));
    }
  };

  // --- Modal State Handlers ---
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // --- Search ---
  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const totalRecords = filteredUsers.length;

  return (
    <div className="admin-users-page">
      {/* 1. The Header/Control Bar */}
      <div className="users-header-controls card">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="header-buttons">
          <button className="control-button add-button" onClick={handleOpenAddModal}>
            <AddIcon /> Add New Record
          </button>
          <select
            className="per-page-select"
            value={perPage}
            onChange={e => setPerPage(Number(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* 2. The Table Container */}
      <div className="users-table-container card">
        <h3 className="table-title">Users ({totalRecords} records)</h3>

        {/* Show error message if API failed */}
        {error && <p className="error-message">{error}</p>}

        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteUser}
        />
      </div>

      {/* 3. The Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        user={editingUser}
      />
    </div>
  );
};

export default AdminUsers;

