import React from 'react';
import './HeroSection2.css';
import { Upload, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection2 = () => {
  const navigate = useNavigate();

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
            {/* Shop Medicines Button */}
            <button
              className="hero-section2-btn-primary"
              onClick={() => navigate('/shop')}
            >
              <ShoppingBag size={18} />
              <span>Shop Medicines</span>
            </button>

            {/* Upload Prescription Button */}
            <button
              className="hero-section2-btn-outline"
              onClick={() => navigate('/Prescription')}
            >
              <Upload size={18} />
              <span>Upload Prescription</span>
            </button>
          </div>
        </div>

        {/* Right Image Side */}
        <div className="hero-section2-image-container">
          <img
            src="/1 (1).png"
            alt="Ayurvedic Products and Doctor Family"
            className="hero-section2-main-img"
          />
        </div>

      </div>

      {/* Bottom Feature Bar */}
      <div className="hero-section2-bottom-bar">
        <div className="hero-section2-bottom-bar-container">
          <div className="hero-section2-feature-item">
            <span className="hero-section2-feature-icon secure-icon"></span>
            <span>Secure Payments</span>
          </div>

          <div className="hero-section2-feature-item">
            <span className="hero-section2-feature-icon doctor-icon"></span>
            <span>Doctor Support</span>
          </div>

          <div className="hero-section2-feature-item">
            <span className="hero-section2-feature-icon return-icon"></span>
            <span>Easy Returns</span>
          </div>

          <div className="hero-section2-feature-item">
            <span className="hero-section2-feature-icon delivery-icon"></span>
            <span>PAN India Delivery</span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection2;