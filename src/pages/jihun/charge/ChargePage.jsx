import React, { useState } from 'react';
import ChargeLayout from '../../../components/layout/jihun/charge/ChargeLayout';
import ChargeCalculator from '../../../components/feature/jihun/charge/ChargeCalculator';
import PaymentAmountForm from '../../../components/forms/jihun/charge/PaymentAmountForm';
import BalanceDisplay from '../../../components/ui/jihun/charge/BalanceDisplay';
import PaymentDetails from '../../../components/ui/jihun/charge/PaymentDetails';
import PaymentButton from '../../../components/ui/jihun/charge/PaymentButton';
import { useLocation, useNavigate } from 'react-router-dom';

const ChargePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userCurrentPoint = location.state?.userCurrentPoint || 0;
  const fromPayment = location.state?.fromPayment || false;
  const requiredAmount = location.state?.requiredAmount || 0;
  const paymentData = location.state?.paymentData || null;
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
      
      // 분기 처리: 결제 페이지에서 왔는지 확인
      if (fromPayment && paymentData) {
        // 결제 금액 부족으로 온 경우 - 결제 페이지로 돌아가기
        setTimeout(() => {
          navigate('/payment', {
            state: {
              paymentData: paymentData
            }
          });
        }, 2000);
      } else {
        // 일반 충전인 경우 - 메인 페이지나 다른 페이지로 이동
        setTimeout(() => {
          navigate('/main'); // 또는 적절한 페이지로 이동
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChargeLayout>
      {/* 결제 페이지에서 왔을 때 안내 메시지 */}
      {fromPayment && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <strong>결제를 위해 충전이 필요합니다</strong><br />
          필요한 CM: {requiredAmount.toLocaleString()} CM<br />
          현재 보유 CM: {userCurrentPoint.toLocaleString()} CM<br />
          부족한 CM: {(requiredAmount - userCurrentPoint).toLocaleString()} CM
        </div>
      )}
      
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