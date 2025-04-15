import React from 'react';
import heroImage from '../assets/hero-image.png';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Plants are our Passion</h1>
            <p>Discover beautiful plants for your home, with free care advice and support throughout your plant parenthood journey.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Shop Now</button>
              <button className="btn btn-outline">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Plants" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;