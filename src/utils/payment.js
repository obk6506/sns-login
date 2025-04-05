// src/utils/payment.js
import axios from 'axios';

// 아임포트 결제 검증 함수 (실제 서버 연동 없이 간단히 구현)
export const verifyPayment = async (impUid, merchantUid) => {
  // 실제 환경에서는 서버 API를 호출하여 결제를 검증해야 합니다.
  // 여기서는 테스트를 위해 항상 성공으로 처리합니다.
  return {
    success: true,
    amount: 10000,
    name: '테스트 상품',
    paidAt: new Date().toISOString()
  };
};

// 결제 요청 함수
export const requestPayment = (paymentData, callback) => {
  const { IMP } = window;
  if (!IMP) {
    alert('결제 모듈을 불러오는데 실패했습니다.');
    return;
  }

  // 아임포트 결제 요청
  IMP.request_pay(paymentData, callback);
};

// 결제 정보 생성 함수
export const createPaymentData = (orderInfo) => {
  return {
    pg: 'html5_inicis.INIpayTest',  // KG이니시스 테스트 모드
    pay_method: orderInfo.paymentMethod || 'card',
    merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
    name: '테스트 상품',
    amount: orderInfo.amount || 10000,
    buyer_email: orderInfo.email || '',
    buyer_name: orderInfo.name || '',
    buyer_tel: orderInfo.phone || '',
    m_redirect_url: window.location.origin + '/payment-complete'  // 모바일 환경에서 필요
  };
};
