import React, { useState, useEffect } from 'react';
import { getCurrentLocation, searchNearbyPlaces } from '../utils/location';

const LocationSearch = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placeType, setPlaceType] = useState('restaurant');
  const [searchRadius, setSearchRadius] = useState(1000);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 위치 정보 가져오기
  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      
      // 위치 정보를 가져온 후 주변 장소 검색
      const nearbyPlaces = await searchNearbyPlaces(currentLocation, placeType, searchRadius, searchKeyword);
      setPlaces(nearbyPlaces);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 장소 유형 변경 시 재검색
  const handlePlaceTypeChange = (e) => {
    setPlaceType(e.target.value);
  };

  // 검색 반경 변경 시 재검색
  const handleRadiusChange = (e) => {
    setSearchRadius(parseInt(e.target.value, 10));
  };

  // 키워드 변경
  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <div className="location-search">
      <h2>내 주변 장소 찾기</h2>
      
      <div className="search-options">
        <div className="search-option">
          <label>장소 유형:</label>
          <select value={placeType} onChange={handlePlaceTypeChange}>
            <option value="restaurant">음식점</option>
            <option value="cafe">카페</option>
            <option value="convenience_store">편의점</option>
            <option value="hospital">병원</option>
            <option value="pharmacy">약국</option>
            <option value="bank">은행</option>
            <option value="atm">ATM</option>
            <option value="gas_station">주유소</option>
            <option value="subway_station">지하철역</option>
            <option value="bus_station">버스정류장</option>
            <option value="shopping_mall">쇼핑몰</option>
            <option value="park">공원</option>
            <option value="veterinary_care">동물병원</option>
          </select>
        </div>
        
        <div className="search-option">
          <label>검색 반경 (m):</label>
          <select value={searchRadius} onChange={handleRadiusChange}>
            <option value="500">500m</option>
            <option value="1000">1km</option>
            <option value="2000">2km</option>
            <option value="5000">5km</option>
          </select>
        </div>
        
        <div className="search-option">
          <label>키워드 (선택사항):</label>
          <input 
            type="text" 
            value={searchKeyword} 
            onChange={handleKeywordChange}
            placeholder="예: 맛집, 24시간"
          />
        </div>
      </div>
      
      <button 
        onClick={fetchLocation} 
        disabled={loading}
        className="search-button"
      >
        {loading ? '검색 중...' : '내 주변 검색하기'}
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
      
      {places.length > 0 ? (
        <div className="places-list">
          <h3>검색 결과 ({places.length}개)</h3>
          <ul>
            {places.map(place => (
              <li key={place.id} className="place-item">
                <h4>{place.name}</h4>
                <p>주소: {place.vicinity}</p>
                <p>
                  {place.rating ? `평점: ${place.rating} ⭐` : ''} 
                  {place.distance ? ` | 거리: ${place.distance}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : location && !loading ? (
        <div className="no-results">
          <p>검색 결과가 없습니다. 다른 장소 유형이나 더 넓은 반경으로 검색해보세요.</p>
        </div>
      ) : null}
    </div>
  );
};

export default LocationSearch;
