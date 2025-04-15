import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

// 반드시 prop 이름을 onLoginSuccess로 맞춰야 함!
const LoginButton = ({ onLoginSuccess }) => {
  return (
    <GoogleLogin
      onSuccess={onLoginSuccess}
      onError={() => {
        console.log('로그인 실패');
      }}
      theme="outline"
      size="medium"
      shape="rectangular"
    />
  );
};

export default LoginButton;