
import React from 'react';
import './FloatingButtons.css';

const FloatingButtons = () => {
  const buttons = [
    { icon: '💬', label: 'WhatsApp', color: '#25D366', action: () => window.open('https://wa.me/919115513759') },
    { icon: '📞', label: 'Call', color: '#7a0c0c', action: () => window.location.href = 'tel:+919115513759' },
    { icon: '📋', label: 'Upload Prescription', color: '#ff9800', action: () => window.location.href = '/#/Prescription' },
  ];

  return (
    <div className="floating-buttons">
      {buttons.map((btn, index) => (
        <button
          key={index}
          className="floating-btn"
          style={{ backgroundColor: btn.color }}
          onClick={btn.action}
        >
          <span className="btn-icon">{btn.icon}</span>
          <span className="btn-label">{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FloatingButtons;