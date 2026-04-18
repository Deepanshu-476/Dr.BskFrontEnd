import React, { useEffect, useRef, useState } from 'react';
import './CarouselBanner.css';
import Award1 from '../../logo/Award1.jpg'; // Import the image directly
import JoinUrl from '../../JoinUrl';

const originalImages = [
  Award1, // Use the imported image
  'https://indiater.com/wp-content/uploads/2021/08/free-best-creative-restaurant-banner-for-fast-food-delivery-promotion-banner-1024x1024.jpg',
  'https://png.pngtree.com/thumb_back/fh260/background/20220218/pngtree-free-delivery-banner-image_990488.jpg'
];

const CarouselBanner = () => {
  // Clone the first image and add it to the end for seamless looping
  const images = [...originalImages, originalImages[0]];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const intervalRef = useRef(null);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 3000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  // Handle the seamless transition when we reach the cloned item
  useEffect(() => {
    if (currentIndex === images.length - 1) {
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(0);
        // Force a reflow before enabling transitions again
        setTimeout(() => setTransitionEnabled(true), 50);
      }, 500); // Should match transition duration
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div
      className="banner-wrapper"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <div className="banner-container">
        <div
          className="banner-inner"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none'
          }}
        >
          {images.map((img, index) => (
            <div className="slide" key={`${index}-${img}`}>
              {/* <img src={img} alt={`slide-${index}`} className="banner-img" /> */}
              <img src={JoinUrl(img)} alt={`slide`} className="banner-img" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselBanner;