import React, { useEffect, useState } from 'react';
import './HeroSection.css';
import Right from '../../logo/Right.svg';
import Left from '../../logo/Left.svg';
import axiosInstance from '../AxiosInstance';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== '') {
        axiosInstance
          .get(`/user/search?query=${encodeURIComponent(query)}`)
          .then(res => setResults(res.data.results))
          .catch(err => {
            console.error('Search API error:', err);
            setResults([]);
          });
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSuggestionClick = (productId) => {
    navigate(`/ProductPage/${productId}`);
  };

  return (
    <div className="hero-container">
      <div className="search-section">
        {/* <img src={Right} alt="Decorative" className="decorative-image right-image" /> */}

        <div className="hero-content">
          <h2>
            Buy generic medicines online at the{' '}
            <span className="highlight">lowest price</span>
          </h2>

          <div className="search-box ">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search for medicines, health products..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query.trim() !== '' && results.length > 0 && (
              <div className="search-results searchOverflow ">
                {results.map((product) => (
                  <div
                    key={product._id}
                    className="search-result-item"
                    onClick={() => handleSuggestionClick(product._id)}
                  >
                    {product.name}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        {/* <img src={Left} alt="Decorative" className="decorative-image left-image" /> */}
      </div>
    </div>
  );
};

export default HeroSection;
