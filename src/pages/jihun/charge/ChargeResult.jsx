import React from 'react';
import { useToast } from '../../../context/jungeun/ToastContext';

const ChargeResult = ({ orderId, amount, success, failMessage }) => {
  const { toast } = useToast();

  React.useEffect(() => {
    if (success) {
      toast.success(`✅ 결제 성공!\n주문번호: ${orderId}\n결제금액: ${amount}원`);
    } else {
      toast.error(`❌ 결제 실패!\n사유: ${failMessage || '결제 중단됨'}`);
    }
  }, [success, orderId, amount, failMessage, toast]);

  return (
    <div className="charge-result">
      <h2>결제 결과</h2>
      {success ? (
        <div className="success">
          <p>✅ 결제가 성공적으로 완료되었습니다!</p>
          <p>주문번호: {orderId}</p>
          <p>결제금액: {amount}원</p>
        </div>
      ) : (
        <div className="error">
          <p>❌ 결제에 실패했습니다.</p>
          <p>사유: {failMessage || '결제 중단됨'}</p>
        </div>
      )}
    </div>
  );
};

export default ChargeResult;
