import React from 'react';
import '../../../../styles/deokkyu/payment/PaymentMethodForm.css';

const PaymentMethodForm = () => {
  return (
    <div className="payment-method-section">
      <h2 className="section-title">결제 방법</h2>
      
      <div className="payment-method">
        <div className="method-item selected">
          <div className="method-icon">💳</div>
          <div className="method-info">
            <div className="method-name">신용카드</div>
            <div className="method-description">토스페이먼츠를 통한 안전한 결제</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodForm; 