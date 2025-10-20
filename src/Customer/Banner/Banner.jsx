import React, { useState, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const closeBanner = () => {
    setIsVisible(false);

    localStorage.setItem('bannerClosed', 'true');
  };

  useEffect(() => {

    const bannerClosed = localStorage.getItem('bannerClosed') === 'true';
    if (bannerClosed) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="center-banner-overlay">
      <div className="center-banner">
        <button className="close-button" onClick={closeBanner}>
          &times;
        </button>
        <div className="banner-content">
          <h2>Khuyến mãi đặc biệt!</h2>
          <p>Giảm giá 30% cho tất cả sản phẩm mới nhất</p>
          <button className="action-button">Xem ngay</button>
        </div>
      </div>
    </div>
  );
};

export default Banner;

