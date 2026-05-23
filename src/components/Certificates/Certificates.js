import React from 'react';
import './Certificates.css';

const Certificates = () => {
  const certs = [
    { 
      name: 'GMP Certified', 
      desc: 'Good Manufacturing Practices', 
      logo: '🏭' // यहाँ अपनी इमेज या SVG का पाथ लगा सकते हैं
    },
    { 
      name: 'AYUSH Certified', 
      desc: 'Government of India Approved', 
      logo: '🌿' 
    },
    { 
      name: 'ISO 9001:2015', 
      desc: 'Quality Management System', 
      logo: '📋' 
    },
    { 
      name: 'NABL Certified', 
      desc: 'ISO/IEC 17025 Accredited', 
      logo: '🔬' 
    },
    { 
      name: 'FDA Approved', 
      desc: 'Food & Drug Administration', 
      logo: '✅' 
    },
  ];

  return (
    <section className="certificates-section">
      <div className="certificates-container">
        
        {/* Left Side: Header & Button */}
        <div className="certificates-left">
          <div className="section-header">
            <h2>Our Certifications</h2>
            <p>Committed to quality and health safety</p>
          </div>
          <button className="view-all-btn">View All Certificates</button>
        </div>

        {/* Right Side: Shared White Card with Credentials */}
        <div className="certificates-right-card">
          {certs.map((cert, index) => (
            <div className="cert-item" key={index}>
              <div className="cert-logo-wrapper">{cert.logo}</div>
              <div className="cert-text">
                <span className="cert-title">{cert.name}</span>
                <span className="cert-desc">{cert.desc}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certificates;