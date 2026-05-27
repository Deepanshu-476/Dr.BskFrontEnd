// components/CombinedSection/CombinedSection.jsx
import React from 'react';
import './CombinedSection.css';

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

const blogs = [
  {
    id: 1,
    title: 'How To Choose The Best Animal Health Companies In India For Livestock Management?',
    image: '/blog.jpg'
  },
  {
    id: 2,
    title: 'How To Choose The Best Animal Health Companies In India For Livestock Management?',
    image: '/blog.jpg'
  },
  {
    id: 3,
    title: 'How To Choose The Best Animal Health Companies In India For Livestock Management?',
    image: '/blog.jpg'
  }
];

const CombinedSection = () => {
  return (
    <section className="Combined-main-combined-section">
      <div className="Combined-combined-container">
        
        {/* LEFT SIDE: TESTIMONIALS */}
        <div className="Combined-testimonials-side">
          <div className="Combined-side-header">
            <h2>What Our Customers Say</h2>
          </div>
          
          <div className="Combined-carousel-wrapper">
            <button className="Combined-nav-arrow Combined-left-arrow">&lt;</button>
            
            <div className="Combined-testimonials-list">
              {testimonials.map((item) => (
                <div className="Combined-t-card" key={item.id}>
                  <div className="Combined-t-profile">
                    <img src={item.image} alt={item.name} />
                    <div className="Combined-t-meta">
                      <h4>{item.name}</h4>
                      <span>{item.city}</span>
                      <div className="Combined-t-stars">
                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="Combined-t-comment">{item.text}</p>
                </div>
              ))}
            </div>

            <button className="Combined-nav-arrow Combined-right-arrow">&gt;</button>
          </div>
        </div>

        {/* RIGHT SIDE: HEALTH TIPS & BLOGS */}
        <div className="Combined-blogs-side">
          <div className="Combined-side-header Combined-blog-header-flex">
            <div>
              <h2>Health Tips & Blogs</h2>
              <p className="Combined-sub-title">Explore expert advice for a healthier you</p>
            </div>
            <button className="Combined-btn-view-all">View All Blogs</button>
          </div>

          <div className="Combined-blogs-list">
            {blogs.map((blog) => (
              <div className="Combined-b-card" key={blog.id}>
                <div className="Combined-b-img-container">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <div className="Combined-b-info">
                  <h3>{blog.title}</h3>
                  <button className="Combined-btn-read-more">Read More &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CombinedSection;