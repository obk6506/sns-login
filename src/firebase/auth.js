// Firebase 인증 관련 함수
import { 
  signInWithCredential, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './config';

// Google 로그인 처리 (기존 토큰 사용)
export const signInWithGoogle = async (credential) => {
  try {
    // Google 인증 정보로 Firebase 인증 객체 생성
    const googleCredential = GoogleAuthProvider.credential(credential);
    
    // Firebase에 로그인
    const userCredential = await signInWithCredential(auth, googleCredential);
    return userCredential.user;
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    throw error;
  }
};

// Google 로그인 처리 (팝업 사용)
export const signInWithGooglePopup = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // 구글 인증 정보에서 ID 토큰 가져오기
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.idToken;
    
    return {
      user: result.user,
      token: token
    };
  } catch (error) {
    console.error('Google 팝업 로그인 오류:', error);
    throw error;
  }
};

// 로그아웃 처리
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
};

// 현재 로그인 상태 확인
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        reject(error);
      }
    );
  });
};
