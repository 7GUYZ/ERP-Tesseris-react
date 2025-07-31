import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentApi } from '../../api/auth/TaekjunAuth';
import StoreSelectionModal from '../../components/ui/taekjun/StoreSelectionModal';
import CouponSelectionModal from '../../components/ui/taekjun/CouponSelectionModal';
import PinCodeModal from '../../components/ui/taekjun/PinCodeModal';
import '../../styles/taekjun/PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      // 외부 결제 요청인지 확인
      const urlParams = new URLSearchParams(window.location.search);
      const isExternalPayment = urlParams.get('external') === 'true';
      
      if (isExternalPayment) {
        // 외부 결제 요청인 경우 결제 정보를 localStorage에 저장하고 로그인 페이지로 이동
        const externalPaymentData = {
          external: true,
          amount: urlParams.get('amount'),
          orderId: urlParams.get('orderId'),
          returnUrl: urlParams.get('returnUrl'),
          timestamp: Date.now()
        };
        
        localStorage.setItem('external-payment-data', JSON.stringify(externalPaymentData));
        console.log('외부 결제 요청 감지, 로그인 페이지로 이동');
        navigate('/login');
        return;
      } else {
        setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      }
    }
  }, [navigate]);
  
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
  
  // 충전 페이지에서 돌아온 경우 결제 정보 복원
  useEffect(() => {
    const paymentData = location.state?.paymentData;
    const fromExternal = location.state?.fromExternal;
    
    if (paymentData) {
      setAmount(paymentData.amount || '');
      setSelectedStore(paymentData.selectedStore || null);
      setSelectedCoupons(paymentData.selectedCoupons || []);
      setPinCode(paymentData.pinCode || '');
      
      if (fromExternal) {
        console.log('외부 결제 정보 복원됨:', paymentData);
        // 외부 결제인 경우 성공 메시지 표시
        setSuccess('외부 결제 요청이 복원되었습니다. 결제를 진행해주세요.');
      } else {
        console.log('충전 후 결제 정보 복원됨:', paymentData);
        // 결제 정보 복원 후 localStorage 정리 (성공적으로 복원된 경우)
        localStorage.removeItem('payment-data');
      }
    }
  }, [location.state]);
  
  // 가맹점 선택
  const handleStoreSelect = async (store) => {
    setSelectedStore(store);
    setSelectedCoupons([]); // 가맹점 변경 시 선택된 쿠폰 초기화
    
    // 선택된 가맹점의 쿠폰만 조회
    if (userIndex && store.userIndex) {
      try {
        const response = await paymentApi.getStoreCoupons(userIndex, store.userIndex);
        if (response.data.resultCode === 200) {
          setCoupons(response.data.data);
        } else {
          console.error('가맹점 쿠폰 조회 실패:', response.data.resultMessage);
          setCoupons([]);
        }
      } catch (err) {
        console.error('가맹점 쿠폰 조회 오류:', err);
        setCoupons([]);
      }
    }
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
    return Math.max(0, inputAmount - couponTotal); // 쿠폰 할인이므로 빼기
  };

  // 실제 차감되는 CM 금액 계산 (결제 금액 - 쿠폰 금액)
  const calculateActualCmAmount = () => {
    const inputAmount = parseInt(amount) || 0;
    const couponTotal = selectedCoupons.reduce((sum, coupon) => sum + coupon.couponPrice, 0);
    return Math.max(0, inputAmount - couponTotal); // 음수가 되지 않도록
  };

  // 쿠폰 총 금액 계산
  const calculateCouponTotal = () => {
    return selectedCoupons.reduce((sum, coupon) => sum + coupon.couponPrice, 0);
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
        const actualCmAmount = calculateActualCmAmount();
        const couponTotal = calculateCouponTotal();
        
        const request = {
          targetUserIndex: selectedStore.userIndex,
          amount: parseInt(amount), // 가맹점이 받는 금액 (원래 결제 금액)
          actualCmAmount: actualCmAmount, // 실제 차감되는 CM 금액
          couponIndexes: selectedCoupons.map(c => c.couponIndex),
          couponTotal: couponTotal, // 쿠폰 총 금액
          pinCode: pinCodeToUse
        };
        
        console.log('결제 요청 데이터:', request);
      
      const response = await paymentApi.processPayment(request, userIndex);
      
      if (response.data.resultCode === 200 && response.data.data.success) {
        const successMessage = `결제가 성공적으로 완료되었습니다.\n\n내 CM 차감: ${actualCmAmount.toLocaleString()} CM\n쿠폰 사용: ${couponTotal.toLocaleString()} CM\n가맹점 입금: ${parseInt(amount).toLocaleString()} CM`;
        setSuccess(successMessage);
        
        // 3초 후 main 페이지로 이동
        setTimeout(() => {
          navigate('/main');
        }, 3000);
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
    const finalAmount = calculateFinalAmount();
    const currentCm = paymentInfo?.currentCm || 0;
    console.log('CM 잔액 확인:', { finalAmount, currentCm, isInsufficient: finalAmount > currentCm });
    
    if (finalAmount > currentCm) {
      console.log('CM 부족 감지 - 충전 페이지로 이동');
      setError('보유 CM이 부족합니다. 충전 페이지로 이동합니다.');
      // 충전 페이지로 이동 - 현재 결제 정보와 함께
      setTimeout(() => {
        console.log('충전 페이지로 이동 실행');
        
        // PaymentPage state 정보를 localStorage에 저장
        const paymentState = {
          fromPayment: true,
          requiredAmount: finalAmount,
          paymentData: {
            amount: amount,
            selectedStore: selectedStore,
            selectedCoupons: selectedCoupons,
            pinCode: pinCode
          }
        };
        localStorage.setItem('payment-data', JSON.stringify(paymentState));
        
        navigate('/charge/onlinepayment', {
          state: paymentState
        });
      }, 1000);
      return;
    }
    
    // 실제 결제 실행
    await executePayment(pinCode);
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };

  if (!userIndex) {
    return <div className="payment-page">사용자 정보를 불러오는 중...</div>;
  }
  
  return (
    <div className="payment-page-main">
      <div className="payment-page-container">
        {/* 헤더 */}
        <div className="payment-page-header">
          <div className="payment-page-back" onClick={handleBackClick}>
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
                onClick={() => {
                  if (!selectedStore) {
                    alert('먼저 가맹점을 선택해주세요.');
                    return;
                  }
                  setCouponModalOpen(true);
                }}
                className="payment-page-select-button"
                disabled={!selectedStore}
              >
                {selectedStore ? '쿠폰 선택하기' : '가맹점을 먼저 선택해주세요'}
              </button>
            </div>
            
            {/* 선택된 쿠폰 목록 */}
            {selectedCoupons.length > 0 && (
              <div className="payment-page-selected-coupons">
                {selectedCoupons.map(coupon => (
                  <div key={coupon.couponIndex} className="payment-page-selected-coupon">
                    <div className="payment-page-coupon-header">
                      <span className="payment-page-coupon-name">{coupon.couponName}</span>
                      <span className="payment-page-coupon-price">{coupon.couponPrice.toLocaleString()} CM</span>
                    </div>
                    <div className="payment-page-coupon-body">
                      <div className="payment-page-coupon-info">
                        <p className="payment-page-coupon-amount">{coupon.couponPrice.toLocaleString()} CM 할인</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleCouponRemove(coupon.couponIndex)}
                        className="payment-page-remove-button"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 최종 금액 */}
          <div className="payment-page-final-amount">
            <p>최종 결제 금액: <span>{calculateFinalAmount().toLocaleString()}</span> CM</p>
            {selectedCoupons.length > 0 && (
              <div className="payment-page-amount-breakdown">
                <p>내 CM 차감: <span>{calculateActualCmAmount().toLocaleString()}</span> CM</p>
                <p>쿠폰 사용: <span>{calculateCouponTotal().toLocaleString()}</span> CM</p>
              </div>
            )}
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
          storeUserIndex={selectedStore?.userIndex}
          paymentAmount={parseInt(amount) || 0}
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