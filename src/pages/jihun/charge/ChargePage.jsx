import React, { useState } from 'react';
import ChargeLayout from '../../../components/layout/jihun/charge/ChargeLayout';
import ChargeCalculator from '../../../components/feature/jihun/charge/ChargeCalculator';
import PaymentAmountForm from '../../../components/forms/jihun/charge/PaymentAmountForm';
import BalanceDisplay from '../../../components/ui/jihun/charge/BalanceDisplay';
import PaymentDetails from '../../../components/ui/jihun/charge/PaymentDetails';
import PaymentButton from '../../../components/ui/jihun/charge/PaymentButton';
import { useLocation } from 'react-router-dom';

const ChargePage = () => {
  const  userCurrentPoint  = useLocation().state?.userCurrentPoint || 0;
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChargeLayout>
      {/* 상단 섹션: 현재 보유중인 TS */}
      <div className="charge-section">
        <BalanceDisplay 
          label="현재 보유중인 TS" 
          balance={currentBalance} 
        />
      </div>
      
      {/* 중단 섹션: 결제 정보 */}
      <div className="charge-section">
        <PaymentAmountForm 
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
        />
        
        <PaymentDetails 
          totalPayment={totalPayment}
          cmToCharge={cmToCharge}
          cmRate={cmRate}
        />
      </div>
      
      {/* 하단 섹션: 충전 후 TS + 결제 버튼 */}
      <div className="charge-section">
        <BalanceDisplay 
          label="충전 후 TS" 
          balance={newBalance} 
        />
        
        <div id="payment-widget"></div>
        
        <PaymentButton 
          onClick={handlePayment}
          disabled={!paymentAmount || parseFloat(paymentAmount) < 1000}
          loading={loading}
        />
      </div>
    </ChargeLayout>
  );
};

export default ChargePage; 