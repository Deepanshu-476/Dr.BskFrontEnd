import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Testimonial.css'; // CSS फ़ाइल को इम्पोर्ट करना न भूलें

const Testimonial = () => {
  const testimonialArr = [
    {
      testimony: "Uk German Pharmaceuticals' Veterinary Medicine for Increased Milk Production has been a game-changer for my dairy farm. The remarkable increase in milk yield has not only boosted profits but also enhanced the overall health of my cattle. Thank you Pharmaceuticals for this innovative solution!",
      name: "Rajesh Singh",
    },
    {
      testimony: "Dealing with stubborn worm issues in my livestock was a constant battle until I found Uk German Pharmaceuticals' Veterinary Medicine for Worms Treatment. This reliable and effective product has transformed our animal health management practices, ensuring happier and healthier animals.",
      name: "Savita Prasad",
    },
  ];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="old-testimonial-section-bg">
      <div className="old-container old-py-5">
        <div className="old-row old-align-items-center">
          
          {/* Left Side Content */}
          <div className="old-col-lg-3 old-col-md-12 old-mb-4 old-mb-lg-0">
            <div className="old-testimonial-left-content">
              <span className="old-sub-title">What Our Client Says</span>
              <h2 className="old-main-heading">Latest Testimonials</h2>
              <p className="old-description-text">
                We always provide our best services for our clients and always try to achieve our client's trust and satisfaction.
              </p>
            </div>
          </div>

          {/* Right Side Slider Container */}
          <div className="old-col-lg-9 old-col-md-12">
            <div className="old-slider-wrapper-card">
              <Slider {...settings}>
                {testimonialArr.map((item, index) => (
                  <div key={index} className="old-px-2 old-h-100">
                    <div className="old-testimonial-single-card">
                      <p className="old-testimony-text">{item.testimony}</p>
                      <h4 className="old-client-name">{item.name}</h4>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Testimonial;