import React from 'react';
import '../../../../styles/deokkyu/payment/PaymentLayout.css';

const PaymentLayout = ({ children }) => {
  return (
    <div className="payment-layout">
      <div className="payment-container">
        <div className="payment-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PaymentLayout; 