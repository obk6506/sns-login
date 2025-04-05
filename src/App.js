import React, { useState, useEffect } from 'react';
import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import PaymentForm from './components/PaymentForm';
import PaymentComplete from './components/PaymentComplete';
import PaymentModal from './components/PaymentModal';
import LocationSearch from './components/LocationSearch';
import { signInWithGoogle, logoutUser, getCurrentUser } from './firebase/auth';
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
          // 기존 토큰 디코딩 방식과 호환되는 형태로 사용자 정보 구성
          const userData = {
            name: currentUser.displayName,
            email: currentUser.email,
            picture: currentUser.photoURL,
            sub: currentUser.uid
          };
          setUser(userData);
          
          // 결제 내역 가져오기
          const payments = await getUserPayments(currentUser.uid);
          setPaymentHistory(payments);
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
    try {
      // 기존 토큰 디코딩 방식 유지
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      
      // Firebase 인증 처리
      try {
        const firebaseUser = await signInWithGoogle(token);
        
        // Firebase UID를 포함한 사용자 정보 설정
        const userData = {
          ...decoded,
          sub: firebaseUser.uid
        };
        
        setUser(userData);
        
        // 결제 내역 가져오기
        const payments = await getUserPayments(firebaseUser.uid);
        setPaymentHistory(payments);
      } catch (firebaseError) {
        console.warn('Firebase 인증 실패, 기본 로그인만 진행:', firebaseError);
        setUser(decoded);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = async () => {
    try {
      // Firebase 로그아웃 시도
      try {
        await logoutUser();
      } catch (firebaseError) {
        console.warn('Firebase 로그아웃 실패:', firebaseError);
      }
      
      // 상태 초기화
      setUser(null);
      setShowPaymentForm(false);
      setShowPaymentComplete(false);
      setShowLocationSearch(false);
      setPaymentInfo(null);
      setPaymentHistory([]);
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handlePaymentComplete = (info) => {
    setPaymentInfo(info);
    setShowPaymentForm(false);
    setShowPaymentComplete(true);
    
    // 결제 내역 갱신
    if (user && user.sub) {
      getUserPayments(user.sub)
        .then(payments => setPaymentHistory(payments))
        .catch(error => console.error('결제 내역 갱신 오류:', error));
    }
  };

  const handleClosePaymentComplete = () => {
    setShowPaymentComplete(false);
  };

  const toggleLocationSearch = () => {
    setShowLocationSearch(!showLocationSearch);
  };

  if (loading) {
    return <div className="App loading">로딩 중...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>구글 로그인 연동 예제</h1>
        
        {!user ? (
          <LoginButton onSuccess={handleLoginSuccess} />
        ) : (
          <div className="user-section">
            <Profile user={user} />
            
            {paymentHistory.length > 0 && (
              <div className="payment-history">
                <h3>결제 내역</h3>
                <ul>
                  {paymentHistory.map(payment => (
                    <li key={payment.id}>
                      <p>결제일: {payment.createdAt.toLocaleDateString()}</p>
                      <p>금액: {payment.amount.toLocaleString()}원</p>
                      <p>상태: {payment.success ? '성공' : '실패'}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="action-buttons">
              <button 
                className="payment-button"
                onClick={() => setShowPaymentForm(true)}
              >
                결제하기
              </button>
              <button 
                className="location-button"
                onClick={toggleLocationSearch}
              >
                {showLocationSearch ? '위치 검색 닫기' : '위치 검색 열기'}
              </button>
              <LogoutButton onLogout={handleLogout} />
            </div>
            
            {showLocationSearch && (
              <div className="location-section">
                <LocationSearch user={user} />
              </div>
            )}
            
            <PaymentModal 
              isOpen={showPaymentForm} 
              onClose={() => setShowPaymentForm(false)}
            >
              <PaymentForm 
                user={user} 
                onPaymentComplete={handlePaymentComplete} 
              />
            </PaymentModal>
            
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