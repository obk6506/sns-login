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
      timeout: 15000,            // 15초 타임아웃
      maximumAge: 0              // 캐시된 위치 정보 사용하지 않음
    };

    // 위치 정보 요청 시도 횟수
    let attempts = 0;
    const maxAttempts = 3;

    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // 정확도가 너무 낮으면(값이 클수록 정확도 낮음) 다시 시도
          // 하지만 3번 시도 후에도 정확도가 낮으면 그대로 진행
          if (accuracy > 1000 && attempts < maxAttempts - 1) {
            console.log(`위치 정보 정확도가 낮습니다(${Math.round(accuracy)}m). 다시 시도 중... (${attempts + 1}/${maxAttempts})`);
            attempts++;
            setTimeout(getPosition, 2000); // 2초 후 다시 시도
            return;
          }
          
          console.log(`위치 정보 획득 완료: 위도 ${latitude}, 경도 ${longitude}, 정확도 ${Math.round(accuracy)}m`);
          
          // 위치 정보 반환
          resolve({
            lat: latitude,
            lng: longitude,
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
          
          // 기본 위치 정보 제공 (서울 시청)
          if (attempts >= maxAttempts - 1) {
            console.log('위치 정보를 가져올 수 없어 기본 위치(서울 시청)를 사용합니다.');
            resolve({
              lat: 37.5666805,
              lng: 126.9784147,
              accuracy: 1000,
              timestamp: new Date().getTime(),
              isDefault: true
            });
            return;
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    };
    
    getPosition();
  });
};
