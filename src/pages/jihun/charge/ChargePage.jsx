import React, { useState } from 'react';
import ChargeLayout from '../../../components/layout/jihun/charge/ChargeLayout';
import ChargeCalculator from '../../../components/feature/jihun/charge/ChargeCalculator';
import PaymentAmountForm from '../../../components/forms/jihun/charge/PaymentAmountForm';
import BalanceDisplay from '../../../components/ui/jihun/charge/BalanceDisplay';
import PaymentDetails from '../../../components/ui/jihun/charge/PaymentDetails';
import PaymentButton from '../../../components/ui/jihun/charge/PaymentButton';
import { useLocation, useParams } from 'react-router-dom';

const ChargePage = () => {
  const { source } = useParams();
  const userCurrentPoint = useLocation().state?.userCurrentPoint || 0;
  const [loading, setLoading] = useState(false);
  
  const {
    paymentAmount,
    setPaymentAmount,
    currentBalance,
    totalPayment,
    cmToCharge,
    newBalance,
    cmRate,
    handleCardPayment
  } = ChargeCalculator(userCurrentPoint);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await handleCardPayment();
      
      // 팝업으로 열렸는지 확인
      const isPopup = window.opener && window.opener !== window;
      
      if (isPopup) {
        // 팝업으로 열린 경우: 부모 페이지 새로고침 후 팝업 닫기
        setTimeout(() => {
          window.opener.location.reload(); // 부모 페이지 새로고침
          window.close(); // 팝업 닫기
        }, 2000); // 2초 후 실행
      } else {
        // 일반 페이지로 열린 경우: source에 따라 페이지 이동
        if (source === 'payment' || source === 'user') {
          setTimeout(() => {
            window.location.href = '/payment';
          }, 2000); // 2초 후 이동
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChargeLayout>
      <BalanceDisplay 
        label="현재 보유중인 CM" 
        balance={currentBalance} 
      />
      
      <PaymentAmountForm 
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
      />
      
      <PaymentDetails 
        totalPayment={totalPayment}
        cmToCharge={cmToCharge}
        cmRate={cmRate}
      />
      
      <BalanceDisplay 
        label="충전 후 CM" 
        balance={newBalance} 
      />
      <div id="payment-widget"></div>
      <PaymentButton 
        onClick={handlePayment}
        disabled={!paymentAmount || parseFloat(paymentAmount) < 1000}
        loading={loading}
      />
    </ChargeLayout>
  );
};

export default ChargePage; 