import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPayment } from '../../../api/auth/JihunAuth';

const ChargeResult = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = params.get('amount');
    const failMessage = params.get('message');
    if (failMessage.includes("취소하였습니다")) {
      return navigate('/charge');
    }
    const handleConfirm = async () => {
      try {
        const response = await confirmPayment(paymentKey, orderId, amount);
        if (response.data.success) {
          alert(`✅ 결제 성공!\n주문번호: ${orderId}\n결제금액: ${amount}원`);
          navigate('/main'); // 홈으로 이동
        }
      } catch (error) {
        alert(`❌ 결제 실패!\n사유: ${failMessage || '결제 중단됨'}`);
        navigate('/main');
      }
    }
    handleConfirm();
  }, [])
  return null; // 페이지 자체는 아무것도 안 보여줘도 됨
};

export default ChargeResult;
