// components/BlogSection/BlogSection.jsx
import React from 'react';
import './BlogSection.css';

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

const BlogSection = () => {
  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="blog-section-header">
          <div className="header-text">
            <h2>Health Tips & Blogs</h2>
            <p>Explore expert advice for a healthier you</p>
          </div>
          <button className="view-all-blogs">View All Blogs</button>
        </div>

        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog.id}>
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <button className="read-more">Read More &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;