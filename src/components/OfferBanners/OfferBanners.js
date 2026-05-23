// components/OfferBanners/OfferBanners.jsx
import React from 'react';
import './OfferBanners.css';

const offers = [
  { 
    title: 'BUY 2 GET 1 FREE', 
    subtitle: 'On Selected Products', 
    bg: '#edf5ec', // लाइट ग्रीन पेस्टल
    textColor: '#1e5128', 
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop', // यहाँ अपनी रीयल इमेज का पाथ डालें
    cta: 'Shop Now' 
  },
  { 
    title: 'UP TO 30% OFF', 
    subtitle: 'On Immunity Boosters', 
    bg: '#fdf0e6', // लाइट पीच पेस्टल
    textColor: '#7a2704', 
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=200&h=200&fit=crop', // यहाँ अपनी रीयल इमेज का पाथ डालें
    cta: 'Shop Now' 
  },
  { 
    title: 'COMBO OFFERS', 
    subtitle: 'Best Deals for You', 
    bg: '#fff9e6', // लाइट येलो पेस्टल
    textColor: '#6e4d05', 
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop', // यहाँ अपनी रीयल इमेज का पाथ डालें
    cta: 'Shop Now' 
  },
];

const OfferBanners = () => {
  return (
    <section className="offers-section">
      <div className="container">
        <div className="offers-grid">
          {offers.map((offer, index) => (
            <div className="offer-card" key={index} style={{ backgroundColor: offer.bg }}>
              <div className="offer-content">
                <h3 style={{ color: offer.textColor }}>{offer.title}</h3>
                <p>{offer.subtitle}</p>
                <button className="offer-cta" style={{ color: offer.textColor }}>
                  {offer.cta} <span className="arrow">→</span>
                </button>
              </div>
              <div className="offer-image">
                <img src={offer.image} alt={offer.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferBanners;