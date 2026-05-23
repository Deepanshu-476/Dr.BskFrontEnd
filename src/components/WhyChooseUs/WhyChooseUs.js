// components/WhyChooseUs/WhyChooseUs.jsx
import React from 'react';
import './WhyChooseUs.css';

const features = [
  { icon: '💸', title: 'Affordable Prices', desc: 'Save up to 80% on medicine bills' },
  { icon: '🛡️', title: 'Quality Assurance', desc: '100% genuine products trusted by experts' },
  { icon: '📞', title: 'Expert Support', desc: 'Trained pharmacists 24x7 available' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Quick & safe delivery at your doorstep' },
  { icon: '🔄', title: 'Easy Returns', desc: '7 days easy return policy' },
  { icon: '👜', title: 'Secure Payments', desc: 'Multiple secure payment options' },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose">
      <div className="container">
        <div className="section-header-center">
          <h2>Why Choose Dr. BSK's Healthcare?</h2>
        </div>
        
        <div className="features-row-container">
          {features.map((feature, index) => (
            <div className="feature-row-card" key={index}>
              <div className="feature-icon-box">
                {/* यहाँ आप इमेज में दिखने वाले लाइन-आर्ट आइकॉन्स डाल सकते हैं */}
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
    </section>
  );
};

export default WhyChooseUs;