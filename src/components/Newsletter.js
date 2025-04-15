import React from 'react';

function Newsletter() {
  const newsletterStyle = {
    padding: '80px 0',
    backgroundColor: '#000',
    color: '#fff'
  };
  
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };
  
  const newsletterContentStyle = {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto'
  };
  
  const newsletterTitleStyle = {
    fontSize: '32px',
    marginBottom: '15px'
  };
  
  const newsletterTextStyle = {
    marginBottom: '30px',
    color: '#ccc'
  };
  
  const formStyle = {
    display: 'flex',
    gap: '10px'
  };
  
  const inputStyle = {
    flex: 1,
    padding: '12px 15px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px'
  };
  
  const buttonStyle = {
    border: 'none',
    backgroundColor: '#000',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '5px',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #fff'
  };
  
  // 미디어 쿼리 효과 (JavaScript로 구현)
  const isMobile = window.innerWidth <= 768;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    
    if (!email || !isValidEmail(email)) {
      alert('유효한 이메일 주소를 입력해주세요');
      return;
    }
    
    alert('뉴스레터 구독해주셔서 감사합니다!');
    e.target.reset();
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  return (
    <section style={newsletterStyle}>
      <div style={containerStyle}>
        <div style={newsletterContentStyle}>
          <h2 style={newsletterTitleStyle}>Subscribe to Our Newsletter</h2>
          <p style={newsletterTextStyle}>Get updates on our latest collections and exclusive offers</p>
          <form 
            onSubmit={handleSubmit} 
            style={{
              ...formStyle,
              flexDirection: isMobile ? 'column' : 'row'
            }}
          >
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email address" 
              required 
              style={inputStyle} 
            />
            <button type="submit" style={buttonStyle}>Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;