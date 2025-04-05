// Firebase 설정
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 구성 정보
const firebaseConfig = {
  apiKey: "AIzaSyChehC-m3ScRCRgkirWefZQ3JdASlWyOBc",
  authDomain: "sns-login-pay-gps.firebaseapp.com",
  projectId: "sns-login-pay-gps",
  storageBucket: "sns-login-pay-gps.appspot.com",
  messagingSenderId: "803227020439",
  appId: "1:803227020439:web:1464932d220a0876250dd2",
  measurementId: "G-CRXVN9Z30X"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 인증 및 Firestore 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
