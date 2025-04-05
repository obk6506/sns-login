import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const LoginButton = ({ onSuccess }) => {
  return (
    <div>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => {
          console.log('로그인 실패');
        }}
        useOneTap
      />
    </div>
  );
};

export default LoginButton;