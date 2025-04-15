import React from 'react';
import product1 from '../images/product-1.png';
import product2 from '../images/product-2.png';

function Products() {
  const productsStyle = {
    padding: '80px 0',
    backgroundColor: '#f9f9f9'
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
  
  const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '30px'
  };
  
  const productCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease'
  };
  
  const productImageContainerStyle = {
    position: 'relative',
    overflow: 'hidden'
  };
  
  const productImageStyle = {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  };
  
  const productOverlayStyle = {
    position: 'absolute',
    bottom: '-50px',
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transition: 'bottom 0.3s ease'
  };
  
  const overlayButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    color: '#333',
    textDecoration: 'none'
  };
  
  const productInfoStyle = {
    padding: '20px'
  };
  
  const productTitleStyle = {
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: '10px'
  };
  
  const productPriceStyle = {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '10px'
  };
  
  const productRatingStyle = {
    color: '#ffc107',
    fontSize: '14px'
  };
  
  const ratingCountStyle = {
    color: '#777',
    marginLeft: '5px'
  };
  
  // 미디어 쿼리 효과 (JavaScript로 구현)
  const windowWidth = window.innerWidth;
  let columns = 4;
  
  if (windowWidth <= 1024 && windowWidth > 768) {
    columns = 3;
  } else if (windowWidth <= 768 && windowWidth > 576) {
    columns = 2;
  } else if (windowWidth <= 576) {
    columns = 1;
  }
  
  // 제품 카드 호버 효과
  const handleMouseEnter = (e) => {
    const overlay = e.currentTarget.querySelector('.product-overlay');
    if (overlay) {
      overlay.style.bottom = '0';
    }
    
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1.05)';
    }
  };
  
  const handleMouseLeave = (e) => {
    const overlay = e.currentTarget.querySelector('.product-overlay');
    if (overlay) {
      overlay.style.bottom = '-50px';
    }
    
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1)';
    }
  };
  
  return (
    <section style={productsStyle}>
      <div style={containerStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Featured Products</h2>
          <p style={sectionTextStyle}>Discover our most popular products</p>
        </div>
        <div style={{
          ...productGridStyle,
          gridTemplateColumns: `repeat(${columns}, 1fr)`
        }}>
          <div 
            style={productCardStyle} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={productImageContainerStyle}>
              <img src={product1} alt="Product 1" style={productImageStyle} />
              <div className="product-overlay" style={productOverlayStyle}>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-eye"></i></a>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-shopping-cart"></i></a>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-heart"></i></a>
              </div>
            </div>
            <div style={productInfoStyle}>
              <h3 style={productTitleStyle}>Elegant Dress</h3>
              <div style={productPriceStyle}>$89.99</div>
              <div style={productRatingStyle}>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <span style={ratingCountStyle}>(24)</span>
              </div>
            </div>
          </div>
          
          <div 
            style={productCardStyle} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={productImageContainerStyle}>
              <img src={product2} alt="Product 2" style={productImageStyle} />
              <div className="product-overlay" style={productOverlayStyle}>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-eye"></i></a>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-shopping-cart"></i></a>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-heart"></i></a>
              </div>
            </div>
            <div style={productInfoStyle}>
              <h3 style={productTitleStyle}>Casual Shirt</h3>
              <div style={productPriceStyle}>$49.99</div>
              <div style={productRatingStyle}>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
                <span style={ratingCountStyle}>(18)</span>
              </div>
            </div>
          </div>
          
          <div 
            style={productCardStyle} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={productImageContainerStyle}>
              <img src={product1} alt="Product 3" style={productImageStyle} />
              <div className="product-overlay" style={productOverlayStyle}>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-eye"></i></a>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-shopping-cart"></i></a>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-heart"></i></a>
              </div>
            </div>
            <div style={productInfoStyle}>
              <h3 style={productTitleStyle}>Summer Dress</h3>
              <div style={productPriceStyle}>$69.99</div>
              <div style={productRatingStyle}>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <span style={ratingCountStyle}>(32)</span>
              </div>
            </div>
          </div>
          
          <div 
            style={productCardStyle} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={productImageContainerStyle}>
              <img src={product2} alt="Product 4" style={productImageStyle} />
              <div className="product-overlay" style={productOverlayStyle}>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-eye"></i></a>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-shopping-cart"></i></a>
                <a href="#" style={overlayButtonStyle}><i className="fas fa-heart"></i></a>
              </div>
            </div>
            <div style={productInfoStyle}>
              <h3 style={productTitleStyle}>Classic Blouse</h3>
              <div style={productPriceStyle}>$59.99</div>
              <div style={productRatingStyle}>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <i className="far fa-star"></i>
                <span style={ratingCountStyle}>(12)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;