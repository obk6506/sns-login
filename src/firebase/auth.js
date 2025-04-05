// Firebase 인증 관련 함수
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { app } from './config';

// Firebase 인증 객체 초기화
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 계정 선택 창이 항상 표시되지 않도록 설정
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // 한 번 로그인한 계정 정보를 저장하도록 설정
  auth_flow_type: 'implicit'
});

// 구글 로그인 처리
export const signInWithGoogle = async () => {
  try {
    // 팝업 방식으로 구글 로그인 진행
    const result = await signInWithPopup(auth, googleProvider);
    
    // 사용자 정보 반환
    return result.user;
  } catch (error) {
    console.error('구글 로그인 오류:', error);
    
    // 오류 코드에 따른 처리
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('로그인 창이 사용자에 의해 닫혔습니다.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('이 도메인에서는 인증이 허용되지 않습니다. Firebase 콘솔에서 도메인을 추가해주세요.');
    }
    
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

// 현재 로그인된 사용자 가져오기
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};
