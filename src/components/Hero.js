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
   <section className="relative w-full h-screen bg-gray-100 overflow-hidden z-20">
  <div className="absolute inset-0 z-[-1]">
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
      <span className="text-sm uppercase">{heroSlide?.title || "Luxury Spa Experience"}</span>
      <h1 className="text-5xl font-bold mt-2">
        Discover True Serenity for Body and Mind
      </h1>
      <p className="mt-4">
        Experience the perfect blend of traditional techniques and modern AI-driven innovations for ultimate relaxation and rejuvenation.
      </p>
      <div className="mt-6 flex space-x-4">
        <Link to="booknow">
          <button className="bg-maincolor text-white px-6 py-3 rounded-md hover:bg-blue-800 flex items-center">
            Book Appointment <span className="ml-2 material-icons">arrow_forward</span>
          </button>
        </Link>
        <button className="text-white hover:underline">AI Consultation</button>
      </div>
    </div>
  </div>
</section>
  );
};

export default Hero;
