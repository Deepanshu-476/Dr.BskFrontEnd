// components/CategorySection/CategorySection.jsx
import React from 'react';
import './CategorySection.css';

const CategorySection = () => {
  const categories = [
    { name: 'Diabetes Care', icon: '🩸', color: '#e8f5e9' },
    { name: 'BP Care', icon: '❤️', color: '#ffebee' },
    { name: 'Joint Pain Relief', icon: '🦵', color: '#fff3e0' },
    { name: 'Immunity Booster', icon: '🛡️', color: '#e0f2f1' },
    { name: "Women's Care", icon: '👩', color: '#fce4ec' },
    { name: 'Hair Care', icon: '💇', color: '#f1f8e9' },
    { name: 'Liver Care', icon: '🍃', color: '#e8eaf6' },
    { name: 'Animal Care', icon: '🐕', color: '#fff8e1' },
  ];

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header">
          <h2>Shop By Category</h2>
          <p>Find the right solution for your health</p>
        </div>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div className="category-card" key={index} style={{ backgroundColor: cat.color }}>
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <span className="shop-link">Shop Now →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;