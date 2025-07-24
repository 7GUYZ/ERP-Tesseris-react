import React from 'react';
import '../../../../styles/deokkyu/payment/PaymentInfoForm.css';

const PaymentInfoForm = ({ storeData, franchiseFee }) => {
  return (
    <div className="payment-info-section">
      <h2 className="section-title">결제 정보</h2>
      
      <div className="payment-info">
        <div className="info-row">
          <span className="info-label">신청자</span>
          <span className="info-value">{storeData.userInfo.name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">가게명</span>
          <span className="info-value">{storeData.storeInfo.store_name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">결제 금액</span>
          <span className="info-value amount">{franchiseFee.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoForm; 