import React from 'react';
import heroImage from '../images/hero-image.png';

function Hero() {
  const heroStyle = {
    padding: '80px 0',
    backgroundColor: '#f9f9f9'
  };
  
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '40px'
  };
  
  const heroContentStyle = {
    flex: 1
  };
  
  const heroTitleStyle = {
    fontSize: '48px',
    fontWeight: 700,
    marginBottom: '20px'
  };
  
  const heroTextStyle = {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px'
  };
  
  const heroButtonsStyle = {
    display: 'flex',
    gap: '15px'
  };
  
  const primaryButtonStyle = {
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
  
  const secondaryButtonStyle = {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: '5px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: '1px solid #000',
    color: '#000',
    textDecoration: 'none'
  };
  
  const heroImageStyle = {
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
    <section style={heroStyle}>
      <div style={{
        ...containerStyle,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={heroContentStyle}>
          <h2 style={heroTitleStyle}>Season Collections</h2>
          <p style={heroTextStyle}>Find your style with our new season collections</p>
          <div style={heroButtonsStyle}>
            <a href="#" style={primaryButtonStyle}>Shop Now</a>
            <a href="#" style={secondaryButtonStyle}>Learn More</a>
          </div>
        </div>
        <div style={heroImageStyle}>
          <img src={heroImage} alt="MEJIWOO Fashion Hero Image" style={imageStyle} />
        </div>
      </div>
    </section>
  );
}

export default Hero;