import React, { useState, useEffect, useRef } from 'react';
import { getCurrentLocation } from '../utils/location';
import { saveFavoritePlace, getUserFavoritePlaces } from '../firebase/firestore';
import './LocationSearch.css';

const LocationSearch = ({ user }) => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('restaurant');
  const [radius, setRadius] = useState(500);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 구글 맵 스크립트 로드
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      setGoogleMapsLoaded(true);
    }

    return () => {
      // 마커 정리
      if (markers.length > 0) {
        markers.forEach(marker => {
          if (marker) marker.setMap(null);
        });
      }
    };
  }, [markers]);

  // 사용자의 즐겨찾기 장소 불러오기
  useEffect(() => {
    if (user && user.sub) {
      loadFavoritePlaces();
    }
  }, [user]);

  const loadFavoritePlaces = async () => {
    if (!user || !user.sub) return;
    
    try {
      const places = await getUserFavoritePlaces(user.sub);
      setFavoritePlaces(places);
    } catch (error) {
      console.error('즐겨찾기 장소 로드 오류:', error);
    }
  };

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const position = await getCurrentLocation();
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      setLocation(newLocation);
      
      if (googleMapsLoaded) {
        initMap(newLocation);
      }
    } catch (error) {
      setError('위치 정보를 가져오는데 실패했습니다: ' + error.message);
      setLoading(false);
    }
  };

  const loadGoogleMapsScript = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC5q3cJgBxHcdn9F6f5eIjEIXxDqYRu4O8&libraries=places&language=ko`;
    script.async = true;
    script.defer = true;
    
    script.addEventListener('load', () => {
      setGoogleMapsLoaded(true);
      if (location) {
        initMap(location);
      }
    });
    
    document.head.appendChild(script);
  };

  const initMap = async (location) => {
    try {
      if (!mapRef.current) return;
      
      setLoading(true);
      
      // 기존 마커 제거
      if (markers.length > 0) {
        markers.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        setMarkers([]);
      }
      
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
      
      // 현재 위치 마커 추가
      const currentLocationMarker = new window.google.maps.Marker({
        position: location,
        map: newMap,
        title: '현재 위치',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });
      
      setMap(newMap);
      setMarkers([currentLocationMarker]);
      
      // 지도 로드 완료 후 주변 장소 검색
      newMap.addListener('tilesloaded', () => {
        if (location) {
          searchNearbyPlaces(location, newMap);
        }
      });
    } catch (error) {
      setError('지도를 초기화하는 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
  };

  const searchNearbyPlaces = (location, mapInstance) => {
    if (!window.google || !mapInstance) return;
    
    setLoading(true);
    setError(null);
    
    // 기존 장소 마커 제거 (현재 위치 마커는 유지)
    if (markers.length > 1) {
      markers.slice(1).forEach(marker => {
        if (marker) marker.setMap(null);
      });
      setMarkers([markers[0]]);
    }
    
    const service = new window.google.maps.places.PlacesService(mapInstance);
    
    const request = {
      location: location,
      radius: radius,
      type: selectedType
    };
    
    service.nearbySearch(request, (results, status) => {
      setLoading(false);
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // 결과 처리
        const placesData = results.map(place => ({
          id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          rating: place.rating,
          types: place.types
        }));
        
        setPlaces(placesData);
        
        // 마커 추가
        const newMarkers = placesData.map(place => {
          try {
            const marker = new window.google.maps.Marker({
              position: place.location,
              map: mapInstance,
              title: place.name
            });
            
            // 마커 클릭 이벤트
            marker.addListener('click', () => {
              handlePlaceClick(place);
            });
            
            return marker;
          } catch (error) {
            console.error('마커 생성 오류:', error);
            return null;
          }
        }).filter(marker => marker !== null);

        setMarkers([markers[0], ...newMarkers]);
      } else {
        if (status === 'ZERO_RESULTS') {
          setError('검색 결과가 없습니다. 다른 장소 유형이나 더 넓은 반경으로 검색해보세요.');
        } else {
          setError('장소 검색 중 오류가 발생했습니다: ' + status);
        }
        setPlaces([]);
      }
    });
  };

  const handleSearch = () => {
    if (location && map) {
      searchNearbyPlaces(location, map);
    } else {
      fetchLocation();
    }
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleRadiusChange = (e) => {
    setRadius(parseInt(e.target.value, 10));
  };

  const handlePlaceClick = (place) => {
    if (!map) return;
    
    // 선택한 장소로 지도 이동
    map.setCenter(place.location);
    map.setZoom(17);
    
    // 해당 마커 찾기
    const marker = markers.find(m => m && m.getTitle() === place.name);
    
    if (marker) {
      // 마커 애니메이션
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1500);
      
      // 정보창 표시
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="info-window">
            <h3>${place.name}</h3>
            <p>${place.vicinity}</p>
            ${place.rating ? `<p>평점: ${place.rating} ⭐</p>` : ''}
          </div>
        `
      });
      
      infoWindow.open(map, marker);
    }
  };

  // 장소를 즐겨찾기에 추가
  const addToFavorites = async (place) => {
    if (!user || !user.sub) {
      alert('즐겨찾기를 저장하려면 로그인이 필요합니다.');
      return;
    }

    try {
      // 이미 즐겨찾기에 있는지 확인
      const isAlreadyFavorite = favoritePlaces.some(fav => fav.placeId === place.id);
      
      if (isAlreadyFavorite) {
        alert('이미 즐겨찾기에 추가된 장소입니다.');
        return;
      }

      const placeData = {
        placeId: place.id,
        name: place.name,
        vicinity: place.vicinity,
        rating: place.rating,
        location: place.location,
        types: place.types
      };

      await saveFavoritePlace(user.sub, placeData);
      alert('즐겨찾기에 추가되었습니다.');
      
      // 즐겨찾기 목록 갱신
      loadFavoritePlaces();
    } catch (error) {
      console.error('즐겨찾기 저장 오류:', error);
      alert('즐겨찾기 저장에 실패했습니다.');
    }
  };

  // 즐겨찾기 목록 표시 토글
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <div className="location-search">
      <h2>내 주변 장소 찾기</h2>
      
      <div className="search-controls">
        <div className="control-group">
          <label htmlFor="placeType">장소 유형:</label>
          <select 
            id="placeType" 
            value={selectedType} 
            onChange={handleTypeChange}
          >
            <option value="restaurant">식당</option>
            <option value="cafe">카페</option>
            <option value="bar">술집</option>
            <option value="convenience_store">편의점</option>
            <option value="shopping_mall">쇼핑몰</option>
            <option value="movie_theater">영화관</option>
            <option value="park">공원</option>
            <option value="subway_station">지하철역</option>
            <option value="bus_station">버스정류장</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="searchRadius">검색 반경:</label>
          <select 
            id="searchRadius" 
            value={radius} 
            onChange={handleRadiusChange}
          >
            <option value="300">300m</option>
            <option value="500">500m</option>
            <option value="1000">1km</option>
            <option value="2000">2km</option>
            <option value="5000">5km</option>
          </select>
        </div>
        
        <button 
          onClick={handleSearch}
          className="search-button"
          disabled={loading}
        >
          {loading ? '검색 중...' : '검색하기'}
        </button>
        
        {location && (
          <button 
            onClick={() => {
              if (map && location) {
                map.setCenter(location);
                map.setZoom(15);
              }
            }}
            className="return-button"
          >
            현재 위치로 돌아가기
          </button>
        )}
        
        {user && (
          <button 
            onClick={toggleFavorites}
            className="favorites-button"
          >
            {showFavorites ? '검색 결과 보기' : '즐겨찾기 보기'}
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="map-container">
        <div ref={mapRef} className="map"></div>
      </div>

      {showFavorites ? (
        <div className="places-list favorites-list">
          <h3>즐겨찾기 ({favoritePlaces.length}개)</h3>
          {favoritePlaces.length > 0 ? (
            <ul>
              {favoritePlaces.map(place => (
                <li key={place.id} className="place-item" onClick={() => handlePlaceClick(place)}>
                  <h4>{place.name}</h4>
                  <p>주소: {place.vicinity}</p>
                  {place.rating ? <p>평점: {place.rating} ⭐</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>저장된 즐겨찾기가 없습니다.</p>
          )}
        </div>
      ) : (
        places.length > 0 ? (
          <div className="places-list">
            <h3>검색 결과 ({places.length}개)</h3>
            <ul>
              {places.map(place => (
                <li key={place.id} className="place-item">
                  <div onClick={() => handlePlaceClick(place)}>
                    <h4>{place.name}</h4>
                    <p>주소: {place.vicinity}</p>
                    {place.rating ? <p>평점: {place.rating} ⭐</p> : null}
                  </div>
                  {user && (
                    <button 
                      className="favorite-button"
                      onClick={() => addToFavorites(place)}
                    >
                      즐겨찾기
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : location && !loading && !error ? (
          <div className="no-results">
            <p>검색 결과가 없습니다. 다른 장소 유형이나 더 넓은 반경으로 검색해보세요.</p>
          </div>
        ) : null
      )}
    </div>
  );
};

export default LocationSearch;
