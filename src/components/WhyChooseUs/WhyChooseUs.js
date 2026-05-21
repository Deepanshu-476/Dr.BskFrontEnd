// components/WhyChooseUs/WhyChooseUs.jsx
import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    { icon: '💰', title: 'Affordable Prices', desc: 'Save up to 80% on medicine bills' },
    { icon: '✅', title: 'Quality Assurance', desc: '100% genuine products trusted by experts' },
    { icon: '👨‍⚕️', title: 'Expert Support', desc: 'Trained pharmacists 24x7 available' },
    { icon: '🚚', title: 'Fast Delivery', desc: 'Quick & safe delivery at your doorstep' },
    { icon: '🔄', title: 'Easy Returns', desc: '7 days easy return policy' },
    { icon: '🔒', title: 'Secure Payments', desc: 'Multiple secure payment options' },
  ];

  return (
    <section className="why-choose">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Dr.BsK's Healthcare?</h2>
          <p>Your trusted partner for authentic Ayurvedic wellness</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;