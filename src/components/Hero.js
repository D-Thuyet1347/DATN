import React, { useState, useEffect } from "react";
import { listBanner } from "../APIs/bannerLive";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await listBanner();
        if (res.data) {
          setBanners(res.data.map((item) => ({ ...item, key: item._id })));
        } else {
          setBanners([]);
        }
      } catch (error) {
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % banners.length);
  };

  return (
    <div className="w-full h-screen flex ">
       {/* Nội dung */}
       <div className="w-1/3 h-full flex items-center justify-center text-black p-10">
        {banners.length > 0 ? (
          <div className="max-w-md">
            <h2 className="text-3xl font-bold">{banners[currentIndex].name}</h2>
            <p className="mt-4">{banners[currentIndex].description}</p>
            <a
              href={banners[currentIndex].link}
              className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
            >
              Xem chi tiết
            </a>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* Ảnh nền */}
      <div className="w-1/2 h-full">
        {banners.length > 0 && (
          <div
            key={banners[currentIndex].key}
            className="w-full h-full bg-cover bg-center transition-opacity duration-500"
            style={{ backgroundImage: `url(${banners[currentIndex].images})` }}
          ></div>
        )}
      </div>

   

      {/* Nút điều hướng */}
      <button
        className="absolute top-1/2 -translate-y-1/2 left-5 bg-black bg-opacity-50 text-white p-3 rounded-full text-2xl z-10 transition duration-300 hover:bg-opacity-80"
        onClick={goToPrevious}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-5 bg-black bg-opacity-50 text-white p-3 rounded-full text-2xl z-10 transition duration-300 hover:bg-opacity-80"
        onClick={goToNext}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Hero;
