import React from 'react';
import logo from '../assets/logo.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="Planty Logo" />
            <p>We offer a wide range of plants for your home and garden with expert care advice.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#plant-care">Plant Care</a></li>
                <li><a href="#blogs">Blogs</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Help</h3>
              <ul>
                <li><a href="#faq">FAQs</a></li>
                <li><a href="#shipping">Shipping</a></li>
                <li><a href="#returns">Returns</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Contact</h3>
              <ul>
                <li>Email: hello@planty.com</li>
                <li>Phone: +1 234 567 890</li>
                <li>Address: 123 Plant Street, Green City</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Planty. All rights reserved.</p>
          <div className="social-links">
            <a href="#instagram"><i className="fab fa-instagram"></i></a>
            <a href="#facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#twitter"><i className="fab fa-twitter"></i></a>
            <a href="#pinterest"><i className="fab fa-pinterest-p"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;