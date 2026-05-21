// components/Testimonials/Testimonials.jsx
import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Rohit Sharma',
    city: 'Mumbai',
    rating: 5,
    text: 'Excellent products and fast delivery. Highly recommended! The Ashwagandha capsules have truly improved my daily energy levels.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    name: 'Priya Nair',
    city: 'Kerala',
    rating: 5,
    text: 'Very effective products. Great experience with Dr.BSK\'s. Their customer support is outstanding and delivery is always on time.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: 3,
    name: 'Amit Verma',
    city: 'Delhi',
    rating: 4,
    text: 'Best Ayurvedic products at affordable price. The Liv-Care syrup worked wonders for my liver health. Will buy again!',
    image: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>Trusted by thousands of happy customers across India</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.id}>
              <div className="testimonial-header">
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.city}</span>
                </div>
              </div>
              <div className="testimonial-rating">
                {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;