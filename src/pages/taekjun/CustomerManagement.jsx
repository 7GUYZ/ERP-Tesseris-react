import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerManagementApi } from '../../api/auth/TaekjunAuth';
import PinInput from '../../components/forms/jiyun/pin-change/PinInput';
import PinCodeModal from '../../components/ui/taekjun/PinCodeModal';
import '../../styles/taekjun/CustomerManagement.css';

const CustomerManagement = () => {
  const navigate = useNavigate();
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
  
  // 필터 옵션 (추천 고객 제거)
  const memberOptions = ['전체', '일반 고객', '단골 고객'];
  
  // 현재 로그인한 사용자의 storeUserIndex (로컬스토리지에서 가져옴)
  const [currentStoreUserIndex, setCurrentStoreUserIndex] = useState("");
  
  // 쿠폰 선물 모달 상태
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    couponName: '',
    couponPrice: '',
    couponLimit: '3', // 기본값을 3으로 설정
    pinCode: ''
  });
  
  // 이벤트 쿠폰 발행 모달 상태
  const [showEventCouponModal, setShowEventCouponModal] = useState(false);
  const [eventCouponForm, setEventCouponForm] = useState({
    eventName: '',
    couponName: '',
    couponPrice: '',
    couponLimit: '',
    couponCondition: '1',
    couponCount: '', // 발행할 쿠폰 개수 추가
    pinCode: ''
  });

  // 핀번호 입력 모달 상태
  const [showPinModal, setShowPinModal] = useState(false);

  // 뒤로가기 함수
  const handleGoBack = () => {
    navigate(-1);
  };

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

  // 고객 목록 조회 (검색 조건 포함)
  const fetchCustomers = useCallback(async (searchParams = null) => {
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
      
      // 검색 파라미터가 있으면 사용, 없으면 현재 상태 사용
      const member = searchParams?.member ?? selectedMember;
      const phone = searchParams?.phone ?? searchPhone;
      
      if (member && member !== '전체') params.member = member;
      if (phone && phone.trim()) params.phone = phone.trim();
      
      console.log('검색 파라미터:', params);
      
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
  }, [currentStoreUserIndex, selectedMember, searchPhone]);

  // 초기 데이터 로드 (userIndex가 있을 때만, 필터 없이 전체 조회)
  useEffect(() => {
    if (currentStoreUserIndex) {
      const params = {
        storeUserIndex: currentStoreUserIndex
      };
      fetchCustomers(params);
    }
  }, [currentStoreUserIndex]);

  // 검색 실행 (버튼 클릭 또는 엔터키)
  const handleSearch = () => {
    console.log('검색 실행 - 전화번호:', searchPhone, '구분:', selectedMember);
    fetchCustomers({
      member: selectedMember,
      phone: searchPhone
    });
  };

  // 엔터키 검색
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
  
  // 이벤트 쿠폰 발행 모달 열기
  const handleOpenEventCouponModal = () => {
    setShowEventCouponModal(true);
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
  
  // 이벤트 쿠폰 발행 모달 닫기
  const handleCloseEventCouponModal = () => {
    setShowEventCouponModal(false);
    setEventCouponForm({
      eventName: '',
      couponName: '',
      couponPrice: '',
      couponLimit: '',
      couponCondition: '',
      couponCount: '', // 쿠폰 개수 초기화 추가
      pinCode: ''
    });
  };
  
  // 쿠폰 폼 입력 처리
  const handleCouponFormChange = (field, value) => {
    setCouponForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 이벤트 쿠폰 폼 입력 처리
  const handleEventCouponFormChange = (field, value) => {
    setEventCouponForm(prev => ({
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

  // 핀번호 입력 완료 핸들러 (쿠폰 선물용)
  const handlePinComplete = (pin) => {
    // 현재 열린 모달에 따라 핀번호 설정
    if (showCouponModal) {
      handleCouponFormChange('pinCode', pin);
    } else if (showEventCouponModal) {
      handleEventCouponFormChange('pinCode', pin);
    }
    setShowPinModal(false);
    // 핀번호 입력 완료 후 성공 메시지 표시
    setSuccess('핀번호가 입력되었습니다.');
    setTimeout(() => {
      setSuccess('');
    }, 2000);
  };
  
  // 이벤트 쿠폰 발행 실행
  const handleIssueEventCoupon = async () => {
    if (!eventCouponForm.eventName || !eventCouponForm.couponName || !eventCouponForm.couponPrice || !eventCouponForm.couponLimit || !eventCouponForm.couponCount || !eventCouponForm.pinCode) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    // 쿠폰 개수 검증 (1개 이상)
    if (parseInt(eventCouponForm.couponCount) < 1) {
      setError('발행할 쿠폰 개수는 1개 이상이어야 합니다.');
      return;
    }

    // 핀번호 형식 검증 (6자리 숫자)
    if (!/^\d{6}$/.test(eventCouponForm.pinCode)) {
      setError('핀번호는 6자리 숫자로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
            const response = await customerManagementApi.issueEventCoupon({
        eventName: eventCouponForm.eventName,
        couponName: eventCouponForm.couponName,
        couponPrice: parseInt(eventCouponForm.couponPrice),
        couponLimit: parseInt(eventCouponForm.couponLimit),
        couponCount: parseInt(eventCouponForm.couponCount),
        pinCode: eventCouponForm.pinCode,
        storeUserIndex: currentStoreUserIndex
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        handleCloseEventCouponModal();
        fetchCustomers(); // 목록 새로고침
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('이벤트 쿠폰 발행 오류:', err);
      setError('이벤트 쿠폰 발행 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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
          <div className="header-back" onClick={handleGoBack}>
            <span className="back-arrow">←</span>
          </div>
          <h1 className="header-title2">고객 관리</h1>
        </div>

        {/* 검색 및 필터 */}
        <div className="customer-search-section">
          <div className="search-input-group">
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyPress={handleKeyPress}
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
          <button 
            onClick={handleOpenEventCouponModal}
            className="action-button event-coupon"
            disabled={loading}
          >
            이벤트 쿠폰 발행
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

        {/* 핀번호 입력 모달 - 최상위 레벨에서 렌더링 */}
        {showPinModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999
          }}>
            <PinCodeModal
              isOpen={showPinModal}
              onClose={handleClosePinModal}
              onConfirm={handlePinComplete}
              title="핀번호 입력"
            />
          </div>
        )}
        
        {/* 이벤트 쿠폰 발행 모달 */}
        {showEventCouponModal && (
          <div className="taekjun-coupon-modal-overlay">
            <div className="taekjun-coupon-modal">
              <div className="taekjun-coupon-modal-header">
                <h3>이벤트 쿠폰 발행</h3>
                <button 
                  onClick={handleCloseEventCouponModal}
                  className="taekjun-coupon-modal-close-button"
                >
                  ×
                </button>
              </div>
              
              <div className="taekjun-coupon-modal-content">
                <div className="taekjun-coupon-modal-form">
                  <div className="taekjun-coupon-modal-form-group">
                    <label>이벤트명</label>
                    <input
                      type="text"
                      value={eventCouponForm.eventName}
                      onChange={(e) => handleEventCouponFormChange('eventName', e.target.value)}
                      placeholder="이벤트명을 입력하세요"
                      className="taekjun-coupon-modal-form-input"
                    />
                  </div>
                  
                  <div className="taekjun-coupon-modal-form-group">
                    <label>쿠폰명</label>
                    <input
                      type="text"
                      value={eventCouponForm.couponName}
                      onChange={(e) => handleEventCouponFormChange('couponName', e.target.value)}
                      placeholder="쿠폰명을 입력하세요"
                      className="taekjun-coupon-modal-form-input"
                    />
                  </div>
                  
                  <div className="taekjun-coupon-modal-form-group">
                    <label>쿠폰 금액 (원)</label>
                    <select
                      value={eventCouponForm.couponPrice}
                      onChange={(e) => handleEventCouponFormChange('couponPrice', e.target.value)}
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
                      value={eventCouponForm.couponLimit}
                      onChange={(e) => handleEventCouponFormChange('couponLimit', e.target.value)}
                      placeholder="사용 기간을 입력하세요"
                      className="taekjun-coupon-modal-form-input"
                      min="1"
                      max="365"
                    />
                  </div>
                  

                  
                  <div className="taekjun-coupon-modal-form-group">
                    <label>발행할 쿠폰 개수</label>
                    <input
                      type="number"
                      value={eventCouponForm.couponCount}
                      onChange={(e) => handleEventCouponFormChange('couponCount', e.target.value)}
                      placeholder="발행할 쿠폰 개수를 입력하세요"
                      className="taekjun-coupon-modal-form-input"
                      min="1"
                      max="1000"
                    />
                  </div>
                  
                  <div className="taekjun-coupon-modal-form-group">
                    <label>핀번호</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="password"
                        value={eventCouponForm.pinCode}
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
                    <p>발행할 쿠폰 개수: {eventCouponForm.couponCount || 0}개</p>
                    <p>필요 CM: {eventCouponForm.couponPrice && eventCouponForm.couponCount ? 
                      (parseInt(eventCouponForm.couponPrice) * parseInt(eventCouponForm.couponCount)).toLocaleString() : 0}원</p>
                    <p>이벤트 쿠폰이 발행되면 모든 고객에게 알림이 전송됩니다.</p>
                  </div>
                </div>
              </div>
              
              <div className="taekjun-coupon-modal-footer">
                <button 
                  onClick={handleCloseEventCouponModal}
                  className="taekjun-coupon-modal-cancel-button"
                  disabled={loading}
                >
                  취소
                </button>
                <button 
                  onClick={handleIssueEventCoupon}
                  className="taekjun-coupon-modal-confirm-button"
                  disabled={loading || !eventCouponForm.eventName || !eventCouponForm.couponName || !eventCouponForm.couponPrice || !eventCouponForm.couponLimit || !eventCouponForm.couponCount || !eventCouponForm.pinCode}
                >
                  {loading ? '처리 중...' : '이벤트 쿠폰 발행'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement; 