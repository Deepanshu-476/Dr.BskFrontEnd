// components/BlogSection/BlogSection.jsx
import React from 'react';
import './BlogSection.css';

const blogs = [
  {
    id: 1,
    title: 'Boost Your Immunity Naturally',
    excerpt: 'Discover ancient Ayurvedic wisdom to strengthen your immune system with these natural remedies.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop',
    date: 'Dec 15, 2024',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Benefits of Giloy for Health',
    excerpt: 'Learn how Giloy, the wonder herb, can transform your health and fight various diseases.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=250&fit=crop',
    date: 'Dec 10, 2024',
    readTime: '4 min read'
  },
  {
    id: 3,
    title: 'How to Manage Diabetes',
    excerpt: 'Expert tips and Ayurvedic solutions for managing diabetes effectively and naturally.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop',
    date: 'Dec 5, 2024',
    readTime: '6 min read'
  }
];

const BlogSection = () => {
  return (
    <section className="blog-section">
      <div className="container">
        <div className="section-header">
          <h2>Health Tips & Blogs</h2>
          <p>Explore expert advice for a healthier you</p>
          <button className="view-all-blogs">View All Blogs →</button>
        </div>
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog.id}>
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <button className="read-more">Read More →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;