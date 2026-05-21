// components/BestSellerProducts/BestSellerProducts.jsx
import React, { useState } from 'react';
import './BestSellerProducts.css';

const products = [
  { id: 1, name: 'Ashwagandha Capsules', price: 600, originalPrice: 750, rating: 4.8, reviews: 128, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop', discount: 20, isPopular: true },
  { id: 2, name: 'Tulsi Drops', price: 350, originalPrice: 450, rating: 4.7, reviews: 96, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop', discount: 22, isPopular: false },
  { id: 3, name: 'Giloy Immunity Booster', price: 450, originalPrice: 560, rating: 4.8, reviews: 112, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop', discount: 20, isPopular: true },
  { id: 4, name: 'Liv-Care Syrup', price: 330, originalPrice: 400, rating: 4.7, reviews: 70, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop', discount: 18, isPopular: false },
  { id: 5, name: 'BSK Pain Relief Oil', price: 250, originalPrice: 330, rating: 4.6, reviews: 85, image: 'https://images.unsplash.com/photo-1603398938370-e20a7d3aac8f?w=300&h=300&fit=crop', discount: 24, isPopular: false },
  { id: 6, name: 'Diabetic Care Kit', price: 600, originalPrice: 1250, rating: 4.8, reviews: 64, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=300&fit=crop', discount: 52, isPopular: true },
];

const BestSellerProducts = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <section className="bestseller-section">
      <div className="container">
        <div className="section-header">
          <h2>Best Sellers</h2>
          <p>Top rated and most trusted products</p>
          <button className="view-all">View All Products →</button>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              {product.discount >= 20 && (
                <div className="discount-badge">{product.discount}% OFF</div>
              )}
              {product.isPopular && <div className="popular-badge">🌟 Bestseller</div>}
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="rating">
                  <span className="stars">★</span>
                  <span className="rating-value">{product.rating}</span>
                  <span className="reviews">({product.reviews} reviews)</span>
                </div>
                <div className="price">
                  <span className="current">₹{product.price}</span>
                  <span className="original">₹{product.originalPrice}</span>
                </div>
                <button className="add-to-cart" onClick={() => addToCart(product)}>
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellerProducts;