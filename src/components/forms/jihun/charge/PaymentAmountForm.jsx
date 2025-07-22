import React from 'react';
import '../../../../styles/jihun/charge/PaymentAmountForm.css';

const PaymentAmountForm = ({ paymentAmount, setPaymentAmount }) => {
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    // 숫자만 입력 가능하도록
    if (value === '' || /^\d+$/.test(value)) {
      setPaymentAmount(value);
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return '';
    return parseInt(amount).toLocaleString();
  };

  return (
    <div className="payment-amount-form">
      <div className="payment-amount-label">
        결제할 금액
      </div>
      <div className="payment-amount-input-container">
        <input
          type="text"
          className="payment-amount-input"
          value={formatAmount(paymentAmount)}
          onChange={handleAmountChange}
          placeholder="0"
        />
        <span className="payment-amount-unit">원</span>
      </div>
      <div className="payment-amount-validation">
        * 최소 결제 금액은 1,000원 입니다.
      </div>
    </div>
  );
};

export default PaymentAmountForm; 