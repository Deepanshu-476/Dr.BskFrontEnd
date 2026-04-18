import React, { useEffect, useRef, useState } from "react";
import "./Banner.css";
import axiosInstance from "../AxiosInstance";
import API_URL from "../../config";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import JoinUrl from "../../JoinUrl";

const Banner = () => {
  const [banners, setBanners] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/user/allBanners");
      const bannerData = response.data;

      const mainBanners = bannerData.filter(
        (banner) =>
          banner.type === "HomePageSlider" &&
          Array.isArray(banner.slider_image) &&
          banner.slider_image.length > 0
      );

      if (mainBanners.length > 1) {
        // Add duplicates for looping effect
        setBanners([
          mainBanners[mainBanners.length - 1],
          ...mainBanners,
          mainBanners[0],
        ]);
      } else {
        // Just one banner, no duplicates
        setBanners(mainBanners);
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
    // infinite: false,  // Loop the slider
    infinite: banners.length > 1,  // Enable infinite loop if more than one banner
    speed: 500,  // Transition speed
    slidesToShow: 1,  // Show one slide at a time
    slidesToScroll: 1,  // Scroll one slide at a time
    // autoplay: banners.length > 1,  // Enable autoplay
    autoplay: true,  // Enable autoplay
    autoplaySpeed: 5000,  // Autoplay interval (in ms)
    arrows: false,  // Disable arrows
  };

  return (
    <div className="banner-slider-container ">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div className="banner-slide" key={`banner-${index}`}>
            <img
              // src={`${API_URL}/${banner.slider_image[0]}`}
              src={JoinUrl(API_URL, banner.slider_image[0])}
              alt={`Banner ${index + 1}`}
              className="banner-image1"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;

