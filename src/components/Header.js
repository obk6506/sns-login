import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import './Header.css';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';

const Header = () => {
    const [user, setUser] = useState(null);

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


  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <img src={logo} alt="Planty Logo" />
          </div>
          <nav className="nav-menu">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#shop">Shop</a></li>
              <li><a href="#plant-care">Plant Care</a></li>
              <li><a href="#blogs">Blogs</a></li>
            </ul>
          </nav>
          <div className="header-actions">
            <button className="icon-btn">
              <i className="fas fa-search"></i>
            </button>
            <button className="icon-btn">
              <i className="fas fa-shopping-cart"></i>
            </button>

            {user ? (
              <div className="auth-container">
                <Profile user={user} />
                <LogoutButton onLogout={handleLogout} />
              </div>
            ) : (
              <LoginButton onLoginSuccess={handleLoginSuccess} />
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;