import React, { useState, useEffect } from 'react';
import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import PaymentForm from './components/PaymentForm';
import PaymentComplete from './components/PaymentComplete';
import PaymentModal from './components/PaymentModal';
import LocationSearch from './components/LocationSearch';
import { saveUserToSupabase, getUserFromSupabase } from './utils/authUtils';
// 임시로 비활성화
// import { getUserPayments } from './utils/paymentUtils';
// import { getUserLocations } from './utils/locationUtils';

function App() {
  const [user, setUser] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showPaymentComplete, setShowPaymentComplete] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [userPayments, setUserPayments] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // 사용자 정보가 변경될 때마다 Supabase에서 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.email) {
        setLoading(true);
        try {
          // 사용자 정보를 Supabase에 저장
          await saveUserToSupabase({
            email: user.email,
            name: user.name,
            picture: user.picture
          });
          
          // 임시로 비활성화
          // 사용자의 결제 내역 가져오기
          // const payments = await getUserPayments(user.email);
          // setUserPayments(payments);
          
          // 사용자의 위치 정보 가져오기
          // const locations = await getUserLocations(user.email);
          // setUserLocations(locations);
        } catch (error) {
          console.error('데이터 가져오기 오류:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleLoginSuccess = (response) => {
    const token = response.credential;
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
    setShowLocationSearch(false);
    setPaymentInfo(null);
    setUserPayments([]);
    setUserLocations([]);
  };

  const handlePaymentComplete = async (info) => {
    setPaymentInfo(info);
    setShowPaymentForm(false);
    setShowPaymentComplete(true);
    
    // 임시로 비활성화
    // 결제 완료 후 결제 내역 다시 가져오기
    // if (user && user.email) {
    //   const payments = await getUserPayments(user.email);
    //   setUserPayments(payments);
    // }
  };

  const handleClosePaymentComplete = () => {
    setShowPaymentComplete(false);
  };

  const toggleLocationSearch = () => {
    setShowLocationSearch(!showLocationSearch);
  };

  // 임시로 비활성화
  // 위치 저장 후 위치 목록 업데이트
  const handleLocationSaved = async () => {
    // if (user && user.email) {
    //   const locations = await getUserLocations(user.email);
    //   setUserLocations(locations);
    // }
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
            
            {loading ? (
              <p>데이터를 불러오는 중...</p>
            ) : (
              <>
                <div className="user-data-section">
                  {/* 임시로 비활성화 */}
                  {/* {userPayments.length > 0 && (
                    <div className="payment-history">
                      <h3>결제 내역</h3>
                      <ul>
                        {userPayments.slice(0, 3).map((payment) => (
                          <li key={payment.id}>
                            {new Date(payment.created_at).toLocaleDateString()} - {payment.amount}원
                          </li>
                        ))}
                      </ul>
                    </div>
                  )} */}
                  
                  {/* {userLocations.length > 0 && (
                    <div className="location-history">
                      <h3>저장된 위치</h3>
                      <ul>
                        {userLocations.slice(0, 3).map((location) => (
                          <li key={location.id}>
                            {location.name} - {location.address}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )} */}
                </div>
                
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
                    <LocationSearch user={user} onLocationSaved={handleLocationSaved} />
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
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;