import React from 'react';

function Footer() {
  const footerStyle = {
    padding: '80px 0 30px',
    backgroundColor: '#f9f9f9'
  };
  
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };
  
  const footerGridStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
    marginBottom: '50px'
  };
  
  const footerColumnStyle = {
    // 기본 스타일
  };
  
  const logoStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontWeight: 700,
    lineHeight: 1.2
  };
  
  const koreanStyle = {
    fontSize: '18px'
  };
  
  const englishStyle = {
    fontSize: '24px',
    letterSpacing: '1px'
  };
  
  const footerTextStyle = {
    margin: '20px 0',
    color: '#666'
  };
  
  const socialIconsStyle = {
    display: 'flex',
    gap: '15px'
  };
  
  const socialLinkStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#333',
    textDecoration: 'none'
  };
  
  const footerTitleStyle = {
    fontSize: '20px',
    marginBottom: '20px',
    fontWeight: 600
  };

  const footerListStyle = {
    listStyle: 'none',
    padding: 0
  };
  
  const footerLinkStyle = {
    color: '#666',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };
  
  const contactInfoStyle = {
    listStyle: 'none',
    padding: 0
  };
  
  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#666',
    marginBottom: '10px'
  };
  
  const footerBottomStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '30px',
    borderTop: '1px solid #eee',
    color: '#666'
  };
  
  const paymentIconsStyle = {
    display: 'flex',
    gap: '10px',
    fontSize: '24px'
  };
  
  // 미디어 쿼리 효과 (JavaScript로 구현)
  const windowWidth = window.innerWidth;
  let columns = '2fr 1fr 1fr 1fr';
  
  if (windowWidth <= 1024 && windowWidth > 576) {
    columns = 'repeat(2, 1fr)';
  } else if (windowWidth <= 576) {
    columns = '1fr';
  }
  
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={{
          ...footerGridStyle,
          gridTemplateColumns: columns
        }}>
          <div style={footerColumnStyle}>
            <h1 style={logoStyle}>
              <span style={koreanStyle}>미지우</span>
              <span style={englishStyle}>MEJIWOO</span>
            </h1>
            <p style={footerTextStyle}>MEJIWOO is a premium fashion brand offering high-quality clothing and accessories for modern women and men.</p>
            <div style={socialIconsStyle}>
              <a href="#" style={socialLinkStyle}><i className="fab fa-facebook-f"></i></a>
              <a href="#" style={socialLinkStyle}><i className="fab fa-twitter"></i></a>
              <a href="#" style={socialLinkStyle}><i className="fab fa-instagram"></i></a>
              <a href="#" style={socialLinkStyle}><i className="fab fa-pinterest-p"></i></a>
            </div>
          </div>
          
          <div style={footerColumnStyle}>
            <h3 style={footerTitleStyle}>Shop</h3>
            <ul style={footerListStyle}>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Women's Fashion</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Men's Fashion</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Accessories</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Footwear</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>New Arrivals</a></li>
            </ul>
          </div>
          
          <div style={footerColumnStyle}>
            <h3 style={footerTitleStyle}>Company</h3>
            <ul style={footerListStyle}>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>About Us</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Contact Us</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Careers</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Privacy Policy</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div style={footerColumnStyle}>
            <h3 style={footerTitleStyle}>Contact</h3>
            <ul style={contactInfoStyle}>
              <li style={contactItemStyle}>
                <i className="fas fa-map-marker-alt"></i> 123 Fashion Street, Seoul, Korea
              </li>
              <li style={contactItemStyle}>
                <i className="fas fa-phone-alt"></i> +82 123 456 7890
              </li>
              <li style={contactItemStyle}>
                <i className="fas fa-envelope"></i> info@mejiwoo.com
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{
          ...footerBottomStyle,
          flexDirection: windowWidth <= 576 ? 'column' : 'row',
          gap: windowWidth <= 576 ? '15px' : '0'
        }}>
          <p>&copy; 2025 MEJIWOO. All Rights Reserved.</p>
          <div style={paymentIconsStyle}>
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-amex"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;