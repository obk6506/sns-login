import React, { useState, useEffect } from 'react';
import { verifyPayment } from '../utils/payment';
import './PaymentComplete.css';

const PaymentComplete = ({ paymentInfo, onClose }) => {
  const [verifyStatus, setVerifyStatus] = useState('loading');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        if (!paymentInfo || !paymentInfo.impUid || !paymentInfo.merchantUid) {
          setVerifyStatus('error');
          return;
        }

        const result = await verifyPayment(paymentInfo.impUid, paymentInfo.merchantUid);
        if (result.success) {
          setVerifyStatus('success');
          setPaymentDetails(result);
        } else {
          setVerifyStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerifyStatus('error');
      }
    };

    verifyPaymentStatus();
  }, [paymentInfo]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  return (
    <div className="payment-complete">
      <h2>결제 확인</h2>
      
      {verifyStatus === 'loading' && (
        <div className="payment-status loading">
          <p>결제 정보를 확인 중입니다...</p>
        </div>
      )}
      
      {verifyStatus === 'success' && paymentDetails && (
        <div className="payment-status success">
          <div className="success-icon">✓</div>
          <h3>결제가 완료되었습니다!</h3>
          
          <div className="payment-details">
            <div className="detail-row">
              <span>상품명:</span>
              <span>{paymentDetails.name}</span>
            </div>
            <div className="detail-row">
              <span>결제 금액:</span>
              <span>{formatAmount(paymentDetails.amount)}</span>
            </div>
            <div className="detail-row">
              <span>결제 일시:</span>
              <span>{formatDate(paymentDetails.paidAt)}</span>
            </div>
            <div className="detail-row">
              <span>주문 번호:</span>
              <span>{paymentInfo.merchantUid}</span>
            </div>
          </div>
        </div>
      )}
      
      {verifyStatus === 'failed' && (
        <div className="payment-status failed">
          <div className="failed-icon">✗</div>
          <h3>결제 확인에 실패했습니다</h3>
          <p>결제가 정상적으로 처리되지 않았습니다. 다시 시도해주세요.</p>
        </div>
      )}
      
      {verifyStatus === 'error' && (
        <div className="payment-status error">
          <div className="failed-icon">!</div>
          <h3>오류가 발생했습니다</h3>
          <p>결제 정보를 확인하는 중에 오류가 발생했습니다. 나중에 다시 시도해주세요.</p>
        </div>
      )}
      
      <button className="close-button" onClick={onClose}>
        닫기
      </button>
    </div>
  );
};

export default PaymentComplete;
