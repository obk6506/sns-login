import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase/auth';
import './LoginButton.css';

const LoginButton = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return; // 중복 클릭 방지
    
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        console.log('로그인 성공:', user.displayName);
        onSuccess({
          user: user
        });
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-button-container">
      <button 
        onClick={handleLogin}
        className="google-login-button"
        disabled={isLoading}
      >
        {isLoading ? '로그인 중...' : 'Google로 로그인'}
      </button>
      <p className="login-info">구글 계정으로 로그인하여 서비스를 이용하세요.</p>
    </div>
  );
};

export default LoginButton;