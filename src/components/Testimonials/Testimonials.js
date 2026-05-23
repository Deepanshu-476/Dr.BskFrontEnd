// components/Testimonials/Testimonials.jsx
import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Rohit Sharma',
    city: 'Delhi',
    rating: 4,
    text: 'Excellent products and fast delivery. Highly recommended!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    name: 'Priya Nair',
    city: 'Bangalore',
    rating: 5,
    text: 'Very effective products. Great experience!',
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: 3,
    name: 'Amit Verma',
    city: 'Chandigarh',
    rating: 5,
    text: 'Best ayurvedic products at affordable price.',
    image: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2>What Our Customers Say</h2>
      </div>
      
      <div className="carousel-container">
        {/* Left Arrow Button */}
        <button className="carousel-arrow left-arrow">&lt;</button>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.id}>
              <div className="testimonial-header">
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.city}</span>
                  <div className="testimonial-rating">
                    {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button className="carousel-arrow right-arrow">&gt;</button>
      </div>
    </section>
  );
};

export default Testimonials;