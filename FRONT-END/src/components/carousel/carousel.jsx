import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import assets from '../../assets/assets';
const carousel = () => {
      const settings = {
    dots: true,          // Show navigation dots
    infinite: true,      // Loop slides
    speed: 500,          // Animation speed in ms
    slidesToShow: 1,     // Show one slide at a time
    slidesToScroll: 1,   // Scroll one slide at a time
    autoplay: true,      // Auto-play slides
    autoplaySpeed: 2000, // Time between slides
  };
    const slides = [
    { id: 1, url: assets.caro1 },
    { id: 2, url: assets.caro2 },
    { id: 3, url: assets.caro3 }
  ];
  return (
    <div className='hii'>
        <div style={{ width: "95%", margin: "auto" , paddingTop: "50px" }}>
      <Slider {...settings}>
        {slides.map(slide => (
          <div key={slide.id}>
            <img
              src={slide.url}
              alt={`Slide ${slide.id}`}
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>
        ))}
      </Slider>
    </div>
    </div>
  )
}

export default carousel
