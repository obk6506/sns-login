import React from 'react';
import { signInWithGoogle } from '../firebase/auth';
import './LoginButton.css';

const LoginButton = ({ onSuccess }) => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle().then(user => {
        onSuccess({
          user: user
        });
      });
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div className="login-button-container">
      <button 
        onClick={handleLogin}
        className="google-login-button"
      >
        Google로 로그인
      </button>
      <p className="login-info">구글 계정으로 로그인하여 서비스를 이용하세요.</p>
    </div>
  );
};

export default LoginButton;