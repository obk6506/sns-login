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
export const searchNearbyPlaces = async (location, type = 'veterinary_care', radius = 5000) => {
  try {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    // API 키가 없거나 'YOUR_API_KEY_HERE'인 경우 테스트 데이터 반환
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      console.log('API 키가 설정되지 않았습니다. 테스트 데이터를 반환합니다.');
      return getMockPlaces(location);
    }
    
    // CORS 이슈를 해결하기 위해 프록시 서버를 사용하거나 백엔드를 통해 요청해야 합니다.
    // 여기서는 예시로 직접 호출하지만, 실제로는 작동하지 않을 수 있습니다.
    const url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&key=${API_KEY}`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.results) {
      return response.data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        vicinity: place.vicinity,
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
    return getMockPlaces(location);
  }
};

// 테스트용 데이터 생성 함수
const getMockPlaces = (location) => {
  return [
    {
      id: '1',
      name: '행복 동물병원',
      vicinity: '서울시 강남구 123-45',
      rating: 4.5,
      distance: '0.5km',
      location: { lat: location.latitude + 0.002, lng: location.longitude + 0.001 }
    },
    {
      id: '2',
      name: '건강한 동물병원',
      vicinity: '서울시 강남구 456-78',
      rating: 4.2,
      distance: '1.2km',
      location: { lat: location.latitude - 0.001, lng: location.longitude + 0.003 }
    },
    {
      id: '3',
      name: '24시 동물병원',
      vicinity: '서울시 강남구 789-10',
      rating: 4.7,
      distance: '1.8km',
      location: { lat: location.latitude + 0.003, lng: location.longitude - 0.002 }
    }
  ];
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
