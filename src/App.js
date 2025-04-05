import React, { useState } from 'react';
import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';

function App() {
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
    <div className="App">
      <header className="App-header">
        <h1>구글 로그인 연동 예제</h1>
        {!user ? (
          <LoginButton onSuccess={handleLoginSuccess} />
        ) : (
          <div>
            <Profile user={user} />
            <LogoutButton onLogout={handleLogout} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;