import React, { useEffect, useState } from 'react';
import './CategorySection.css';
import axiosInstance from '../AxiosInstance';
import API_URL from '../../config';
import JoinUrl from '../../JoinUrl';
import { useNavigate } from 'react-router-dom';

const CategorySection = ({ onCategoryClick }) => {

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch Categories
  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstance.get('/user/allSubcategories');

      const humanCategories = response?.data?.filter(
        (item) => item.subCategoryvariety === 'Human'
      );

      setCategories(humanCategories);

    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/100';
  };

  // SAME CLICK FUNCTION
  const handleCategoryClick = (category) => {

    if (onCategoryClick) {
      onCategoryClick(category.name);
    }

    navigate(`/fever/${category.name}`);
  };

  return (
    <section className="ui-category-section">
      <div className="ui-category-container">

        {/* Header */}
        <div className="ui-section-header">
          <h2>Shop By Category</h2>
          <p>Find the right solution for your health</p>
        </div>

        {/* Categories */}
        <div className="ui-category-flex-row">

          {categories.map((cat, index) => (
            <div
              className="ui-category-node"
              key={cat._id || index}
              onClick={() => handleCategoryClick(cat)}
            >
              <div className="ui-avatar-circle">

                <img
                  src={JoinUrl(API_URL, cat.image)}
                  alt={cat.name}
                  onError={handleImageError}
                />

              </div>

              <span className="ui-category-title">
                {cat.name}
              </span>
            </div>
          ))}

          {/* View All */}
          <div className="ui-category-node">
            <div className="ui-avatar-circle ui-view-all-bg">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#222"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="6" height="6" rx="1" />
                <rect x="15" y="3" width="6" height="6" rx="1" />
                <rect x="15" y="15" width="6" height="6" rx="1" />
                <rect x="3" y="15" width="6" height="6" rx="1" />
              </svg>

            </div>

            <span className="ui-category-title">
              View All
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategorySection;