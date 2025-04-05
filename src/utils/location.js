// src/utils/location.js
import axios from 'axios';

// 현재 위치 정보 가져오기
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

// 주변 장소 검색 (API 키 필요)
export const searchNearbyPlaces = async (location, type = 'restaurant', radius = 1000, keyword = '') => {
  try {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    // API 키가 없거나 'YOUR_API_KEY_HERE'인 경우 테스트 데이터 반환
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      console.log('API 키가 설정되지 않았습니다. 테스트 데이터를 반환합니다.');
      return getMockPlaces(location, type);
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
    return getMockPlaces(location, type);
  }
};

// 테스트용 데이터 생성 함수
const getMockPlaces = (location, type) => {
  // 장소 유형에 따라 다른 테스트 데이터 반환
  const mockData = {
    restaurant: [
      { id: '1', name: '맛있는 식당', vicinity: '현재 위치 근처', rating: 4.5 },
      { id: '2', name: '행복한 식당', vicinity: '현재 위치 근처', rating: 4.2 },
      { id: '3', name: '건강한 식당', vicinity: '현재 위치 근처', rating: 4.0 }
    ],
    cafe: [
      { id: '4', name: '아늑한 카페', vicinity: '현재 위치 근처', rating: 4.7 },
      { id: '5', name: '조용한 카페', vicinity: '현재 위치 근처', rating: 4.3 },
      { id: '6', name: '분위기 좋은 카페', vicinity: '현재 위치 근처', rating: 4.1 }
    ],
    hospital: [
      { id: '7', name: '종합 병원', vicinity: '현재 위치 근처', rating: 4.0 },
      { id: '8', name: '24시 응급실', vicinity: '현재 위치 근처', rating: 4.5 },
      { id: '9', name: '가정의학과', vicinity: '현재 위치 근처', rating: 4.2 }
    ],
    veterinary_care: [
      { id: '10', name: '행복 동물병원', vicinity: '현재 위치 근처', rating: 4.5 },
      { id: '11', name: '건강한 동물병원', vicinity: '현재 위치 근처', rating: 4.2 },
      { id: '12', name: '24시 동물병원', vicinity: '현재 위치 근처', rating: 4.7 }
    ]
  };
  
  // 요청한 유형의 데이터가 없으면 기본 데이터 사용
  const places = mockData[type] || mockData.restaurant;
  
  // 각 장소에 위치와 거리 정보 추가
  return places.map((place, index) => {
    // 각 장소마다 약간 다른 위치 설정
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
