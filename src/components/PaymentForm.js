import React, { useState, useEffect } from 'react';
import './PaymentForm.css';
import PaymentModal from './PaymentModal';
import { requestPayment, createPaymentData } from '../utils/payment';
import { savePayment } from '../firebase/firestore';

const PaymentForm = ({ user, onPaymentComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    amount: 10000,
    paymentMethod: 'card'
  });

  useEffect(() => {
    const loadImpScript = () => {
      if (window.IMP) return;
      
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/v1/iamport.js';
      script.async = true;
      script.onload = () => {
        if (window.IMP) {
          window.IMP.init('imp57468437'); // 아임포트 가맹점 식별코드
          console.log('아임포트 초기화 완료');
        }
      };
      document.head.appendChild(script);
    };

    loadImpScript();
    
    // 사용자 정보가 변경되면 주문 정보 업데이트
    if (user) {
      setOrderInfo(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value, 10) : value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone'];
    return requiredFields.every(field => orderInfo[field].toString().trim() !== '');
  };

  const handlePayment = () => {
    if (!validateForm()) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    if (!window.IMP) {
      alert('결제 모듈이 로드되지 않았습니다. 페이지를 새로고침 후 다시 시도해주세요.');
      return;
    }

    setIsLoading(true);
    setIsModalOpen(true);

    const paymentData = createPaymentData(orderInfo);
    
    // 디버깅을 위한 로그
    console.log('결제 요청 데이터:', paymentData);

    requestPayment(paymentData, async (response) => {
      setIsModalOpen(false);
      setIsLoading(false);
      
      console.log('결제 응답:', response);

      if (response.success) {
        try {
          const paymentInfo = {
            impUid: response.imp_uid,
            merchantUid: response.merchant_uid,
            amount: orderInfo.amount,
            success: true,
            paymentMethod: orderInfo.paymentMethod,
            buyerName: orderInfo.name,
            buyerEmail: orderInfo.email,
            buyerTel: orderInfo.phone
          };
          
          console.log('Firebase에 저장할 결제 정보:', paymentInfo);
          
          // Firebase에 결제 내역 저장
          if (user && user.sub) {
            try {
              await savePayment(user.sub, paymentInfo);
              console.log('결제 정보가 Firebase에 저장되었습니다.');
            } catch (saveError) {
              console.error('Firebase 결제 정보 저장 오류:', saveError);
              // 저장 실패해도 결제 완료 처리는 진행
            }
          } else {
            console.warn('사용자 정보가 없어 결제 내역을 저장할 수 없습니다.');
          }
          
          onPaymentComplete(paymentInfo);
        } catch (error) {
          console.error('결제 정보 처리 오류:', error);
          alert('결제는 성공했지만 결제 정보 저장에 실패했습니다.');
          onPaymentComplete({
            impUid: response.imp_uid,
            merchantUid: response.merchant_uid,
            amount: orderInfo.amount,
            success: true
          });
        }
      } else {
        console.error('결제 실패:', response.error_msg);
        alert(`결제에 실패했습니다: ${response.error_msg}`);
      }
    });
  };

  return (
    <div className="payment-form">
      <h2>결제 정보</h2>
      <div className="form-group">
        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          name="name"
          value={orderInfo.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          value={orderInfo.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">전화번호</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={orderInfo.phone}
          onChange={handleChange}
          placeholder="010-0000-0000"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">결제 금액</label>
        <select
          id="amount"
          name="amount"
          value={orderInfo.amount}
          onChange={handleChange}
        >
          <option value="1">1원</option>
          <option value="10000">10,000원</option>
          <option value="20000">20,000원</option>
          <option value="50000">50,000원</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="paymentMethod">결제 수단</label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={orderInfo.paymentMethod}
          onChange={handleChange}
        >
          <option value="card">신용카드</option>
          <option value="trans">실시간 계좌이체</option>
          <option value="vbank">가상계좌</option>
          <option value="phone">휴대폰 소액결제</option>
        </select>
      </div>
      <button
        className="payment-button"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? '처리 중...' : '결제하기'}
      </button>
      
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="payment-loading">
          <p>결제를 처리 중입니다...</p>
          <p>잠시만 기다려주세요.</p>
        </div>
      </PaymentModal>
    </div>
  );
};

export default PaymentForm;
