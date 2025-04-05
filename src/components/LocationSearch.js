import React, { useState, useEffect, useRef } from 'react';
import { getCurrentLocation } from '../utils/location';
import './LocationSearch.css';

const LocationSearch = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placeType, setPlaceType] = useState('restaurant');
  const [searchRadius, setSearchRadius] = useState(1000);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const mapRef = useRef(null);
  
  // Google Maps API 로딩 상태 확인
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('Google Maps API 로드 완료 확인됨');
        setGoogleMapsLoaded(true);
        setError(null);
      } else {
        console.log('Google Maps API 로드 대기 중...');
        setTimeout(checkGoogleMapsLoaded, 1000);
      }
    };
    
    checkGoogleMapsLoaded();
    
    // 컴포넌트 언마운트 시 마커 정리
    return () => {
      if (markers.length > 0) {
        markers.forEach(marker => {
          if (marker) marker.setMap(null);
        });
      }
    };
  }, [markers]);
  
  // 위치 정보 가져오기 및 지도 초기화
  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 위치 정보 가져오기
      const currentLocation = await getCurrentLocation();
      console.log('가져온 위치 정보:', currentLocation);
      setLocation(currentLocation);
      
      // Google Maps API가 로드되었는지 확인
      if (googleMapsLoaded) {
        console.log('Google Maps API 로드됨, 지도 초기화 시작');
        // 지도 초기화
        initMap(currentLocation);
      } else {
        console.error('Google Maps API가 로드되지 않았습니다.');
        setLoading(false);
        setError('Google Maps API가 로드되지 않았습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('위치 정보 가져오기 오류:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  // 지도 초기화
  const initMap = (location) => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API가 로드되지 않았습니다.');
      setError('Google Maps API가 로드되지 않았습니다.');
      setLoading(false);
      return;
    }
    
    try {
      console.log('지도 초기화 시작:', location);
      
      // 지도 옵션 설정
      const mapOptions = {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      };
      
      // 지도 생성
      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      console.log('지도 생성 완료');
      
      // 현재 위치 마커 추가
      const currentLocationMarker = new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: newMap,
        title: '현재 위치',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });
      
      console.log('현재 위치 마커 추가 완료');
      setMap(newMap);
      
      // 지도 로드 완료 후 주변 장소 검색
      newMap.addListener('tilesloaded', () => {
        console.log('지도 타일 로드 완료, 주변 장소 검색 시작');
        if (!places.length) {
          searchNearbyPlaces(location, newMap);
        }
      });
      
    } catch (error) {
      console.error('지도 초기화 오류:', error);
      setError('지도를 초기화하는 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
  };
  
  // 주변 장소 검색
  const searchNearbyPlaces = (location, mapInstance = null) => {
    const mapToUse = mapInstance || map;
    
    if (!window.google || !window.google.maps || !window.google.maps.places || !mapToUse) {
      console.error('Google Maps Places API가 로드되지 않았거나 지도가 초기화되지 않았습니다.');
      setError('Google Maps API가 로드되지 않았습니다.');
      setLoading(false);
      return;
    }
    
    try {
      console.log('주변 장소 검색 시작:', location, placeType, searchRadius);
      
      // 이전 마커 제거
      markers.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      setMarkers([]);
      
      const service = new window.google.maps.places.PlacesService(mapToUse);
      
      const request = {
        location: { lat: location.latitude, lng: location.longitude },
        radius: searchRadius,
        type: placeType
      };
      
      // 키워드가 있으면 추가
      if (searchKeyword && searchKeyword.trim() !== '') {
        request.keyword = searchKeyword.trim();
      }
      
      console.log('Places API 요청:', request);
      
      // 지오코딩으로 현재 위치의 주소 정보 가져오기
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: location.latitude, lng: location.longitude } },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            console.log('현재 위치 주소:', results[0]);
            
            // 주소 컴포넌트에서 동 정보 추출
            const addressComponents = results[0].address_components;
            const dongComponent = addressComponents.find(
              component => component.types.includes('sublocality_level_2') || 
                          component.types.includes('sublocality')
            );
            
            if (dongComponent) {
              console.log('현재 동네:', dongComponent.long_name);
              setLocation(prev => ({
                ...prev,
                address: results[0].formatted_address,
                dong: dongComponent.long_name
              }));
            } else {
              setLocation(prev => ({
                ...prev,
                address: results[0].formatted_address
              }));
            }
          }
        }
      );
      
      service.nearbySearch(request, (results, status) => {
        console.log('Places API 응답:', status, results);
        setLoading(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          console.log('검색 결과:', results.length, '개 장소 발견');
          
          // 결과 처리
          const placesData = results.map(place => ({
            id: place.place_id,
            name: place.name,
            vicinity: place.vicinity || place.formatted_address || '주소 정보 없음',
            rating: place.rating || 0,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            types: place.types || []
          }));
          
          setPlaces(placesData);
          
          // 마커 추가
          const newMarkers = placesData.map(place => {
            try {
              const marker = new window.google.maps.Marker({
                position: { lat: place.location.lat, lng: place.location.lng },
                map: mapToUse,
                title: place.name,
                animation: window.google.maps.Animation.DROP
              });
              
              // 정보창 추가
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div>
                    <h3>${place.name}</h3>
                    <p>${place.vicinity}</p>
                    ${place.rating ? `<p>평점: ${place.rating} ⭐</p>` : ''}
                  </div>
                `
              });
              
              marker.addListener('click', () => {
                infoWindow.open(mapToUse, marker);
              });
              
              return marker;
            } catch (err) {
              console.error('마커 생성 오류:', err);
              return null;
            }
          }).filter(marker => marker !== null);
          
          setMarkers(newMarkers);
          console.log('마커 추가 완료:', newMarkers.length);
          
        } else {
          console.error('장소 검색 오류 또는 결과 없음:', status);
          if (status === 'ZERO_RESULTS') {
            setError('검색 결과가 없습니다. 다른 장소 유형이나 더 넓은 반경으로 검색해보세요.');
          } else {
            setError('주변 장소를 찾을 수 없습니다. 상태: ' + status);
          }
          setPlaces([]);
        }
      });
    } catch (error) {
      console.error('장소 검색 중 오류 발생:', error);
      setError('장소 검색 중 오류가 발생했습니다: ' + error.message);
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
  
  // 검색 버튼 클릭
  const handleSearch = () => {
    if (location && map) {
      setLoading(true);
      searchNearbyPlaces(location);
    } else if (location && !map) {
      setLoading(true);
      initMap(location);
    }
  };
  
  // 장소 항목 클릭 시 지도 중심 이동
  const handlePlaceClick = (place) => {
    if (map) {
      map.setCenter({ lat: place.location.lat, lng: place.location.lng });
      map.setZoom(17);
      
      // 해당 마커 찾기
      const marker = markers.find(m => m && m.getTitle() === place.name);
      if (marker) {
        // 마커 애니메이션 및 정보창 열기
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1500);
        
        // 정보창 열기를 위한 클릭 이벤트 트리거
        window.google.maps.event.trigger(marker, 'click');
      }
    }
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
      
      <div className="button-container">
        <button 
          onClick={location ? handleSearch : fetchLocation} 
          disabled={loading}
          className="search-button"
        >
          {loading ? '검색 중...' : location ? '다시 검색하기' : '내 주변 검색하기'}
        </button>
        
        {location && map && (
          <button 
            onClick={() => {
              if (map) {
                map.setCenter({ lat: location.latitude, lng: location.longitude });
                map.setZoom(15);
              }
            }}
            className="center-button"
          >
            현재 위치로 돌아가기
          </button>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          {error.includes('위치 정보') && <p>위치 정보 접근 권한을 허용해주세요.</p>}
        </div>
      )}
      
      {location && (
        <div className="location-info">
          <p>현재 위치: 위도 {location.latitude.toFixed(6)}, 경도 {location.longitude.toFixed(6)}</p>
          {location.accuracy && <p>정확도: {Math.round(location.accuracy)}m</p>}
          {location.dong && <p>동네: {location.dong}</p>}
          {location.address && <p>주소: {location.address}</p>}
        </div>
      )}
      
      <div className="map-container">
        <div ref={mapRef} className="map"></div>
      </div>
      
      {places.length > 0 ? (
        <div className="places-list">
          <h3>검색 결과 ({places.length}개)</h3>
          <ul>
            {places.map(place => (
              <li key={place.id} className="place-item" onClick={() => handlePlaceClick(place)}>
                <h4>{place.name}</h4>
                <p>주소: {place.vicinity}</p>
                {place.rating ? <p>평점: {place.rating} ⭐</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : location && !loading && !error ? (
        <div className="no-results">
          <p>검색 결과가 없습니다. 다른 장소 유형이나 더 넓은 반경으로 검색해보세요.</p>
        </div>
      ) : null}
    </div>
  );
};

export default LocationSearch;
