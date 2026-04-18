import React from 'react'
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";

const Testimonial = () => {
  const navigate = useNavigate()

  const testimonialArr = [
    {
      testimony: "Uk German Pharmaceuticals' Veterinary Medicine for Increased Milk Production has been a game-changer for my dairy farm. The remarkable increase in milk yield has not only boosted profits but also enhanced the overall health of my cattle. Thank you Pharmaceuticals for this innovative solution!",
      name: "Rajesh Singh",
    },
    {
      testimony: "Dealing with stubborn worm issues in my livestock was a constant battle until I found Uk German Pharmaceuticals' Veterinary Medicine for Worms Treatment. This reliable and effective product has transformed our animal health management practices, ensuring happier and healthier animals.",
      name: "Savita Prasad",
    },
  ]

  const settings = {
    dots: true,
    // infinite: true,
    // infinite:true,
    speed: 500,
    // slidesToShow: 6,
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
          infinite: true,
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          // initialSlide: 2,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
    ]
  };


  return (
    <div>
      {/* <button onClick={() => (navigate('/'))}>Back</button> */}
      <div className="home_testimonials_webpulse my-5">
        <div className="container">
          <div className="row">

            <div className="title-column col-xxl-3 col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="sec-title">
                <span className="title">What Our Client Says</span>
                <div className="head fw-bold">Latest Testimonials</div>
                <div className="text">We provides always our best services for our clients and always try to achieve our client's trust and satisfaction. </div>
              </div>
            </div>


            <div className="testimonials_column col-xxl-9 col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12 wow fadeInRight testFlex" data-wow-delay=".4s">
              <div className="testimonials_block">
                <Slider {...settings}>
                  {testimonialArr.map((item, index) => (
                    <div className="h-100 cursor-pointer" key={index}>
                      <div className='testimony_card '>
                        <p className="category-title lineClamp6">{item.testimony}</p>
                        <p className="clientFont clrLogo">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>

            </div>

          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    </div>
  )
}

export default Testimonial
