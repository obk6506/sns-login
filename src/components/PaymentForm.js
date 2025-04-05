import React, { useState, useEffect } from 'react';
import './PaymentForm.css';
import PaymentModal from './PaymentModal';
import { requestPayment, createPaymentData } from '../utils/payment';

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

  // 아임포트 라이브러리 로드
  useEffect(() => {
    const loadImpScript = () => {
      if (window.IMP) return;
      
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/v1/iamport.js';
      script.async = true;
      script.onload = () => {
        if (window.IMP) {
          window.IMP.init('imp57468437'); // 테스트 가맹점 식별코드
        }
      };
      document.head.appendChild(script);
    };

    loadImpScript();
  }, []);

  // 입력 필드 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value, 10) : value
    }));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone'];
    return requiredFields.every(field => orderInfo[field].toString().trim() !== '');
  };

  // 결제 처리
  const handlePayment = () => {
    if (!validateForm()) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setIsModalOpen(true);

    // 결제 데이터 생성
    const paymentData = createPaymentData(orderInfo);

    // 결제 요청
    requestPayment(paymentData, (response) => {
      setIsModalOpen(false);
      setIsLoading(false);

      if (response.success) {
        // 결제 성공
        onPaymentComplete({
          impUid: response.imp_uid,
          merchantUid: response.merchant_uid,
          amount: orderInfo.amount,
          success: true
        });
      } else {
        // 결제 실패
        alert(`결제에 실패했습니다: ${response.error_msg}`);
      }
    });
  };

  return (
    <div className="payment-form">
      <h2>결제 정보</h2>
      
      <div className="form-group">
        <label>이름 *</label>
        <input
          type="text"
          name="name"
          value={orderInfo.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>이메일 *</label>
        <input
          type="email"
          name="email"
          value={orderInfo.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>전화번호 *</label>
        <input
          type="tel"
          name="phone"
          value={orderInfo.phone}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>결제 금액 (원)</label>
        <input
          type="number"
          name="amount"
          value={orderInfo.amount}
          onChange={handleChange}
          min="1000"
          required
        />
      </div>
      
      <div className="form-group">
        <label>결제 방법</label>
        <select
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

      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="payment-modal-content">
          <h3>결제 진행 중...</h3>
          <p>결제 창이 나타나지 않으면 팝업 차단 설정을 확인해주세요.</p>
        </div>
      </PaymentModal>
    </div>
  );
};

export default PaymentForm;
