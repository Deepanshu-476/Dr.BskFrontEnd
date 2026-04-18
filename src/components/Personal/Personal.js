import React, { useEffect, useState } from 'react';
import './Personal.css';
import axiosInstance from '../AxiosInstance';
import API_URL from '../../config';
import CustomLoader from '../CustomLoader';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import JoinUrl from '../../JoinUrl';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Personal = () => {
  const [vetCategories, setVetCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVetCategories();
    
    // Handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchVetCategories = async () => {
    try {
      const response = await axiosInstance.get(`/user/allSubcategories`);
      const veterinaryCategories = response?.data?.filter(
        (item) => item.subCategoryvariety === 'Veterinary'
      );

      setVetCategories(veterinaryCategories);
    } catch (error) {
      console.error("Error fetching Vet categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSlidesToShow = () => {
    if (windowWidth >= 1200) return 5; // Desktop: 5 categories
    if (windowWidth >= 768) return 4;  // Tablet: 4 categories
    return 2; // Mobile: 2 categories
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: windowWidth > 768,
    initialSlide: 0,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    swipeToSlide: true,
    swipe: true,
    touchThreshold: 10,
    touchMove: true,
    draggable: true,
    centerMode: windowWidth < 768,
    centerPadding: windowWidth < 768 ? '10px' : '0',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          draggable: false
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          draggable: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          draggable: false,
          arrows: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          draggable: true,
          swipe: true,
          touchMove: true,
          swipeToSlide: true,
          centerMode: false,
          variableWidth: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          draggable: true,
          swipe: true,
          touchMove: true,
          swipeToSlide: true,
          centerMode: false
        }
      }
    ]
  };

  if (vetCategories.length === 0 && !loading) return null;

  return (
    <div className="categories-wrapper veterinary-wrapper">
      {loading ? (
        <div className="loader-container">
          <CustomLoader />
        </div>
      ) : (
        <div className="categories-container">
          <div className="categories-section">
            <h2 className="section-title">Popular Veterinary Subcategories</h2>
            <div className="categories-slider-wrapper">
              {vetCategories.length > 2 ? (
                <Slider {...settings} className="categories-slider">
                  {vetCategories.map((item) => (
                    <div key={item._id} className="category-slide">
                      <div 
                        className="category-item"
                        onClick={() => navigate(`/fever/${item.name}`)}
                      >
                        <div className="category-image-wrapper">
                          <img
                            src={JoinUrl(API_URL, item.image)}
                            alt={item.name} 
                            className="category-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150x120?text=Veterinary';
                            }}
                          />
                        </div>
                        <div className="category-name">{item.name}</div>
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="static-categories">
                  {vetCategories.map((item) => (
                    <div 
                      key={item._id}
                      className="category-item static-category"
                     onClick={() => navigate(`/fever/${item.name}`)}
                    >
                      <div className="category-image-wrapper">
                        <img
                          src={JoinUrl(API_URL, item.image)}
                          alt={item.name} 
                          className="category-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150x120?text=Veterinary';
                          }}
                        />
                      </div>
                      <div className="category-name">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personal;
