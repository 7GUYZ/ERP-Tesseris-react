import React, { useState } from 'react';
import { useToast } from '../../../context/jungeun/ToastContext';

const ChargeCalculator = ({ onCalculate }) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');

  const handleCalculate = () => {
    const numAmount = parseInt(amount);
    
    if (numAmount < 1000) {
      toast.error('최소 결제 금액은 1,000원입니다.');
      return;
    }

    onCalculate(numAmount);
  };

  const handlePayment = () => {
    const numAmount = parseInt(amount);
    
    if (numAmount < 1000) {
      toast.error('최소 결제 금액은 1,000원입니다.');
      return;
    }

    // 결제창 열기
    try {
      // 결제 로직 구현
      window.open(`/payment?amount=${numAmount}`, '_blank', 'width=500,height=600');
    } catch (error) {
      toast.error('결제창을 열 수 없습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="charge-calculator">
      <h3>충전 금액 계산기</h3>
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="충전할 금액을 입력하세요"
          min="1000"
        />
        <button onClick={handleCalculate}>계산</button>
        <button onClick={handlePayment}>결제</button>
      </div>
    </div>
  );
};

export default ChargeCalculator; 