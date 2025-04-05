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
  const [error, setError] = useState(null);

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
            setError('결제 내역을 불러오는 중 오류가 발생했습니다.');
          }
        }
      } catch (error) {
        console.error('인증 상태 확인 오류:', error);
        setError('인증 상태를 확인하는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthState();
  }, []);

  const handleLoginSuccess = async (response) => {
    if (!response || !response.user) {
      console.error('로그인 응답에 사용자 정보가 없습니다.');
      setError('로그인 응답에 사용자 정보가 없습니다.');
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
      setError('로그인 처리 중 오류가 발생했습니다.');
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

  // 다양한 날짜 형식 처리
  const formatDate = (dateValue) => {
    try {
      // null이나 undefined인 경우
      if (!dateValue) {
        return '날짜 정보 없음';
      }
      
      let date;
      
      // Firestore Timestamp인 경우
      if (dateValue && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
      } 
      // Date 객체인 경우
      else if (dateValue instanceof Date) {
        date = dateValue;
      } 
      // 숫자(타임스탬프)인 경우
      else if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      }
      // 문자열인 경우
      else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      }
      // 그 외의 경우
      else {
        return '유효하지 않은 날짜';
      }
      
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return '유효하지 않은 날짜';
      }
      
      // 날짜 포맷팅
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hour}:${minute}`;
    } catch (error) {
      console.error('날짜 형식 변환 오류:', error);
      return '날짜 변환 오류';
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error-container">
      <h2>오류가 발생했습니다</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>새로고침</button>
    </div>;
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
                          <p>결제 금액: {payment.amount ? payment.amount.toLocaleString() : 0}원</p>
                          <p>결제 방법: {payment.paymentMethod || '정보 없음'}</p>
                          <p>결제 일시: {formatDate(payment.createdAt)}</p>
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
                  }).catch(error => {
                    console.error('결제 내역 새로고침 오류:', error);
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