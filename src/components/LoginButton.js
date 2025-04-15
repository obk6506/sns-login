import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const LoginButton = ({ onLoginSuccess }) => {
  return (
    <div className="google-login-button">
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