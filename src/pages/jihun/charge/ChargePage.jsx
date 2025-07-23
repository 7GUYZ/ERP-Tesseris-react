import React, { useState } from 'react';
import ChargeLayout from '../../../components/layout/jihun/charge/ChargeLayout';
import ChargeCalculator from '../../../components/features/jihun/charge/ChargeCalculator';
import PaymentAmountForm from '../../../components/forms/jihun/charge/PaymentAmountForm';
import BalanceDisplay from '../../../components/ui/jihun/charge/BalanceDisplay';
import PaymentDetails from '../../../components/ui/jihun/charge/PaymentDetails';
import PaymentButton from '../../../components/ui/jihun/charge/PaymentButton';

const ChargePage = () => {
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
  } = ChargeCalculator();

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