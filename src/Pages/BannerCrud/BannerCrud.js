import React, { useState } from 'react';
import Admin from '../../components/Admin/Admin';
import './BannerCrud.css';
import JoinUrl from '../../JoinUrl';

const BannerCrud = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Summer Sale',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'New Arrivals',
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const [formData, setFormData] = useState({ title: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      setBanners(banners.map(b =>
        b.id === editingId ? { ...b, ...formData } : b
      ));
      setEditingId(null);
    } else {
      // Create
      const newBanner = { ...formData, id: Date.now() };
      setBanners([...banners, newBanner]);
    }
    setFormData({ title: '', image: '' });
  };

  const handleEdit = (id) => {
    const banner = banners.find(b => b.id === id);
    setFormData({ title: banner.title, image: banner.image });
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  return (
    <>
      <Admin />
      <div className="admin-page">
        <div className="admin-header">
          <h2>Banner Management</h2>
        </div>

        <form className="banner-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Banner Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Banner Image URL"
            value={formData.image}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-save">
            {editingId ? 'Update' : 'Add'} Banner
          </button>
        </form>

        <div className="banner-list">
          {banners.map(banner => (
            <div className="banner-card" key={banner.id}>
              <img src={JoinUrl(banner.image)} alt={banner.title} />
              <h4>{banner.title}</h4>
              <div className="banner-actions">
                <button onClick={() => handleEdit(banner.id)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(banner.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BannerCrud;
