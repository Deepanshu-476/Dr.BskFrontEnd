// components/HeroSection/HeroSection2.jsx
import React from 'react';
import './HeroSection2.css';

const HeroSection2 = () => {
  return (
    <section className="hero-section2">
      <div className="hero-section2-container">
        
        {/* Left Content Side */}
        <div className="hero-section2-content">
          <h1 className="hero-section2-title">
            Trusted Ayurvedic &<br />
            Healthcare Solutions<br />
            Delivered Across <span className="hero-section2-highlight">India</span>
          </h1>
          
          <p className="hero-section2-description">
            100% Genuine Products | COD Available | Fast Delivery
          </p>
          
          <div className="hero-section2-buttons">
            <button className="hero-section2-btn-primary">
              <span className="hero-section2-btn-icon">🛒</span> Shop Medicines
            </button>
            <button className="hero-section2-btn-outline">
              <span className="hero-section2-btn-icon">📤</span> Upload Prescription
            </button>
          </div>
        </div>

        {/* Right Image Side */}
        <div className="hero-section2-image-container">
          {/* Main banner graphic collage representation */}
          <img 
            src="/logo2.png" 
            alt="Ayurvedic Products and Doctor Family" 
            className="hero-section2-main-img"
          />
        </div>

      </div>

      {/* Bottom Feature Sticky Bar */}
      <div className="hero-section2-bottom-bar">
        <div className="hero-section2-bottom-bar-container">
          <div className="hero-section2-feature-item">
            <span className="hero-section2-feature-icon">🛡️</span>
            <span>Secure Payments</span>
          </div>
          <div className="hero-section2-feature-item">
            <span className="hero-section2-feature-icon">🧑‍⚕️</span>
            <span>Doctor Support</span>
          </div>
          <div className="hero-section2-feature-item">
            <span className="hero-section2-feature-icon">🔄</span>
            <span>Easy Returns</span>
          </div>
          <div className="hero-section2-feature-item">
            <span className="hero-section2-feature-icon">🚚</span>
            <span>PAN India Delivery</span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection2;