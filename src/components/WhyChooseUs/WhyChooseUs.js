// components/WhyChooseUs/WhyChooseUs.jsx
import React from 'react';
import './WhyChooseUs.css';

const features = [
  { icon: '💸', title: 'Affordable Prices', desc: 'Save up to 80%' },
  { icon: '🛡️', title: '100% Genuine Products', desc: 'Trusted by experts' },
  { icon: '📞', title: 'Expert Support', desc: '24x7 available' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Quick & safe' },
  { icon: '🔄', title: 'Easy Returns', desc: '7 day easy return' },
  { icon: '👜', title: 'Secure Payments', desc: 'Multiple options' },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose">
      <div className="container">
        
        {/* Main Card Frame Wrapper for Mobile Layout Consistency */}
        <div className="why-choose-main-frame">
          
          <div className="section-header-center">
            <h2>Why Choose Dr. BSK's Healthcare?</h2>
          </div>
          
          <div className="features-row-container">
            {features.map((feature, index) => (
              <div className="feature-row-card" key={index}>
                <div className="feature-icon-box">
                  <span className="icon-render">{feature.icon}</span>
                </div>
                <div className="feature-text-box">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;