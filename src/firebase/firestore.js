// Firestore 데이터베이스 관련 함수
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

// 결제 내역 저장
export const savePayment = async (userId, paymentData) => {
  try {
    const paymentWithTimestamp = {
      ...paymentData,
      userId,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'payments'), paymentWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('결제 내역 저장 오류:', error);
    throw error;
  }
};

// 사용자별 결제 내역 조회
export const getUserPayments = async (userId) => {
  try {
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const payments = [];
    
    querySnapshot.forEach((doc) => {
      payments.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      });
    });
    
    return payments;
  } catch (error) {
    console.error('결제 내역 조회 오류:', error);
    throw error;
  }
};

// 결제 내역 상세 조회
export const getPaymentDetail = async (paymentId) => {
  try {
    const docRef = doc(db, 'payments', paymentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('결제 내역 상세 조회 오류:', error);
    throw error;
  }
};

// 즐겨찾기 장소 저장
export const saveFavoritePlace = async (userId, placeData) => {
  try {
    const placeWithTimestamp = {
      ...placeData,
      userId,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'favoritePlaces'), placeWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('즐겨찾기 장소 저장 오류:', error);
    throw error;
  }
};

// 사용자별 즐겨찾기 장소 조회
export const getUserFavoritePlaces = async (userId) => {
  try {
    const q = query(
      collection(db, 'favoritePlaces'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const places = [];
    
    querySnapshot.forEach((doc) => {
      places.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      });
    });
    
    return places;
  } catch (error) {
    console.error('즐겨찾기 장소 조회 오류:', error);
    throw error;
  }
};
