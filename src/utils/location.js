// src/utils/location.js
import axios from 'axios';

// 현재 위치 정보 가져오기
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저에서는 위치 정보를 지원하지 않습니다.'));
      return;
    }

    const options = {
      enableHighAccuracy: true,  // 높은 정확도 사용
      timeout: 15000,            // 15초 타임아웃으로 증가
      maximumAge: 0              // 캐시된 위치 정보 사용하지 않음
    };

    // 위치 정보 요청 시도 횟수
    let attempts = 0;
    const maxAttempts = 3;

    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // 위치 정보 로깅
          console.log('정확한 위치 정보:', position.coords);
          
          // 정확도가 너무 낮으면(값이 클수록 정확도 낮음) 다시 시도
          if (accuracy > 1000 && attempts < maxAttempts) {
            console.log(`위치 정보 정확도가 낮습니다(${Math.round(accuracy)}m). 다시 시도 중... (${attempts + 1}/${maxAttempts})`);
            attempts++;
            setTimeout(getPosition, 2000); // 2초 후 다시 시도
            return;
          }
          
          // 위치 정보 반환
          resolve({
            latitude,
            longitude,
            accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          console.error('위치 정보 가져오기 오류:', error);
          
          // 오류 코드에 따른 메시지
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              break;
            default:
              errorMessage = '알 수 없는 오류가 발생했습니다.';
          }
          reject(new Error(errorMessage));
        },
        options
      );
    };

    getPosition();
  });
};

// 주변 장소 검색 (API 키 필요)
export const searchNearbyPlaces = async (location, type = 'restaurant', radius = 1000, keyword = '') => {
  try {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    // 테스트 모드 활성화 - API 키 제한 문제로 인해 항상 테스트 데이터 사용
    const useTestData = true; // 실제 API 호출이 필요하면 false로 변경
    
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || useTestData) {
      console.log('테스트 데이터를 사용합니다.');
      return getMockPlaces(location, type, keyword);
    }
    
    // 기본 URL 파라미터 설정
    let params = {
      location: `${location.latitude},${location.longitude}`,
      radius: radius,
      type: type,
      key: API_KEY,
      language: 'ko'  // 한국어 결과 반환
    };
    
    // 키워드가 있으면 추가
    if (keyword && keyword.trim() !== '') {
      params.keyword = keyword.trim();
    }
    
    // URL 파라미터 문자열로 변환
    const queryParams = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    // CORS 이슈를 해결하기 위해 프록시 서버 사용
    const url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?${queryParams}`;
    
    console.log('API 요청 URL:', url);
    
    const response = await axios.get(url);
    console.log('API 응답:', response.data);
    
    if (response.data && response.data.results) {
      return response.data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        vicinity: place.vicinity || place.formatted_address || '주소 정보 없음',
        rating: place.rating || 0,
        distance: calculateDistance(location, {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        }),
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('장소 검색 중 오류 발생:', error);
    // 오류 발생 시 테스트 데이터 반환
    return getMockPlaces(location, type, keyword);
  }
};

// 테스트용 데이터 생성 함수
const getMockPlaces = (location, type, keyword = '') => {
  // 장소 유형에 따라 다른 테스트 데이터 반환
  const mockData = {
    restaurant: [
      { id: '1', name: '맛있는 식당', vicinity: '광주 서구 123-45', rating: 4.5 },
      { id: '2', name: '행복한 식당', vicinity: '광주 서구 456-78', rating: 4.2 },
      { id: '3', name: '건강한 식당', vicinity: '광주 서구 789-10', rating: 4.0 },
      { id: '4', name: '24시간 식당', vicinity: '광주 서구 101-11', rating: 3.8 },
      { id: '5', name: '가족 식당', vicinity: '광주 서구 121-31', rating: 4.1 }
    ],
    cafe: [
      { id: '6', name: '아늑한 카페', vicinity: '광주 서구 141-51', rating: 4.7 },
      { id: '7', name: '조용한 카페', vicinity: '광주 서구 161-71', rating: 4.3 },
      { id: '8', name: '분위기 좋은 카페', vicinity: '광주 서구 181-91', rating: 4.1 },
      { id: '9', name: '24시간 카페', vicinity: '광주 서구 202-02', rating: 3.9 },
      { id: '10', name: '디저트 카페', vicinity: '광주 서구 222-22', rating: 4.4 }
    ],
    hospital: [
      { id: '11', name: '종합 병원', vicinity: '광주 서구 242-42', rating: 4.0 },
      { id: '12', name: '24시 응급실', vicinity: '광주 서구 262-62', rating: 4.5 },
      { id: '13', name: '가정의학과', vicinity: '광주 서구 282-82', rating: 4.2 },
      { id: '14', name: '내과 의원', vicinity: '광주 서구 303-03', rating: 3.8 },
      { id: '15', name: '피부과 의원', vicinity: '광주 서구 323-23', rating: 4.1 }
    ],
    pharmacy: [
      { id: '16', name: '24시간 약국', vicinity: '광주 서구 343-43', rating: 4.3 },
      { id: '17', name: '건강 약국', vicinity: '광주 서구 363-63', rating: 4.0 },
      { id: '18', name: '행복 약국', vicinity: '광주 서구 383-83', rating: 3.9 },
      { id: '19', name: '종합 약국', vicinity: '광주 서구 404-04', rating: 4.2 },
      { id: '20', name: '편의 약국', vicinity: '광주 서구 424-24', rating: 3.7 }
    ],
    convenience_store: [
      { id: '21', name: 'CU 편의점', vicinity: '광주 서구 444-44', rating: 3.8 },
      { id: '22', name: 'GS25 편의점', vicinity: '광주 서구 464-64', rating: 3.9 },
      { id: '23', name: '세븐일레븐 편의점', vicinity: '광주 서구 484-84', rating: 3.7 },
      { id: '24', name: '이마트24 편의점', vicinity: '광주 서구 505-05', rating: 3.8 },
      { id: '25', name: '미니스톱 편의점', vicinity: '광주 서구 525-25', rating: 3.6 }
    ],
    bank: [
      { id: '26', name: '국민은행', vicinity: '광주 서구 545-45', rating: 3.9 },
      { id: '27', name: '신한은행', vicinity: '광주 서구 565-65', rating: 4.0 },
      { id: '28', name: '우리은행', vicinity: '광주 서구 585-85', rating: 3.8 },
      { id: '29', name: '하나은행', vicinity: '광주 서구 606-06', rating: 3.9 },
      { id: '30', name: '농협은행', vicinity: '광주 서구 626-26', rating: 3.7 }
    ],
    shopping_mall: [
      { id: '31', name: '롯데백화점', vicinity: '광주 서구 646-46', rating: 4.2 },
      { id: '32', name: '신세계백화점', vicinity: '광주 서구 666-66', rating: 4.3 },
      { id: '33', name: '이마트', vicinity: '광주 서구 686-86', rating: 4.0 },
      { id: '34', name: '홈플러스', vicinity: '광주 서구 707-07', rating: 3.9 },
      { id: '35', name: '코스트코', vicinity: '광주 서구 727-27', rating: 4.4 }
    ],
    veterinary_care: [
      { id: '36', name: '행복 동물병원', vicinity: '광주 서구 747-47', rating: 4.5 },
      { id: '37', name: '건강한 동물병원', vicinity: '광주 서구 767-67', rating: 4.2 },
      { id: '38', name: '24시 동물병원', vicinity: '광주 서구 787-87', rating: 4.7 },
      { id: '39', name: '종합 동물병원', vicinity: '광주 서구 808-08', rating: 4.3 },
      { id: '40', name: '펫 클리닉', vicinity: '광주 서구 828-28', rating: 4.1 }
    ]
  };
  
  // 요청한 유형의 데이터가 없으면 기본 데이터 사용
  let places = mockData[type] || mockData.restaurant;
  
  // 키워드가 있으면 필터링
  if (keyword && keyword.trim() !== '') {
    const searchKeyword = keyword.trim().toLowerCase();
    places = places.filter(place => 
      place.name.toLowerCase().includes(searchKeyword) || 
      place.vicinity.toLowerCase().includes(searchKeyword)
    );
  }
  
  // 각 장소에 위치와 거리 정보 추가
  return places.map((place, index) => {
    // 각 장소마다 약간 다른 위치 설정 (실제 위치 기반)
    const offset = 0.001 * (index + 1);
    const placeLocation = {
      lat: location.latitude + (Math.random() > 0.5 ? offset : -offset),
      lng: location.longitude + (Math.random() > 0.5 ? offset : -offset)
    };
    
    // 거리 계산
    const distance = calculateDistance(location, {
      latitude: placeLocation.lat,
      longitude: placeLocation.lng
    });
    
    return {
      ...place,
      location: placeLocation,
      distance
    };
  });
};

// 두 지점 간의 거리 계산 (Haversine 공식)
const calculateDistance = (point1, point2) => {
  const R = 6371; // 지구 반경 (km)
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(point1.latitude)) * Math.cos(toRad(point2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // 거리를 km 단위로 반환 (소수점 첫째 자리까지)
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// 각도를 라디안으로 변환
const toRad = (value) => {
  return value * Math.PI / 180;
};
