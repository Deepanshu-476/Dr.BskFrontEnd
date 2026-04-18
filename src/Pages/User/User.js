import React from 'react';
import './User.css';
import Admin from '../../components/Admin/Admin';

const User = () => {
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      user_id: 'U001',
      deleted_at: null,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
      user_id: 'U002',
      deleted_at: '2024-12-01',
    },
    {
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'Viewer',
      user_id: 'U003',
      deleted_at: null,
    },
  ];

  return (
    <div className="admin-layout">
      <Admin />
      <div className="user-content">
        <div className="user-header">
          <h2>Users</h2>
          <a href="/AddUser">
            <button className="btn-add">Add User</button>
          </a>
        </div>

        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td data-label="Name">{user.name}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="User ID">{user.user_id}</td>
                  <td data-label="Role">{user.role}</td>
                  <td data-label="Status">
                    {user.deleted_at ? (
                      <span className="status-badge deleted">Deleted</span>
                    ) : (
                      <span className="status-badge active">Active</span>
                    )}
                  </td>
                  <td data-label="Actions" className="actions-cell">
                    <button className="btn-action btn-edit">Edit</button>
                    <button className="btn-action btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;