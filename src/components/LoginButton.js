import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const LoginButton = ({ onSuccess }) => {
  return (
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => {
          console.log('로그인 실패');
        }}
        theme = "outline"
        size = "medium"
        shape = "rectangular"
        
      />
  );
};

export default LoginButton;