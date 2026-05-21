// components/AppDownload/AppDownload.jsx
import React from 'react';
import './AppDownload.css';

const AppDownload = () => {
  return (
    <section className="app-download">
      <div className="container">
        <div className="app-banner">
          <div className="app-content">
            <h2>Download Dr.BsK's App Now</h2>
            <p>Get exclusive offers & easy shopping experience</p>
            <div className="app-buttons">
              <button className="app-store">
                <span>📱</span> Google Play
              </button>
              <button className="app-store">
                <span>🍎</span> App Store
              </button>
            </div>
          </div>
          <div className="app-qr">
            <div className="qr-code">
              <div className="qr-placeholder">
                <span>📱</span>
                <p>Scan to Download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;