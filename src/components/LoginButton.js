import React, { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import './LoginButton.css';

const LoginButton = ({ onSuccess }) => {
  // Google OAuth 클라이언트 초기화
  useEffect(() => {
    // 구글 로그인 버튼 초기화 로직
    const initGoogleButton = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: '1057955258888-058kp6cnvlc5eb2k1c6rnqjatmek9bmt.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-login-button'),
          { 
            type: 'standard', 
            theme: 'outline', 
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'center',
            width: 250
          }
        );
      } else {
        setTimeout(initGoogleButton, 300);
      }
    };
    
    initGoogleButton();
    
    return () => {
      // 클린업 함수
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  // 구글 로그인 응답 처리
  const handleCredentialResponse = (response) => {
    if (response && response.credential) {
      onSuccess(response);
    }
  };

  // 구글 로그인 버튼 렌더링
  return (
    <div className="login-button-container">
      <div id="google-login-button" className="google-login-button"></div>
      <p className="login-info">구글 계정으로 로그인하여 서비스를 이용하세요.</p>
    </div>
  );
};

export default LoginButton;