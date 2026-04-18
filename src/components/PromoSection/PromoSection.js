import React from 'react';
import './PromoSection.css';
import logo from '../../logo/megaphone.gif';

const PromoSection = () => {
  return (
    <section className="promo-section">
      <div className="promo-video">
        <iframe 
          width="100%" 
          height="220" 
          src="https://www.youtube.com/embed/i-6HACPlf3g" 
          title="Promo Video" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen>
        </iframe>
      </div>

      <div className="promo-content">
        <div className="promo-header">
          <img src={logo} alt="megaphone" className="megaphone-gif" />
          <h2>Generic medicine is a right choice. <a href="#">Know More ▶</a></h2>
        </div>
        <div className="benefits">
          <div className="benefit-item reliable">
            <h4>Reliable</h4>
            <p className='benefitsMarginText'>Made with high-quality standards, our generics provide reliable, consistent results you can trust.</p>
          </div>
          <div className="benefit-item secure">
            <h4>Secure</h4>
            <p className='benefitsMarginText'>Each medicine meets strict safety standards, ensuring trusted care with every dose.</p>
          </div>
          <div className="benefit-item affordable">
            <h4>Affordable</h4>
            <p className='benefitsMarginText'>Quality treatments without the high price, making better health accessible for all.</p>
          </div>
          <div className="benefit-item effective">
            <h4>Effective</h4>
            <p className='benefitsMarginText'>Clinically proven to deliver the same benefits as branded alternatives, without compromise.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;