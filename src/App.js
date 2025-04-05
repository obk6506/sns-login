import React, { useState } from 'react';
import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import PaymentForm from './components/PaymentForm';
import PaymentComplete from './components/PaymentComplete';
import PaymentModal from './components/PaymentModal';

function App() {
  const [user, setUser] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showPaymentComplete, setShowPaymentComplete] = useState(false);

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
    setShowPaymentForm(false);
    setShowPaymentComplete(false);
    setPaymentInfo(null);
  };

  const handlePaymentComplete = (info) => {
    setPaymentInfo(info);
    setShowPaymentForm(false);
    setShowPaymentComplete(true);
  };

  const handleClosePaymentComplete = () => {
    setShowPaymentComplete(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>구글 로그인 연동 예제</h1>
        
        {!user ? (
          <LoginButton onSuccess={handleLoginSuccess} />
        ) : (
          <div className="user-section">
            <Profile user={user} />
            <div className="action-buttons">
              <button 
                className="payment-button"
                onClick={() => setShowPaymentForm(true)}
              >
                결제하기
              </button>
              <LogoutButton onLogout={handleLogout} />
            </div>
            
            {/* 결제 폼 모달 */}
            <PaymentModal 
              isOpen={showPaymentForm} 
              onClose={() => setShowPaymentForm(false)}
            >
              <PaymentForm 
                user={user} 
                onPaymentComplete={handlePaymentComplete} 
              />
            </PaymentModal>
            
            {/* 결제 완료 모달 */}
            <PaymentModal 
              isOpen={showPaymentComplete} 
              onClose={handleClosePaymentComplete}
            >
              <PaymentComplete 
                paymentInfo={paymentInfo} 
                onClose={handleClosePaymentComplete} 
              />
            </PaymentModal>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;