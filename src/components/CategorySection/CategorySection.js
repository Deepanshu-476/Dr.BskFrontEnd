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

        {/* Unified Card Container wrapper matching image style */}
        <div className="ui-category-card">
          
          {/* Header layout matching image */}
          <div className="ui-section-header">
            <h2>Shop By Category</h2>
            <p className="ui-sub-text">Find the right solution for your health</p>
            <span className="ui-view-all" onClick={() => navigate('/shop')}>View All</span>
          </div>

          {/* Categories Grid Container */}
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
          </div>

        </div>

      </div>
    </section>
  );
};

export default CategorySection;