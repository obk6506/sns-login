import React from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <button className="payment-modal-close" onClick={onClose}>×</button>
        <div className="payment-modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
