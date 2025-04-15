import React from 'react';
import collection1 from '../images/collection-1.png';
import collection2 from '../images/collection-2.png';
import collection3 from '../images/collection-3.png';
import collection4 from '../images/collection-4.png';
import collection5 from '../images/collection-5.png';
import collection6 from '../images/collection-6.png';

function Categories() {
  const categoriesStyle = {
    padding: '80px 0'
  };
  
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };
  
  const sectionHeaderStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };
  
  const sectionTitleStyle = {
    fontSize: '32px',
    marginBottom: '10px',
    fontWeight: 600
  };
  
  const sectionTextStyle = {
    color: '#777',
    fontSize: '16px'
  };
  
  const categoryGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px'
  };
  
  const categoryItemStyle = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease'
  };
  
  const categoryImageStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover'
  };
  
  const categoryTitleStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    color: '#fff',
    fontSize: '20px',
    fontWeight: 600,
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
  };
  
  // 미디어 쿼리 효과 (JavaScript로 구현)
  const windowWidth = window.innerWidth;
  let columns = 3;
  
  if (windowWidth <= 1024 && windowWidth > 576) {
    columns = 2;
  } else if (windowWidth <= 576) {
    columns = 1;
  }
  
  return (
    <section style={categoriesStyle}>
      <div style={containerStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Categories</h2>
          <p style={sectionTextStyle}>Find your perfect style from our wide range of categories</p>
        </div>
        <div style={{
          ...categoryGridStyle,
          gridTemplateColumns: `repeat(${columns}, 1fr)`
        }}>
          <div style={categoryItemStyle}>
            <img src={collection1} alt="Category 1" style={categoryImageStyle} />
            <h3 style={categoryTitleStyle}>Women's Fashion</h3>
          </div>
          <div style={categoryItemStyle}>
            <img src={collection2} alt="Category 2" style={categoryImageStyle} />
            <h3 style={categoryTitleStyle}>Men's Fashion</h3>
          </div>
          <div style={categoryItemStyle}>
            <img src={collection3} alt="Category 3" style={categoryImageStyle} />
            <h3 style={categoryTitleStyle}>Accessories</h3>
          </div>
          <div style={categoryItemStyle}>
            <img src={collection4} alt="Category 4" style={categoryImageStyle} />
            <h3 style={categoryTitleStyle}>Footwear</h3>
          </div>
          <div style={categoryItemStyle}>
            <img src={collection5} alt="Category 5" style={categoryImageStyle} />
            <h3 style={categoryTitleStyle}>Bags</h3>
          </div>
          <div style={categoryItemStyle}>
            <img src={collection6} alt="Category 6" style={categoryImageStyle} />
            <h3 style={categoryTitleStyle}>Jewelry</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Categories;