// Firestore 데이터베이스 관련 함수
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './config';

// 결제 정보 저장
export const savePayment = async (userId, paymentInfo) => {
  try {
    const paymentData = {
      ...paymentInfo,
      userId,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'payments'), paymentData);
    return {
      id: docRef.id,
      ...paymentData
    };
  } catch (error) {
    console.error('결제 정보 저장 오류:', error);
    throw error;
  }
};

// 사용자 결제 내역 조회
export const getUserPayments = async (userId) => {
  try {
    const paymentsRef = collection(db, 'payments');
    
    // 인덱스 오류 방지를 위해 try-catch 구조 사용
    try {
      // 먼저 정렬을 포함한 쿼리 시도
      const q = query(
        paymentsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10) // 최근 10개만 가져오기
      );
      
      const querySnapshot = await getDocs(q);
      const payments = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        payments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        });
      });
      
      return payments;
    } catch (error) {
      // 인덱스 오류 발생 시 정렬 없이 조회
      console.warn('인덱스 오류, 정렬 없이 조회합니다:', error);
      
      const fallbackQuery = query(
        paymentsRef, 
        where('userId', '==', userId)
      );
      
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const fallbackPayments = [];
      
      fallbackSnapshot.forEach((doc) => {
        const data = doc.data();
        fallbackPayments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        });
      });
      
      // 클라이언트 측에서 정렬
      fallbackPayments.sort((a, b) => b.createdAt - a.createdAt);
      
      return fallbackPayments.slice(0, 10); // 최근 10개만 반환
    }
  } catch (error) {
    console.error('결제 내역 조회 오류:', error);
    return [];
  }
};

// 즐겨찾기 장소 저장
export const saveFavoritePlace = async (userId, placeData) => {
  try {
    const favoriteData = {
      ...placeData,
      userId,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'favoritePlaces'), favoriteData);
    return {
      id: docRef.id,
      ...favoriteData
    };
  } catch (error) {
    console.error('즐겨찾기 저장 오류:', error);
    throw error;
  }
};

// 사용자 즐겨찾기 장소 조회
export const getUserFavoritePlaces = async (userId) => {
  try {
    const placesRef = collection(db, 'favoritePlaces');
    
    // 인덱스 오류 방지를 위해 try-catch 구조 사용
    try {
      // 먼저 정렬을 포함한 쿼리 시도
      const q = query(
        placesRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const places = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        places.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        });
      });
      
      return places;
    } catch (error) {
      // 인덱스 오류 발생 시 정렬 없이 조회
      console.warn('인덱스 오류, 정렬 없이 조회합니다:', error);
      
      if (error.message && error.message.includes('index')) {
        console.info('인덱스 생성이 필요합니다. Firebase 콘솔에서 제공되는 링크를 통해 인덱스를 생성하세요.');
      }
      
      const fallbackQuery = query(
        placesRef, 
        where('userId', '==', userId)
      );
      
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const fallbackPlaces = [];
      
      fallbackSnapshot.forEach((doc) => {
        const data = doc.data();
        fallbackPlaces.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
        });
      });
      
      // 클라이언트 측에서 정렬
      fallbackPlaces.sort((a, b) => b.createdAt - a.createdAt);
      
      return fallbackPlaces;
    }
  } catch (error) {
    console.error('즐겨찾기 조회 오류:', error);
    return [];
  }
};
