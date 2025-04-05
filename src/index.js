import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// 환경 변수에서 클라이언트 ID를 가져오거나 기본값 사용
// 환경 변수에서 클라이언트 ID를 가져오거나 기본값 사용
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "1057955258888-058kp6cnvlc5eb2k1c6rnqjatmek9bmt.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);