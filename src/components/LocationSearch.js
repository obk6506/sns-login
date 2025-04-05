import React, { useState, useEffect } from 'react';
import { getCurrentLocation, searchNearbyPlaces } from '../utils/location';

const LocationSearch = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 위치 정보 가져오기
  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      
      // 위치 정보를 가져온 후 주변 장소 검색
      const nearbyPlaces = await searchNearbyPlaces(currentLocation);
      setPlaces(nearbyPlaces);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-search">
      <h2>주변 동물병원 찾기</h2>
      
      <button 
        onClick={fetchLocation} 
        disabled={loading}
      >
        {loading ? '검색 중...' : '내 주변 동물병원 찾기'}
      </button>
      
      {error && (
        <div className="error-message">
          <p>오류가 발생했습니다: {error}</p>
          <p>위치 정보 접근 권한을 허용해주세요.</p>
        </div>
      )}
      
      {location && (
        <div className="location-info">
          <p>현재 위치: 위도 {location.latitude.toFixed(6)}, 경도 {location.longitude.toFixed(6)}</p>
        </div>
      )}
      
      {places.length > 0 && (
        <div className="places-list">
          <h3>주변 동물병원 목록</h3>
          <ul>
            {places.map(place => (
              <li key={place.id} className="place-item">
                <h4>{place.name}</h4>
                <p>주소: {place.vicinity}</p>
                <p>평점: {place.rating} ⭐ | 거리: {place.distance}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
