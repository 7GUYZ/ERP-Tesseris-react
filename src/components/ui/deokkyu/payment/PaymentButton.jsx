import React from 'react';
import CustomButton from '../Deoktton';
import '../../../../styles/deokkyu/payment/PaymentButton.css';

const PaymentButton = ({ 
  onClick, 
  disabled, 
  loading, 
  franchiseFee 
}) => {
  return (
    <div className="payment-button-container">
      <CustomButton 
        onClick={onClick} 
        disabled={disabled}
        className={loading ? 'loading' : ''}
      >
        {loading ? '결제 처리 중...' : `${franchiseFee.toLocaleString()}원 결제하기`}
      </CustomButton>
    </div>
  );
};

export default PaymentButton; 