// components/TrustBadges/TrustBadges.jsx
import React from 'react';
import './TrustBadges.css';

const TrustBadges = () => {
  const stats = [
    { number: '10,000+', label: 'Quality Products', icon: '🏷️' },
    { number: '500+', label: 'Store Across India', icon: '🏪' },
    { number: '20+', label: 'Years of Trust', icon: '🌟' },
    { number: 'PAN India', label: 'Fast Delivery', icon: '🚚' },
  ];

  return (
    <section className="trust-badges">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="trust-strip">
          <div className="trust-item">✓ 100% Genuine Medicines</div>
          <div className="trust-item">✓ COD Available</div>
          <div className="trust-item">✓ Free Shipping on ₹999+</div>
          <div className="trust-item">✓ Easy Returns</div>
          <div className="trust-item">✓ Secure Payments</div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;