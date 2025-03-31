import React, { useState, useEffect } from 'react';
import { listBanner } from '../APIs/bannerLive';

const Hero = () => {
  const [images, setImages] = useState([]);
  const [decription, setDecription] = useState([]);
  const [link, setLink] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gọi API để lấy danh sách banner
  useEffect(() => {
    const fetchBanners = async () => {
      const res = await listBanner({images, decription, link});
        if (res.data) {
          setImages(res.data.map(item => item.image));  
        }
        else {
          setImages([]);  
        }
        };
    fetchBanners();
  }, []);

  // Auto slide mỗi 3 giây
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  // Điều hướng slide
  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  return (
    <div className="banner-slider">
      {images.length > 0 ? (
        images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` , width: '100%', height: '100%' }}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
      
      {/* Nút điều hướng */}
      <button className="nav-btn prev" onClick={goToPrevious}>&#10094;</button>
      <button className="nav-btn next" onClick={goToNext}>&#10095;</button>
    </div>
  );
};

export default Hero;
