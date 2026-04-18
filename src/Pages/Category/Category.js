import React, { useState } from 'react';
import './Category.css';
import Admin from '../../components/Admin/Admin';
import JoinUrl from '../../JoinUrl';

const Category = () => {
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: null,
  });

  const users = [
    {
      name: 'Herbal Shampoo',
      description: 'Natural herbal shampoo for hair fall control.',
      category_id: 'C101',
      image: 'https://via.placeholder.com/80',
      deleted_at: null,
    },
    {
      name: 'Neem Face Wash',
      description: 'Anti-acne face wash with neem extracts.',
      category_id: 'C102',
      image: 'https://via.placeholder.com/80',
      deleted_at: '2024-12-01',
    },
    {
      name: 'Aloe Vera Gel',
      description: 'Soothing gel for skin hydration.',
      category_id: 'C103',
      image: 'https://via.placeholder.com/80',
      deleted_at: null,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting category:', newCategory);
    setShowModal(false); 
  };

  return (
    <>
      <Admin />
      <div className="admin-page">
        <div className="admin-header">
          <h2>Category</h2>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            Add Category
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Category ID</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.description}</td>
                <td>{user.category_id}</td>
                <td>
                  <img
                    src={JoinUrl(user.image)}
                    alt={user.name}
                    width="60"
                    height="60"
                    style={{ borderRadius: '6px' }}
                  />
                </td>
                <td>
                  {user.deleted_at ? (
                    <span className="status-badge deleted">Deleted</span>
                  ) : (
                    <span className="status-badge active">Active</span>
                  )}
                </td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Category</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  required
                />
                <div className="modal-actions">
                  <button type="submit" className="btn-save">Save</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
