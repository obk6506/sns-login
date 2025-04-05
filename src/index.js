import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// 환경 변수에서 클라이언트 ID를 가져오거나 기본값 사용
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "440607045464-au36jb06l02fb376cv1smnrh0kcrfrp1.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);