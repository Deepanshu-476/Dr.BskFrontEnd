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
    title: 'Boost Your Immunity Naturally This Winter',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    title: 'Benefits of Giloy for Overall Health',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'How to Manage Diabetes with Ayurveda',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop'
  }
];

const CombinedSection = () => {
  return (
    <section className="main-combined-section">
      <div className="combined-container">
        
        {/* LEFT SIDE: TESTIMONIALS */}
        <div className="testimonials-side">
          <div className="side-header">
            <h2>What Our Customers Say</h2>
          </div>
          
          <div className="carousel-wrapper">
            <button className="nav-arrow left-arrow">&lt;</button>
            
            <div className="testimonials-list">
              {testimonials.map((item) => (
                <div className="t-card" key={item.id}>
                  <div className="t-profile">
                    <img src={item.image} alt={item.name} />
                    <div className="t-meta">
                      <h4>{item.name}</h4>
                      <span>{item.city}</span>
                      <div className="t-stars">
                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="t-comment">{item.text}</p>
                </div>
              ))}
            </div>

            <button className="nav-arrow right-arrow">&gt;</button>
          </div>
        </div>

        {/* RIGHT SIDE: HEALTH TIPS & BLOGS */}
        <div className="blogs-side">
          <div className="side-header blog-header-flex">
            <div>
              <h2>Health Tips & Blogs</h2>
              <p className="sub-title">Explore expert advice for a healthier you</p>
            </div>
            <button className="btn-view-all">View All Blogs</button>
          </div>

          <div className="blogs-list">
            {blogs.map((blog) => (
              <div className="b-card" key={blog.id}>
                <div className="b-img-container">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <div className="b-info">
                  <h3>{blog.title}</h3>
                  <button className="btn-read-more">Read More &rarr;</button>
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