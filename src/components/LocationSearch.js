import React, { useState, useEffect, useRef } from 'react';
import { getCurrentLocation } from '../utils/location';
import { saveFavoritePlace, getUserFavoritePlaces } from '../firebase/firestore';
import './LocationSearch.css';

const LocationSearch = ({ user }) => {
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
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setGoogleMapsLoaded(true);
        setError(null);
      } else {
        setTimeout(checkGoogleMapsLoaded, 1000);
      }
    };

    checkGoogleMapsLoaded();

    return () => {
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
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      if (googleMapsLoaded) {
        initMap(currentLocation);
      } else {
        setLoading(false);
        setError('Google Maps API가 로드되지 않았습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const initMap = (location) => {
    if (!window.google || !window.google.maps) {
      setError('Google Maps API가 로드되지 않았습니다.');
      setLoading(false);
      return;
    }

    try {
      const mapOptions = {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);

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

      setMap(newMap);

      newMap.addListener('tilesloaded', () => {
        if (!places.length) {
          searchNearbyPlaces(location, newMap);
        }
      });

    } catch (error) {
      setError('지도를 초기화하는 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
  };

  const searchNearbyPlaces = (location, mapInstance = null) => {
    const mapToUse = mapInstance || map;

    if (!window.google || !window.google.maps || !window.google.maps.places || !mapToUse) {
      setError('Google Maps API가 로드되지 않았습니다.');
      setLoading(false);
      return;
    }

    try {
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

      if (searchKeyword && searchKeyword.trim() !== '') {
        request.keyword = searchKeyword.trim();
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: location.latitude, lng: location.longitude } },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            const addressComponents = results[0].address_components;
            const dongComponent = addressComponents.find(
              component => component.types.includes('sublocality_level_2') || 
                          component.types.includes('sublocality')
            );

            if (dongComponent) {
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
        setLoading(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
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

          const newMarkers = placesData.map(place => {
            try {
              const marker = new window.google.maps.Marker({
                position: { lat: place.location.lat, lng: place.location.lng },
                map: mapToUse,
                title: place.name,
                animation: window.google.maps.Animation.DROP
              });

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
              return null;
            }
          }).filter(marker => marker !== null);

          setMarkers(newMarkers);

        } else {
          if (status === 'ZERO_RESULTS') {
            setError('검색 결과가 없습니다. 다른 장소 유형이나 더 넓은 반경으로 검색해보세요.');
          } else {
            setError('주변 장소를 찾을 수 없습니다. 상태: ' + status);
          }
          setPlaces([]);
        }
      });
    } catch (error) {
      setError('장소 검색 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
  };

  const handlePlaceTypeChange = (e) => {
    setPlaceType(e.target.value);
  };

  const handleRadiusChange = (e) => {
    setSearchRadius(parseInt(e.target.value, 10));
  };

  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = () => {
    if (location && map) {
      setLoading(true);
      searchNearbyPlaces(location);
    } else if (location && !map) {
      setLoading(true);
      initMap(location);
    }
  };

  const handlePlaceClick = (place) => {
    if (map) {
      map.setCenter({ lat: place.location.lat, lng: place.location.lng });
      map.setZoom(17);

      const marker = markers.find(m => m && m.getTitle() === place.name);
      if (marker) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1500);

        window.google.maps.event.trigger(marker, 'click');
      }
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
