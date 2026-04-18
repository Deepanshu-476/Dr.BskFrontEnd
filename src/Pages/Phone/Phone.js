import React, { useState } from 'react';
import './Phone.css';
import QRImage from '../../logo/qr-code.jpeg';
import DirectImg from '../../logo/direct-link.png';
import AppIllustration from '../../logo/scroll-img.jpeg';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const Phone = () => {
  const [contactMethod, setContactMethod] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsAnimating(false);
    }, 800);
    
    // Reset after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <>
      <Header />
      <div className="phone-container">
        <div className="phone-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
          <div className="bg-shape shape-4"></div>
        </div>
        
        <div className={`phone-content ${isAnimating ? 'animate-out' : ''} ${isSubmitted ? 'submitted' : ''}`}>
          <div className="phone-left">
            <div className="phone-illustration-container">
              <img
                src={AppIllustration}
                alt="App Illustration"
                className="phone-image floating"
              />
              <div className="phone-glow"></div>
            </div>
          </div>
          
          <div className="phone-right">
            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">
                  <div className="success-circle"></div>
                  <div className="success-check"></div>
                </div>
                <h2>Install  Link Sent!</h2>
                <p>We've sent the  Install  link to your {contactMethod}. Check your {contactMethod === 'email' ? 'inbox' : 'messages'}.</p>
                <button 
                  className="back-button" 
                  onClick={() => setIsSubmitted(false)}
                >
                  Back to Install
                </button>
              </div>
            ) : (
              <>
              
                
                <h2>Install Our App</h2>
                <p className="subtitle">Join millions of happy users with our mobile app</p>
                
                <div className="qr-section">
                  <div className="qr-container">
                    <img src={QRImage} alt="QR Code" className="qr-code" />
                    <div className="qr-hover-effect"></div>
                  </div>
                  <div className="qr-text">
                    <p>Scan to Install</p>
                    <small>Point your camera at the QR code</small>
                  </div>
                </div>
{/* 
                <form onSubmit={handleSubmit} className="download-form">
                  <p className="send-link-text">Send download link directly</p>
                  
                  <div className="contact-methods">
                    <button
                      type="button"
                      className={`method-option ${contactMethod === 'email' ? 'active' : ''}`}
                      onClick={() => setContactMethod('email')}
                    >
                      <span className="method-icon">✉️</span>
                      <span>Email</span>
                    </button>
                    <button
                      type="button"
                      className={`method-option ${contactMethod === 'phone' ? 'active' : ''}`}
                      onClick={() => setContactMethod('phone')}
                    >
                      <span className="method-icon">📱</span>
                      <span>Phone</span>
                    </button>
                  </div>

                  <div className="input-row">
                    <div className="input-container">
                      <input
                        type={contactMethod === 'email' ? 'email' : 'tel'}
                        placeholder={`Your ${contactMethod === 'email' ? 'email address' : 'phone number'}`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                      />
                      <span className="input-icon">
                        {contactMethod === 'email' ? '✉️' : '📞'}
                      </span>
                    </div>
                    <button type="submit" className="share-button">
                      <span>Send Link</span>
                      <div className="button-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 12L4 12M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </form> */}

                <div className="store-buttons">
                  <p className="download-text">Also available on</p>

                 <div className="store-links">
                    <a href="https://play.google.com/store/apps/details?id=com.cupid_cakes&hl=en_IN" className="store-link">
                      <img src={DirectImg} alt="Direct-link" className="store-icon" />
                    </a>

                 
                    <a href="#" className="store-link">
                      <img
                        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                        alt="App Store"
                        className="store-icon"
                      />
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=com.cupid_cakes&hl=en_IN" className="store-link">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Google Play"
                        className="store-icon"
                      />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Phone;