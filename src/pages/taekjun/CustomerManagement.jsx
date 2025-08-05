import React, { useState, useEffect, useCallback } from 'react';
import { customerManagementApi } from '../../api/auth/TaekjunAuth';
import PinInput from '../../components/forms/jiyun/pin-change/PinInput';
import '../../styles/taekjun/CustomerManagement.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 검색 및 필터 상태
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedMember, setSelectedMember] = useState('전체');
  
  // 선택된 고객들
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // 필터 옵션
  const memberOptions = ['전체', '일반 고객', '단골 고객', '추천 고객'];
  
  // 현재 로그인한 사용자의 storeUserIndex (로컬스토리지에서 가져옴)
  const [currentStoreUserIndex, setCurrentStoreUserIndex] = useState("");
  
  // 쿠폰 선물 모달 상태
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    couponName: '',
    couponPrice: '',
    couponLimit: '',
    pinCode: ''
  });

  // 핀번호 입력 모달 상태
  const [showPinModal, setShowPinModal] = useState(false);

  // 페이지 로드 시 로컬스토리지에서 user_index 가져오기
  useEffect(() => {
    const userInfo = localStorage.getItem('user-info');
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        const userIndex = userData.user_index;
        if (userIndex) {
          setCurrentStoreUserIndex(userIndex);
          console.log('로컬스토리지에서 가져온 user_index:', userIndex);
        } else {
          console.error('user-info에 user_index가 없습니다.');
          setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        }
      } catch (err) {
        console.error('user-info 파싱 오류:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      }
    } else {
      console.error('로컬스토리지에 user-info가 없습니다.');
      setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
    }
  }, []);

  // 고객 목록 조회
  const fetchCustomers = useCallback(async () => {
    if (!currentStoreUserIndex) {
      setError('사용자 정보가 없습니다.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const params = {
        storeUserIndex: currentStoreUserIndex
      };
      if (selectedMember !== '전체') params.member = selectedMember;
      
      // 내 가맹점 고객 목록 조회 API 사용
      const response = await customerManagementApi.getMyCustomers(params);
      
      if (response.data.success) {
        setCustomers(response.data.customers || []);
      } else {
        setError(response.data.message || '고객 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('고객 목록 조회 오류:', err);
      setError('고객 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentStoreUserIndex, selectedMember]);

  // 초기 데이터 로드 (userIndex가 있을 때만)
  useEffect(() => {
    if (currentStoreUserIndex) {
    fetchCustomers();
    }
  }, [currentStoreUserIndex, fetchCustomers]);

  // 검색 실행
  const handleSearch = () => {
    fetchCustomers();
  };

  // 전체 선택/해제
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedCustomers(customers.map(customer => customer.storeCustomerIndex));
    } else {
      setSelectedCustomers([]);
    }
  };

  // 개별 고객 선택/해제
  const handleSelectCustomer = (customerIndex, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerIndex]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerIndex));
    }
  };

  // 선택된 고객이 변경될 때 전체 선택 상태 업데이트
  useEffect(() => {
    if (customers.length > 0) {
      setSelectAll(selectedCustomers.length === customers.length);
    }
  }, [selectedCustomers, customers]);

  // 고객 상태 변경
  const handleUpdateStatus = async (status) => {
    if (selectedCustomers.length === 0) {
      setError('선택된 고객이 없습니다.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await customerManagementApi.updateCustomerStatus({
        customerIndexes: selectedCustomers,
        status: status
      });

      if (response.data.success) {
        setSuccess(`${selectedCustomers.length}명의 고객을 ${status}로 변경했습니다.`);
        setSelectedCustomers([]);
        setSelectAll(false);
        fetchCustomers(); // 목록 새로고침
      } else {
        setError(response.data.message || '고객 상태 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('고객 상태 변경 오류:', err);
      setError('고객 상태 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 쿠폰 선물 모달 열기
  const handleOpenCouponModal = () => {
    if (selectedCustomers.length === 0) {
      setError('선택된 고객이 없습니다.');
      return;
    }
    setShowCouponModal(true);
  };
  
  // 쿠폰 선물 모달 닫기
  const handleCloseCouponModal = () => {
    setShowCouponModal(false);
    setCouponForm({
      couponName: '',
      couponPrice: '',
      couponLimit: ''
    });
  };
  
  // 쿠폰 폼 입력 처리
  const handleCouponFormChange = (field, value) => {
    setCouponForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 쿠폰 선물 실행
  const handleGiftCoupon = async () => {
    if (!couponForm.couponName || !couponForm.couponPrice || !couponForm.couponLimit || !couponForm.pinCode) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    // 핀번호 형식 검증 (6자리 숫자)
    if (!/^\d{6}$/.test(couponForm.pinCode)) {
      setError('핀번호는 6자리 숫자로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await customerManagementApi.giftCoupon({
        customerIndexes: selectedCustomers,
        storeUserIndex: currentStoreUserIndex,
        couponPrice: parseInt(couponForm.couponPrice),
        couponLimit: parseInt(couponForm.couponLimit),
        couponName: couponForm.couponName,
        pinCode: couponForm.pinCode
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setSelectedCustomers([]);
        setSelectAll(false);
        handleCloseCouponModal();
        fetchCustomers(); // 목록 새로고침
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('쿠폰 선물 오류:', err);
      setError('쿠폰 선물 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 핀번호 입력 완료 핸들러
  const handlePinComplete = (pin) => {
    handleCouponFormChange('pinCode', pin);
    setShowPinModal(false);
    // 핀번호 입력 완료 후 성공 메시지 표시
    setSuccess('핀번호가 입력되었습니다.');
    setTimeout(() => {
      setSuccess('');
    }, 2000);
  };

  // 핀번호 입력 모달 열기
  const handleOpenPinModal = () => {
    setShowPinModal(true);
  };

  // 핀번호 입력 모달 닫기
  const handleClosePinModal = () => {
    setShowPinModal(false);
  };

  return (
    <div className="customer-management">
      <div className="customer-management-container">
        {/* 헤더 */}
        <div className="customer-management-header">
          <div className="header-back">
            <span className="back-arrow">←</span>
          </div>
          <h1 className="header-title">고객 관리</h1>
        </div>

        {/* 검색 및 필터 */}
        <div className="customer-search-section">
          <div className="search-input-group">
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="전화번호 뒷 4자리"
              className="search-input"
            />
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="member-filter"
            >
              {memberOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button 
              onClick={handleSearch}
              className="search-button"
              disabled={loading}
            >
              목록 조회
            </button>
          </div>
          
          {/* 고객 검색 */}
          {/* 이 부분 전체 삭제 */}
        </div>

        {/* 액션 버튼 */}
        <div className="customer-action-buttons">
          <button 
            onClick={() => handleUpdateStatus('단골 고객')}
            className="action-button regular-customer"
            disabled={loading || selectedCustomers.length === 0}
          >
            단골 등록
          </button>
          <button 
            onClick={() => handleUpdateStatus('일반 고객')}
            className="action-button general-customer"
            disabled={loading || selectedCustomers.length === 0}
          >
            일반 등록
          </button>
          <button 
            onClick={handleOpenCouponModal}
            className="action-button gift-coupon"
            disabled={loading || selectedCustomers.length === 0}
          >
            쿠폰 선물
          </button>
        </div>

        {/* 메시지 */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {/* 사용자 정보 확인 */}
        {!currentStoreUserIndex && (
          <div className="info-message">
            사용자 정보를 불러오는 중입니다...
          </div>
        )}

        {/* 고객 목록 테이블 */}
        <div className="customer-table-container">
          <div className="table-header">
            <div className="header-checkbox">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
            <div className="header-name">이름</div>
            <div className="header-id">ID</div>
            <div className="header-phone">전화번호</div>
            <div className="header-type">구분</div>
          </div>

          <div className="table-body">
            {loading ? (
              <div className="loading-message">로딩 중...</div>
            ) : customers.length === 0 ? (
              <div className="no-data-message">고객 데이터가 없습니다.</div>
            ) : (
              customers.map((customer, index) => (
                <div key={customer.storeCustomerIndex} className="table-row">
                  <div className="row-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.storeCustomerIndex)}
                      onChange={(e) => handleSelectCustomer(customer.storeCustomerIndex, e.target.checked)}
                    />
                  </div>
                  <div className="row-name">{customer.customerName ? customer.customerName.substring(0, 2) + '*' : '고객*'}</div>
                  <div className="row-id">{customer.customerEmail ? customer.customerEmail.substring(0, 3) + '*' : '***'}</div>
                  <div className="row-phone">{customer.customerPhone || '010-****-' + customer.storeCustomerIndex}</div>
                  <div className="row-type">{customer.storeCustomerStatus || '일반 고객'}</div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* 쿠폰 선물 모달 */}
        {showCouponModal && (
          <div className="taekjun-coupon-modal-overlay">
            <div className="taekjun-coupon-modal">
              <div className="taekjun-coupon-modal-header">
                <h3>쿠폰 선물</h3>
                <button 
                  onClick={handleCloseCouponModal}
                  className="taekjun-coupon-modal-close-button"
                >
                  ×
                </button>
              </div>
              
              <div className="taekjun-coupon-modal-content">
                <div className="taekjun-coupon-modal-form">
                  <div className="taekjun-coupon-modal-form-group">
                    <label>쿠폰명</label>
                    <input
                      type="text"
                      value={couponForm.couponName}
                      onChange={(e) => handleCouponFormChange('couponName', e.target.value)}
                      placeholder="쿠폰명을 입력하세요"
                      className="taekjun-coupon-modal-form-input"
                    />
                  </div>
                  
                  <div className="taekjun-coupon-modal-form-group">
                    <label>쿠폰 금액 (원)</label>
                    <select
                      value={couponForm.couponPrice}
                      onChange={(e) => handleCouponFormChange('couponPrice', e.target.value)}
                      className="taekjun-coupon-modal-form-input"
                    >
                      <option value="">쿠폰 금액을 선택하세요</option>
                      <option value="1000">1,000원</option>
                      <option value="5000">5,000원</option>
                      <option value="10000">10,000원</option>
                      <option value="50000">50,000원</option>
                    </select>
                  </div>
                  
                  <div className="taekjun-coupon-modal-form-group">
                    <label>사용 기간 (일)</label>
                    <input
                      type="number"
                      value={couponForm.couponLimit}
                      onChange={(e) => handleCouponFormChange('couponLimit', e.target.value)}
                      placeholder="사용 기간을 입력하세요"
                      className="taekjun-coupon-modal-form-input"
                      min="1"
                      max="365"
                    />
                  </div>
                  
                  <div className="taekjun-coupon-modal-form-group">
                    <label>핀번호</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="password"
                        value={couponForm.pinCode}
                        placeholder="핀번호를 입력하세요"
                        className="taekjun-coupon-modal-form-input"
                        readOnly
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={handleOpenPinModal}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#170F58',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        핀번호 입력
                      </button>
                    </div>
                  </div>
                  
                  <div className="taekjun-coupon-modal-selected-info">
                    <p>선택된 고객: {selectedCustomers.length}명</p>
                    <p>필요 TS: {couponForm.couponPrice && couponForm.couponLimit ? 
                      (parseInt(couponForm.couponPrice) * selectedCustomers.length).toLocaleString() : 0}원</p>
                  </div>
                </div>
              </div>
              
              <div className="taekjun-coupon-modal-footer">
                <button 
                  onClick={handleCloseCouponModal}
                  className="taekjun-coupon-modal-cancel-button"
                  disabled={loading}
                >
                  취소
                </button>
                <button 
                  onClick={handleGiftCoupon}
                  className="taekjun-coupon-modal-confirm-button"
                  disabled={loading || !couponForm.couponName || !couponForm.couponPrice || !couponForm.couponLimit || !couponForm.pinCode}
                >
                  {loading ? '처리 중...' : '쿠폰 발급'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 핀번호 입력 모달 */}
        {showPinModal && (
          <div className="taekjun-coupon-modal-overlay">
            <div className="taekjun-coupon-modal" style={{ 
              maxWidth: '400px', 
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div className="taekjun-coupon-modal-header">
                <h3>핀번호 입력</h3>
                <button 
                  onClick={handleClosePinModal}
                  className="taekjun-coupon-modal-close"
                >
                  ✕
                </button>
              </div>
              <div className="taekjun-coupon-modal-body">
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <p style={{ 
                    marginBottom: '10px', 
                    color: '#666',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    핀번호를 입력해주세요
                  </p>
                  <div style={{ width: '100%' }}>
                    <PinInput onComplete={handlePinComplete} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement; 