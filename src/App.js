import React, { useState, useEffect } from 'react';
import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import PaymentForm from './components/PaymentForm';
import PaymentComplete from './components/PaymentComplete';
import PaymentModal from './components/PaymentModal';
import LocationSearch from './components/LocationSearch';
import { logoutUser, getCurrentUser } from './firebase/auth';
import { getUserPayments } from './firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showPaymentComplete, setShowPaymentComplete] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('자동 로그인 성공:', currentUser.displayName);
          
          // 기존 토큰 디코딩 방식과 호환되는 형태로 사용자 정보 구성
          const userData = {
            name: currentUser.displayName,
            email: currentUser.email,
            picture: currentUser.photoURL,
            sub: currentUser.uid
          };
          setUser(userData);
          
          // 결제 내역 가져오기
          try {
            const payments = await getUserPayments(currentUser.uid);
            setPaymentHistory(payments);
          } catch (paymentError) {
            console.error('결제 내역 가져오기 오류:', paymentError);
          }
        }
      } catch (error) {
        console.error('인증 상태 확인 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthState();
  }, []);

  const handleLoginSuccess = async (response) => {
    if (!response || !response.user) {
      console.error('로그인 응답에 사용자 정보가 없습니다.');
      return;
    }
    
    try {
      const firebaseUser = response.user;
      
      // Firebase UID를 포함한 사용자 정보 설정
      const userData = {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        picture: firebaseUser.photoURL,
        sub: firebaseUser.uid
      };
      
      console.log('로그인 성공:', userData.name);
      setUser(userData);
      
      // 결제 내역 가져오기
      try {
        const payments = await getUserPayments(firebaseUser.uid);
        setPaymentHistory(payments);
      } catch (paymentError) {
        console.error('결제 내역 가져오기 오류:', paymentError);
      }
    } catch (error) {
      console.error('로그인 처리 오류:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      
      // 상태 초기화
      setUser(null);
      setShowPaymentForm(false);
      setPaymentInfo(null);
      setShowPaymentComplete(false);
      setShowLocationSearch(false);
      setPaymentHistory([]);
      
      console.log('로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handlePaymentComplete = (info) => {
    setPaymentInfo(info);
    setShowPaymentForm(false);
    setShowPaymentComplete(true);
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>SNS 로그인 & 결제 테스트</h1>
      </header>
      <main>
        {!user ? (
          <div className="login-container">
            <h2>로그인</h2>
            <LoginButton onSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <div className="logged-in-container">
            <div className="user-info">
              <Profile user={user} />
              <LogoutButton onLogout={handleLogout} />
            </div>
            
            {!showPaymentForm && !showPaymentComplete && !showLocationSearch && (
              <div className="action-buttons">
                <button 
                  className="action-button payment-button"
                  onClick={() => setShowPaymentForm(true)}
                >
                  결제하기
                </button>
                <button 
                  className="action-button location-button"
                  onClick={() => setShowLocationSearch(true)}
                >
                  위치 검색
                </button>
                
                {paymentHistory.length > 0 && (
                  <div className="payment-history">
                    <h3>결제 내역</h3>
                    <ul>
                      {paymentHistory.map((payment, index) => (
                        <li key={index}>
                          <p>결제 금액: {payment.amount.toLocaleString()}원</p>
                          <p>결제 방법: {payment.paymentMethod}</p>
                          <p>결제 일시: {new Date(payment.createdAt.toDate()).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {showPaymentForm && (
              <PaymentForm 
                user={user} 
                onPaymentComplete={handlePaymentComplete}
              />
            )}
            
            {showPaymentComplete && (
              <PaymentComplete 
                paymentInfo={paymentInfo}
                onClose={() => {
                  setShowPaymentComplete(false);
                  // 결제 내역 새로고침
                  getUserPayments(user.sub).then(payments => {
                    setPaymentHistory(payments);
                  });
                }}
              />
            )}
            
            {showLocationSearch && (
              <div className="location-search-container">
                <button 
                  className="close-button"
                  onClick={() => setShowLocationSearch(false)}
                >
                  닫기
                </button>
                <LocationSearch userId={user.sub} />
              </div>
            )}
          </div>
        )}
      </main>
      <footer>
        <p>&copy; 2023 SNS 로그인 & 결제 테스트</p>
      </footer>
    </div>
  );
}

export default App;