import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "1057955258888-058kp6cnvlc5eb2k1c6rnqjatmek9bmt.apps.googleusercontent.com";

// Google Maps API 동적 로드
const loadGoogleMapsAPI = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API 키가 설정되지 않았습니다.');
    return;
  }

  // 기존 스크립트 요소 가져오기
  const script = document.getElementById('google-maps-api');
  if (!script) {
    console.error('Google Maps API 스크립트 요소를 찾을 수 없습니다.');
    return;
  }

  // API 키 설정 및 스크립트 로드
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ko&callback=initMap`;
  script.async = true;
  script.defer = true;

  // 콜백 함수 정의
  window.initMap = function() {
    console.log('Google Maps API가 성공적으로 로드되었습니다.');
  };

  // 로드 오류 처리
  script.onerror = function() {
    console.error('Google Maps API 로드 중 오류가 발생했습니다.');
  };
};

// API 로드
loadGoogleMapsAPI();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();