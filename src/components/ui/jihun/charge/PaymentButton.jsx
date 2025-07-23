import React from 'react';
import '../../../../styles/jihun/charge/PaymentButton.css';

const PaymentButton = ({ onClick, disabled = false, loading = false }) => {
  return (
    <button 
      className={`payment-button ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="payment-button-loading">
          <div className="spinner"></div>
          <span>처리중...</span>
        </div>
      ) : (
        '결제하기'
      )}
    </button>
  );
};

export default PaymentButton; 