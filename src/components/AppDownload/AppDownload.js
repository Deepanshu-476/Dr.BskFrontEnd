// components/AppDownload/AppDownload.jsx
import React from 'react';
import './AppDownload.css';

const AppDownload = () => {
  return (
    <section className="app-app-download-wrapper">
      <div className="app-app-banner-container">
        
        {/* COLUMN 1: Brand Text & Download Badges */}
        <div className="app-banner-col app-brand-info">
          <h2>Download Dr. BSK's App Now</h2>
          <p>Get exclusive offers & easy shopping experience</p>
          <div className="app-store-badges">
            <a href="#playstore" className="app-badge-link">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
            </a>
            <a href="#appstore" className="app-badge-link">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
            </a>
          </div>
        </div>

        {/* COLUMN 2: QR Code Scan Box */}
        <div className="app-banner-col app-qr-box-container">
          <div className="app-qr-card">
            {/* Replace placeholder with actual QR code image path */}
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://drbsk.com" alt="QR Code" className="app-qr-img" />
          </div>
          <span className="app-qr-label">Scan to Download</span>
        </div>

        {/* COLUMN 3: App Features List */}
        <div className="app-banner-col app-app-features">
          <div className="app-feature-item">
            <div className="app-feature-icon">🎁</div>
            <div className="app-feature-text">
              <h4>Exclusive Offers</h4>
              <p>Only for App Users</p>
            </div>
          </div>
          
          <div className="app-feature-item">
            <div className="app-feature-icon">🔄</div>
            <div className="app-feature-text">
              <h4>Easy Reorder</h4>
              <p>Quick Medicine Reorder</p>
            </div>
          </div>

          <div className="app-feature-item">
            <div className="app-feature-icon">🚚</div>
            <div className="app-feature-text">
              <h4>Order Tracking</h4>
              <p>Real-Time Updates</p>
            </div>
          </div>
        </div>

        {/* COLUMN 4: Phone Mockup Showcase */}
        <div className="app-banner-col app-phone-mockup">
          <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=500&fit=crop" alt="App Preview" />
        </div>

      </div>
    </section>
  );
};

export default AppDownload;