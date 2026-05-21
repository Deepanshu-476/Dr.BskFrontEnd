// components/OfferBanners/OfferBanners.jsx
import React from 'react';
import './OfferBanners.css';

const OfferBanners = () => {
  const offers = [
    { title: 'BUY 2 GET 1 FREE', subtitle: 'On Selected Products', bg: 'linear-gradient(135deg, #7a0c0c 0%, #a03030 100%)', cta: 'Shop Now' },
    { title: 'UP TO 30% OFF', subtitle: 'On Immunity Boosters', bg: 'linear-gradient(135deg, #1a5a4c 0%, #2d8f7a 100%)', cta: 'Shop Now' },
    { title: 'COMBO OFFERS', subtitle: 'Best Deals for You', bg: 'linear-gradient(135deg, #b86f2c 0%, #d98a3c 100%)', cta: 'Shop Now' },
  ];

  return (
    <section className="offers-section">
      <div className="container">
        <div className="offers-grid">
          {offers.map((offer, index) => (
            <div className="offer-card" key={index} style={{ background: offer.bg }}>
              <div className="offer-content">
                <h3>{offer.title}</h3>
                <p>{offer.subtitle}</p>
                <button className="offer-cta">{offer.cta} →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferBanners;