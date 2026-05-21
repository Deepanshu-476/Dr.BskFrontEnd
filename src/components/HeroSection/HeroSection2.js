// components/HeroSection/HeroSection2.jsx
import React from 'react';
import './HeroSection2.css';

const HeroSection2 = () => {
  return (
    <section className="hero2">
      <div className="container hero2-container">
        <div className="hero2-content">
          <div className="hero2-badge">
            <span className="badge-dot"></span>
            Trusted Ayurvedic & Healthcare Solutions
          </div>
          <h1 className="hero2-title">
            Nature's Wisdom for <span className="highlight">Modern Wellness</span>
          </h1>
          <p className="hero2-description">
            Discover authentic Ayurvedic formulations backed by 20+ years of traditional expertise. 
            Pure, potent, and perfected for your complete wellbeing.
          </p>
          <div className="hero2-buttons">
            <button className="btn-primary">Shop Now →</button>
            <button className="btn-outline">Explore Products</button>
          </div>
          <div className="hero2-features">
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a0c0c" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>100% Genuine Products</span>
            </div>
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a0c0c" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>Free Shipping on ₹999+</span>
            </div>
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a0c0c" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>24x7 Expert Support</span>
            </div>
          </div>
        </div>
        <div className="hero2-image">
          <div className="hero2-image-card">
            <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop" alt="Ayurvedic Products" />
            <div className="floating-badge top">
              <span>⭐ 4.9</span> 10,000+ Happy Customers
            </div>
            <div className="floating-badge bottom">
              <span>🌿</span> 100% Natural
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection2;