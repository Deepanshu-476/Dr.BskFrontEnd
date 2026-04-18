import React, { useState, useEffect } from 'react';
import Admin from '../../components/Admin/Admin';
import './SubCategory.css';
import JoinUrl from '../../JoinUrl';

const SubCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    subcategory_id: '',
    deleted_at: ''
  });

  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Dummy data for categories
    setCategories([
      { _id: 'c1', name: 'Health & Wellness' },
      { _id: 'c2', name: 'Herbal Products' },
      { _id: 'c3', name: 'Personal Care' },
    ]);

    // Dummy data for existing subcategories
    setSubCategories([
      {
        _id: 's1',
        name: 'Skin Essentials',
        description: 'Subcategory for skincare items',
        image: 'https://via.placeholder.com/60',
        subcategory_id: 'c1',
        deleted_at: null,
      },
      {
        _id: 's2',
        name: 'Immunity Boosters',
        description: 'Herbal immunity products',
        image: 'https://via.placeholder.com/60',
        subcategory_id: 'c2',
        deleted_at: '2025-01-01T00:00:00Z',
      }
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSubCategory = {
      ...formData,
      _id: Date.now().toString()
    };
    setSubCategories(prev => [...prev, newSubCategory]);
    setFormData({
      name: '',
      description: '',
      image: '',
      subcategory_id: '',
      deleted_at: ''
    });
  };

  return (
    <>
      <Admin />
      <div className="admin-page">
        <div className="admin-header">
          <h2>Sub Category</h2>
          <button className="btn-add">Add New Sub Category</button>
        </div>

        <form className="subcategory-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            placeholder="Description"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            value={formData.image}
            placeholder="Image URL"
            onChange={handleChange}
          />
          <select
            name="subcategory_id"
            value={formData.subcategory_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            name="deleted_at"
            value={formData.deleted_at}
            onChange={handleChange}
          />
          <button type="submit" className="btn-save">Save</button>
        </form>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((item, i) => {
              const categoryName = categories.find(c => c._id === item.subcategory_id)?.name || 'Unknown';
              return (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    <img src={JoinUrl(item.image)}
                     alt={item.name} width="60" height="60" style={{ borderRadius: '6px' }} />
                  </td>
                  <td>{categoryName}</td>
                  <td>
                    {item.deleted_at ? (
                      <span className="status-badge deleted">Deleted</span>
                    ) : (
                      <span className="status-badge active">Active</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SubCategory;
