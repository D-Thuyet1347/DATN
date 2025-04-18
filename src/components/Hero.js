import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllSlides } from '../APIs/bannerApi';

const Hero = () => {
  const [heroSlide, setHeroSlide] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await getAllSlides();
        if (res.success && res.data.length > 0) {
          const activeSlide = res.data.find(slide => slide.isActive) || res.data[0];
          setHeroSlide(activeSlide);
        }
      } catch (error) {
        console.error("Lỗi khi tải slide:", error);
      }
    };
    fetchSlides();
  }, []);

  return (
<section className="relative w-full h-screen bg-gray-100 overflow-hidden z-10">
  <div className="absolute  z-10 inset-0">
    {heroSlide?.image ? (
      <img
        src={heroSlide.image}
        alt={heroSlide.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <img
        src={require('../img/banner.jpg')}
        alt="Spa products"
        className="w-full h-full object-cover"
      />
    )}
  </div>

  <div className="container mx-auto h-full flex items-center justify-between px-6 relative z-10">
    <div className="max-w-lg text-white">
      <h1 className="text-4xl font-bold mt-2 mb-2  ">
      {heroSlide?.title}
      </h1>
      <p className="mt-4 leading-relaxed text-justify">
      {heroSlide?.link}
      </p>     
    </div>
  </div>
</section>

  );
};

export default Hero;
