import React from 'react';
import '../../../../styles/jihun/charge/PaymentDetails.css';

const PaymentDetails = ({ totalPayment, cmToCharge, cmRate }) => {
  return (
    <div className="payment-details">
      <div className="payment-detail-item">
        <span className="payment-detail-label">VAT포함 실제 결제금액</span>
        <span className="payment-detail-value">
          {totalPayment ? `${totalPayment.toLocaleString()} 원 (부가세 포함)` : '0 원 (부가세 포함)'}
        </span>
      </div>
      
      <div className="payment-detail-item">
        <span className="payment-detail-label">충전할 CM</span>
        <span className="payment-detail-value">
          {cmToCharge ? `${cmToCharge.toLocaleString()} CM` : '0 CM'}
        </span>
      </div>
      
      <div className="payment-detail-rate">
        *CM 적용율 {cmRate} 배
      </div>
    </div>
  );
};

export default PaymentDetails; 