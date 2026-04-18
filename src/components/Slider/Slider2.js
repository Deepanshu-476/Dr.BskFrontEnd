import React, { useEffect, useState } from 'react';
import './Slider.css';
import axiosInstance from '../AxiosInstance';
import API_URL from '../../config';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import JoinUrl from '../../JoinUrl';

const Slider2 = () => {
  const [banners, setBanners] = useState([]);

  // Fetch banners of type 'carousel1'
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/user/allBanners");
      const bannerData = response.data;

      const mainBanners = bannerData.filter(
        (banner) =>
          banner.type === "EndSlider" &&
          Array.isArray(banner.slider_image) &&
          banner.slider_image.length > 0
      );

      if (mainBanners.length > 0) {
        // Clone first and last for smooth loop
        const updatedBanners = [
          mainBanners[mainBanners.length - 1],
          ...mainBanners,
          mainBanners[0],
        ];
        setBanners(updatedBanners);

      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const settings = {
    dots: true,  // Show dots for navigation
    infinite: true,  // Loop the slider
    speed: 500,  // Transition speed
    slidesToShow: 3,  // Show one slide at a time
    slidesToScroll: 1,  // Scroll one slide at a time
    autoplay: true,  // Enable autoplay
    autoplaySpeed: 3000,  // Autoplay interval (in ms)
    arrows: false,  // Disable arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,  // Show two slides on medium screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,  // Show one slide on small screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div className="cd-slider-container">
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <div className="cd-slide" key={`banner-${index}`}>
              <img
                // src={`${API_URL}/${banner.slider_image[0]}`}
                src={JoinUrl(API_URL, banner.slider_image[0])}
                alt={`Banner ${index + 1}`}
                className="cd-image"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* <div className="cd-slider-container">
        <div className={`cd-slider-track ${loaded ? 'animate' : ''}`}>
          {banners.map((banner, index) => (
            <div className="cd-slide" key={`banner-${index}`}>
              <img
                src={`${API_URL}/${banner.slider_image[0]}`}

                alt={`Banner ${index + 1}`}
                className="cd-image"
              />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Slider2;
