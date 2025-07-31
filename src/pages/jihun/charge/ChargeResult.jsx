import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPayment } from '../../../api/auth/JihunAuth';
import { useToast } from '../../../context/jungeun/ToastContext';

const ChargeResult = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  useEffect(() => {
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = params.get('amount');
    const failMessage = params.get('message');
    if (typeof failMessage === 'string' && failMessage.includes("취소하였습니다")) {
      return navigate(`/charge/${params.get('source')}`);
    }
    const handleConfirm = async () => {
      try {
        const response = await confirmPayment(paymentKey, orderId, amount, params.get('source'));
        if (response.data.success) {
          switch (params.get('source')) {
            case 'onlinepayment':
              // PaymentPage에서 온 경우 state 정보 복원
              const paymentData = localStorage.getItem('payment-data');
              if (paymentData) {
                try {
                  const parsedData = JSON.parse(paymentData);
                  // 결제 성공 시에만 state 전달하고 삭제
                  if (response.data.success) {
                    navigate('/payment', { state: parsedData });
                    localStorage.removeItem('payment-data'); // 성공 시에만 삭제
                  } else {
                    // 결제 실패 시 삭제하지 않고 그대로 둠 (재시도 가능)
                    navigate('/payment');
                  }
                } catch (error) {
                  console.error('Payment data 파싱 오류:', error);
                  navigate('/payment');
                }
              } else {
                navigate('/payment');
              }
              break;
            case 'user':
              showToast('success', `✅ 결제 성공!\n주문번호: ${orderId}\n결제금액: ${amount}원`);
              navigate('/main');
              break;
          }
        }
      } catch (error) {
        showToast('error', `❌ 결제 실패!\n사유: ${failMessage || '결제 중단됨'}`);
        navigate('/main');
      }
    }
    handleConfirm();
  }, [])
  return null; // 페이지 자체는 아무것도 안 보여줘도 됨
};

export default ChargeResult;