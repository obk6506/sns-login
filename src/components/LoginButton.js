import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/config';
import './LoginButton.css';

const LoginButton = ({ onSuccess }) => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // 구글 인증 정보에서 ID 토큰 가져오기
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.idToken;
      
      // 기존 onSuccess 콜백 호출 (App.js의 handleLoginSuccess)
      onSuccess({ credential: token });
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div>
      <button 
        className="google-login-button" 
        onClick={handleGoogleLogin}
      >
        <img 
          src="https://developers.google.com/identity/images/g-logo.png" 
          alt="Google Logo" 
          className="google-logo"
        />
        Google로 로그인
      </button>
    </div>
  );
};

export default LoginButton;