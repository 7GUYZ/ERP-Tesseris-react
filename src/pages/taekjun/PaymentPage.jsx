import React, { useState, useEffect, useCallback } from 'react';
import { paymentApi } from '../../api/auth/TaekjunAuth';
import StoreSelectionModal from '../../components/ui/taekjun/StoreSelectionModal';
import CouponSelectionModal from '../../components/ui/taekjun/CouponSelectionModal';
import PinCodeModal from '../../components/ui/taekjun/PinCodeModal';
import '../../styles/taekjun/PaymentPage.css';

const PaymentPage = () => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [stores, setStores] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 폼 상태
  const [selectedStore, setSelectedStore] = useState(null);
  const [amount, setAmount] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [pinCode, setPinCode] = useState('');
  
  // 모달 상태
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  
  // 현재 사용자 정보
  const [userIndex, setUserIndex] = useState(null);
  
  // 페이지 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const userInfo = localStorage.getItem('user-info');
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        setUserIndex(userData.user_index);
      } catch (err) {
        console.error('사용자 정보 파싱 오류:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      }
    } else {
      setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
    }
  }, []);
  
  // 결제 정보 조회
  const fetchPaymentInfo = useCallback(async () => {
    if (!userIndex) return;
    
    try {
      const response = await paymentApi.getPaymentInfo(userIndex);
      if (response.data.resultCode === 200) {
        setPaymentInfo(response.data.data);
      }
    } catch (err) {
      console.error('결제 정보 조회 오류:', err);
    }
  }, [userIndex]);
  
  // 초기 데이터 로드
  useEffect(() => {
    if (userIndex) {
      fetchPaymentInfo();
    }
  }, [userIndex, fetchPaymentInfo]);
  
  // 가맹점 선택
  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };
  
  // 쿠폰 선택
  const handleCouponSelect = (coupon) => {
    setSelectedCoupons(prev => {
      const isSelected = prev.some(c => c.couponIndex === coupon.couponIndex);
      if (isSelected) {
        return prev.filter(c => c.couponIndex !== coupon.couponIndex);
      } else {
        return [...prev, { 
          couponIndex: coupon.couponIndex, 
          couponPrice: coupon.couponPrice,
          couponName: coupon.couponName 
        }];
      }
    });
  };
  
  // 쿠폰 제거
  const handleCouponRemove = (couponIndex) => {
    setSelectedCoupons(prev => prev.filter(c => c.couponIndex !== couponIndex));
  };
  
  // 최종 결제 금액 계산
  const calculateFinalAmount = () => {
    const inputAmount = parseInt(amount) || 0;
    const couponTotal = selectedCoupons.reduce((sum, coupon) => sum + coupon.couponPrice, 0);
    return inputAmount + couponTotal;
  };
  
  // 핀번호 확인 처리
  const handlePinConfirm = (enteredPinCode) => {
    setPinCode(enteredPinCode);
    // 핀번호만 설정하고 모달 닫기
  };
  
  // 실제 결제 실행
  const executePayment = async (pinCodeToUse) => {
    if (!selectedStore || !amount) {
      setError('가맹점과 결제 금액을 선택해주세요.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const request = {
        targetUserIndex: selectedStore.userIndex,
        amount: parseInt(amount),
        couponIndexes: selectedCoupons.map(c => c.couponIndex),
        pinCode: pinCodeToUse
      };
      
      const response = await paymentApi.processPayment(request, userIndex);
      
      if (response.data.resultCode === 200 && response.data.data.success) {
        setSuccess(`결제가 성공적으로 완료되었습니다. (내 CM ${calculateFinalAmount().toLocaleString()} 차감, 가맹점 ${calculateFinalAmount().toLocaleString()} 입금)`);
        // 폼 초기화
        setSelectedStore(null);
        setAmount('');
        setSelectedCoupons([]);
        setPinCode('');
        // 결제 정보 새로고침
        fetchPaymentInfo();
      } else {
        // 핀번호 관련 오류 메시지 강조
        const errorMessage = response.data.resultMessage || '결제에 실패했습니다.';
        if (errorMessage.includes('핀번호')) {
          setError(`❌ ${errorMessage}`);
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error('결제 실행 오류:', err);
      // API 응답에서 핀번호 오류 메시지 확인
      if (err.response && err.response.data && err.response.data.resultMessage) {
        const errorMessage = err.response.data.resultMessage;
        if (errorMessage.includes('핀번호')) {
          setError(`❌ ${errorMessage}`);
        } else {
          setError(errorMessage);
        }
      } else {
        setError('결제 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 충전 페이지를 팝업으로 열기
  const openChargePopup = () => {
    const insufficientAmount = calculateFinalAmount() - (paymentInfo?.currentCm || 0);
    const message = `보유 CM이 부족합니다.\n\n필요한 CM: ${calculateFinalAmount().toLocaleString()} CM\n보유 CM: ${paymentInfo?.currentCm.toLocaleString() || 0} CM\n부족한 CM: ${insufficientAmount.toLocaleString()} CM\n\n충전 페이지를 팝업으로 열까요?`;
    
    if (window.confirm(message)) {
      // 충전 페이지를 팝업으로 열기
      const popup = window.open('/charge/user', 'chargePopup', 'width=500,height=700,scrollbars=yes,resizable=yes');
      
      // 팝업이 차단되었는지 확인
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
        // 팝업이 차단된 경우 새 탭으로 열기
        window.open('/charge/user', '_blank');
      }
    }
  };

  // 결제 실행
  const handlePayment = async () => {
    if (!selectedStore || !amount) {
      setError('가맹점과 결제 금액을 선택해주세요.');
      return;
    }
    
    if (!pinCode) {
      setError('핀번호를 입력해주세요.');
      return;
    }

    // CM 잔액 확인
    if (paymentInfo && calculateFinalAmount() > paymentInfo.currentCm) {
      setError('보유 CM이 부족합니다.');
      // 3초 후 자동으로 충전 팝업 열기
      setTimeout(() => {
        openChargePopup();
      }, 3000);
      return;
    }
    
    // 실제 결제 실행
    await executePayment(pinCode);
  };
  
  if (!userIndex) {
    return <div className="payment-page">사용자 정보를 불러오는 중...</div>;
  }
  
  return (
    <div className="payment-page-main">
      <div className="payment-page-container">
        {/* 헤더 */}
        <div className="payment-page-header">
          <div className="payment-page-back">
            <span className="payment-page-arrow">←</span>
          </div>
          <h1 className="payment-page-title">결제</h1>
        </div>
        
        {/* 결제 정보 */}
        {paymentInfo && (
          <div className="payment-page-info">
            <div className="payment-page-info-item">
              <span className="payment-page-info-label">월 결제한도:</span>
              <span className="payment-page-info-value">{paymentInfo.monthlyLimit.toLocaleString()} CM</span>
            </div>
            <div className="payment-page-info-item">
              <span className="payment-page-info-label">{paymentInfo.currentMonth} 사용 금액:</span>
              <span className="payment-page-info-value">{paymentInfo.monthlyUsed.toLocaleString()} CM</span>
            </div>
            <div className="payment-page-info-item">
              <span className="payment-page-info-label">보유 CM:</span>
              <span className="payment-page-info-value">{paymentInfo.currentCm.toLocaleString()} CM</span>
            </div>
          </div>
        )}
        
        {/* 결제 폼 */}
        <form className="payment-page-form" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
          {/* 가맹점 선택 */}
          <div className="payment-page-form-group">
            <label>가맹점 선택</label>
            <div className="payment-page-selection-container">
              {selectedStore ? (
                <div className="payment-page-selected-item">
                  <span className="payment-page-selected-text">{selectedStore.storeName}</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedStore(null)}
                    className="payment-page-remove-button"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setStoreModalOpen(true)}
                  className="payment-page-select-button"
                >
                  가맹점 선택하기
                </button>
              )}
            </div>
          </div>
          
          {/* 결제 금액 */}
          <div className="payment-page-form-group">
            <label>결제 금액 (CM)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="결제 금액을 입력하세요"
              required
              className="payment-page-form-input"
              min="1"
            />
          </div>
          
          {/* 쿠폰 선택 */}
          <div className="payment-page-form-group">
            <label>쿠폰 선택</label>
            <div className="payment-page-selection-container">
              <button 
                type="button" 
                onClick={() => setCouponModalOpen(true)}
                className="payment-page-select-button"
              >
                쿠폰 선택하기
              </button>
            </div>
            
            {/* 선택된 쿠폰 목록 */}
            {selectedCoupons.length > 0 && (
              <div className="payment-page-selected-coupons">
                {selectedCoupons.map(coupon => (
                  <div key={coupon.couponIndex} className="payment-page-selected-coupon">
                    <span className="payment-page-coupon-name">{coupon.couponName}</span>
                    <span className="payment-page-coupon-price">{coupon.couponPrice.toLocaleString()} CM</span>
                    <button 
                      type="button" 
                      onClick={() => handleCouponRemove(coupon.couponIndex)}
                      className="payment-page-remove-button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 최종 금액 */}
          <div className="payment-page-final-amount">
            <p>최종 수령 금액: <span>{calculateFinalAmount().toLocaleString()}</span> CM</p>
          </div>
          
          {/* 핀번호 표시 (읽기 전용) */}
          <div className="payment-page-form-group">
            <label>핀번호</label>
            <div className="payment-page-pin-container">
              <div className="payment-page-pin-display">
                {pinCode ? (
                  <div className="payment-page-pin-masked">
                    {'●'.repeat(pinCode.length)}
                  </div>
                ) : (
                  <div className="payment-page-pin-placeholder">
                    핀번호를 입력해주세요
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => setPinModalOpen(true)}
                className="payment-page-pin-button"
              >
                {pinCode ? '핀번호 변경' : '핀번호 확인'}
              </button>
            </div>
          </div>
          
          {/* 에러/성공 메시지 */}
          {error && <div className="payment-page-error-message">{error}</div>}
          {success && <div className="payment-page-success-message">{success}</div>}
          
          {/* 결제 버튼 */}
          <button 
            type="submit" 
            className="payment-page-button"
            disabled={loading}
          >
            {loading ? '처리 중...' : '확인'}
          </button>
        </form>
        
        {/* 모달들 */}
        <StoreSelectionModal
          isOpen={storeModalOpen}
          onClose={() => setStoreModalOpen(false)}
          onSelect={handleStoreSelect}
        />
        
        <CouponSelectionModal
          isOpen={couponModalOpen}
          onClose={() => setCouponModalOpen(false)}
          onSelect={handleCouponSelect}
          userIndex={userIndex}
        />
        
        <PinCodeModal
          isOpen={pinModalOpen}
          onClose={() => setPinModalOpen(false)}
          onConfirm={handlePinConfirm}
          title="핀번호 확인"
        />
      </div>
    </div>
  );
};

export default PaymentPage; 