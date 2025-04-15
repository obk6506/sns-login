import React from 'react';
import bannerImage from '../images/banner-image.png';

function Banner() {
  const bannerStyle = {
    padding: '80px 0',
    backgroundColor: '#f5f5f5'
  };
  
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '40px'
  };
  
  const bannerContentStyle = {
    flex: 1
  };
  
  const bannerTitleStyle = {
    fontSize: '36px',
    fontWeight: 700,
    marginBottom: '15px'
  };
  
  const bannerTextStyle = {
    fontSize: '18px',
    color: '#666',
    marginBottom: '25px'
  };
  
  const buttonStyle = {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: '5px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backgroundColor: '#000',
    color: '#fff',
    textDecoration: 'none'
  };
  
  const bannerImageStyle = {
    flex: 1
  };
  
  const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block'
  };
  
  // 미디어 쿼리 효과 (JavaScript로 구현)
  const isMobile = window.innerWidth <= 768;
  
  return (
    <section style={bannerStyle}>
      <div style={{
        ...containerStyle,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={bannerContentStyle}>
          <h2 style={bannerTitleStyle}>Special Offer</h2>
          <p style={bannerTextStyle}>Get 30% off on all new arrivals</p>
          <a href="#" style={buttonStyle}>Shop Now</a>
        </div>
        <div style={bannerImageStyle}>
          <img src={bannerImage} alt="Special Offer Banner" style={imageStyle} />
        </div>
      </div>
    </section>
  );
}

export default Banner;