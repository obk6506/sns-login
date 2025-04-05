// Firestore 데이터베이스 관련 함수
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  orderBy
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
    const q = query(
      paymentsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
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
    console.error('즐겨찾기 장소 조회 오류:', error);
    return [];
  }
};
