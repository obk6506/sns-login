import React from 'react';
import './Newsletter.css';

const Newsletter = () => {
  return (
    <section className="newsletter section-padding">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2 className="section-title">Join Our Newsletter</h2>
            <p>Stay updated with our latest offers, plant care tips, and exclusive discounts.</p>
          </div>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;