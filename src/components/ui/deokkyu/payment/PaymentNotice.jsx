import React from 'react';
import '../../../../styles/deokkyu/payment/PaymentNotice.css';

const PaymentNotice = () => {
  return (
    <div className="payment-notice-section">
      <h2 className="section-title">주의사항</h2>
      
      <div className="notice-list">
        <div className="notice-item">
          <span className="notice-number">1.</span>
          <span>가맹비는 환불되지 않습니다.</span>
        </div>
        <div className="notice-item">
          <span className="notice-number">2.</span>
          <span>결제 완료 후 가맹점 심사가 진행됩니다.</span>
        </div>
        <div className="notice-item">
          <span className="notice-number">3.</span>
          <span>심사 결과는 3-5일 내에 연락드립니다.</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentNotice; 