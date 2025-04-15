import React, { useState } from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLoginSuccess = (response) => {
    const token = response.credential;
    // 토큰 디코딩
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    setUser(decoded);
  };

  const handleLogout = () => {
    setUser(null);
  };
  
  const headerStyle = {
    padding: '20px 0',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };
  
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  };
  
  const logoStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  
  const navStyle = {
    display: 'block'
  };
  
  const navListStyle = {
    display: 'flex',
    gap: '30px',
    listStyle: 'none'
  };
  
  const navLinkStyle = {
    fontSize: '16px',
    fontWeight: 500,
    position: 'relative',
    textDecoration: 'none',
    color: '#333'
  };
  
  const activeLinkStyle = {
    ...navLinkStyle,
    position: 'relative'
  };
  
  const activeLinkAfterStyle = {
    content: '""',
    position: 'absolute',
    bottom: '-5px',
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: '#000'
  };
  
  const headerIconsStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  };
  
  const iconLinkStyle = {
    fontSize: '18px',
    color: '#333',
    textDecoration: 'none'
  };
  
  const mobileMenuToggleStyle = {
    display: 'none',
    fontSize: '24px',
    cursor: 'pointer'
  };
  
  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };
  
  // 모바일 스타일
  const mobileNavStyle = {
    ...navStyle,
    position: mobileMenuOpen ? 'absolute' : 'static',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: mobileMenuOpen ? '20px' : 0,
    boxShadow: mobileMenuOpen ? '0 5px 15px rgba(0, 0, 0, 0.1)' : 'none',
    transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-150%)',
    opacity: mobileMenuOpen ? 1 : 0,
    transition: 'all 0.3s ease',
    zIndex: 99
  };
  
  const mobileNavListStyle = {
    ...navListStyle,
    flexDirection: 'column',
    gap: '15px'
  };
  
  // 미디어 쿼리 효과 (JavaScript로 구현)
  const isMobile = window.innerWidth <= 768;
  
  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div>
          <h1 style={logoStyle}>
            <span style={koreanStyle}>미지우</span>
            <span style={englishStyle}>MEJIWOO</span>
          </h1>
        </div>
        
        <nav style={isMobile ? mobileNavStyle : navStyle}>
          <ul style={isMobile ? mobileNavListStyle : navListStyle}>
            <li>
              <a href="#" style={activeLinkStyle}>
                Home
                <span style={activeLinkAfterStyle}></span>
              </a>
            </li>
            <li><a href="#" style={navLinkStyle}>Shop</a></li>
            <li><a href="#" style={navLinkStyle}>Features</a></li>
            <li><a href="#" style={navLinkStyle}>Contact</a></li>
          </ul>
        </nav>
        
        <div style={headerIconsStyle}>
          <a href="#" style={iconLinkStyle}><i className="fas fa-search"></i></a>
          <a href="#" style={iconLinkStyle}><i className="fas fa-shopping-cart"></i></a>
          
          <div style={userSectionStyle}>
            {user ? (
              <>
                <Profile user={user} />
                <LogoutButton onLogout={handleLogout} />
              </>
            ) : (
              <LoginButton onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        </div>
        
        <div 
          style={{
            ...mobileMenuToggleStyle,
            display: isMobile ? 'block' : 'none'
          }} 
          onClick={toggleMobileMenu}
        >
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </header>
  );
}

export default Header;