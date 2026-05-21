// components/Certificates/Certificates.jsx
import React from 'react';
import './Certificates.css';

const Certificates = () => {
  const certs = [
    { name: 'GMP Certified', logo: '🏭' },
    { name: 'AYUSH Approved', logo: '🌿' },
    { name: 'ISO 9001:2015', logo: '📋' },
    { name: 'NABL Accredited', logo: '🔬' },
    { name: 'FDA Approved', logo: '✅' },
  ];

  return (
    <section className="certificates">
      <div className="container">
        <div className="section-header">
          <h2>Our Certifications</h2>
          <p>Committed to quality and safety standards</p>
        </div>
        <div className="certs-grid">
          {certs.map((cert, index) => (
            <div className="cert-card" key={index}>
              <div className="cert-logo">{cert.logo}</div>
              <span>{cert.name}</span>
            </div>
          ))}
        </div>
        <div className="view-certificates">
          <button>View All Certificates →</button>
        </div>
      </div>
    </section>
  );
};

export default Certificates;