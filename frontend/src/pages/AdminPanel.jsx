import React, { useEffect, useState } from "react";
import API_URL from "../config";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // for update form
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Fetch all users (admin-secured)
  const fetchUsers = () => {
    const adminToken = localStorage.getItem('adminToken');
    fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const adminToken = localStorage.getItem('adminToken');
      await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      fetchUsers();
    }
  };

  // Handle update
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, email: user.email, password: user.password });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem('adminToken');
    await fetch(`${API_URL}/api/admin/users/${editingUser}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify(formData),
    });
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "" });
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>
      <h2>Registered Users</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
               <th>Password</th> 
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              editingUser === user._id ? (
                <tr key={user._id}>
                  <td>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </td>
                   <td>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </td> 
                  <td>
                    <button onClick={handleUpdateSubmit}>Save</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                   <td>{user.password}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;
