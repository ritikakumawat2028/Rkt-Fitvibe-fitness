// src/admin/components/UserTable.jsx
import React from "react";
import "./UserTable.css"; // We will create this CSS file

// Add 'loading' and 'onEdit' to the props
const UserTable = ({ users, loading, onEdit, onDelete }) => {
  
  // Safety check to prevent crash if users is ever null/undefined
  if (!users) {
    return <div className="loading-spinner">Loading users...</div>;
  }

  if (loading) {
    return <div className="loading-spinner">Loading users...</div>;
  }

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div className="user-table-wrapper">
      {/* The <h2> has been removed, as the AdminUsers.jsx page 
        already provides a title: "Users (x records)"
      */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td className="actions-cell-simple">
                {/* Add the Edit button, passing the full user object 'u' */}
                <button className="edit-btn" onClick={() => onEdit(u)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(u._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

