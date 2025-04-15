import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

// onLoginSuccess prop으로 함수 전달받아 처리
const LoginButton = ({ onLoginSuccess }) => {
  return (
    <div>
      <GoogleLogin
        onSuccess={onLoginSuccess}
        onError={() => {
          console.log('로그인 실패');
        }}
        useOneTap
      />
    </div>
  );
};

export default LoginButton;