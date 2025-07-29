import React, { useState, useEffect, useCallback } from 'react';
import { couponListApi } from '../../api/auth/TaekjunAuth';
import '../../styles/taekjun/CouponList.css';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 검색 및 필터 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('전체');
  
  // 현재 로그인한 사용자의 userIndex
  const [currentUserIndex, setCurrentUserIndex] = useState("");
  
  // 필터 옵션
  const filterOptions = [
    { value: '전체', label: '전체' },
    { value: '사용 가능', label: '사용 가능' },
    { value: '사용 완료', label: '사용 완료' },
    { value: '기한 경과', label: '기한 경과' }
  ];

  // 페이지 로드 시 로컬스토리지에서 user_index 가져오기
  useEffect(() => {
    const userInfo = localStorage.getItem('user-info');
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        const userIndex = userData.user_index;
        if (userIndex) {
          setCurrentUserIndex(userIndex);
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

  // 쿠폰 목록 조회
  const fetchCoupons = useCallback(async () => {
    if (!currentUserIndex) {
      setError('사용자 정보가 없습니다.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await couponListApi.getMyCoupons(currentUserIndex);
      
      if (response.data.success) {
        setCoupons(response.data.coupons || []);
      } else {
        setError(response.data.message || '쿠폰 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('쿠폰 목록 조회 오류:', err);
      setError('쿠폰 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentUserIndex]);

  // 초기 데이터 로드
  useEffect(() => {
    if (currentUserIndex) {
      fetchCoupons();
    }
  }, [currentUserIndex, fetchCoupons]);

  // 검색 실행
  const handleSearch = () => {
    fetchCoupons();
  };



  // 쿠폰 상태에 따른 필터링
  const getFilteredCoupons = () => {
    let filtered = coupons;

    // 검색어 필터링
    if (searchKeyword) {
      filtered = filtered.filter(coupon => 
        coupon.couponName && coupon.couponName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 상태별 필터링
    switch (selectedFilter) {
      case '사용 가능':
        filtered = filtered.filter(coupon => coupon.couponProvidedStatusIndex === 1);
        break;
      case '사용 완료':
        filtered = filtered.filter(coupon => coupon.couponProvidedStatusIndex === 2);
        break;
      case '기한 경과':
        filtered = filtered.filter(coupon => coupon.couponProvidedStatusIndex === 3 || coupon.couponProvidedStatusIndex === 5);
        break;
      default:
        break;
    }

    return filtered;
  };

  // 쿠폰 상태 텍스트 변환
  const getCouponStatusText = (statusIndex) => {
    switch (statusIndex) {
      case 1:
        return '사용 가능';
      case 2:
        return '사용 완료';
      case 3:
        return '기한 경과';
      case 5:
        return '기한 경과';
      default:
        return '알 수 없음';
    }
  };

  // 쿠폰 상태에 따른 스타일 클래스
  const getCouponStatusClass = (statusIndex) => {
    switch (statusIndex) {
      case 1:
        return 'status-available';
      case 2:
        return 'status-used';
      case 3:
        return 'status-expired';
      default:
        return 'status-unknown';
    }
  };

  const filteredCoupons = getFilteredCoupons();

  return (
    <div className="coupon-list" style={{ minHeight: '100vh', background: '#F5F5F9', padding: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="coupon-list-container" style={{ width: '100%', height: '100vh', margin: 0, background: 'white', borderRadius: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* 헤더 */}
        <div className="coupon-list-header" style={{ background: '#170F58', color: 'white', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <div className="header-back">
            <span className="back-arrow">←</span>
          </div>
          <h1 className="header-title">쿠폰 보관함</h1>
        </div>

        {/* 검색 및 필터 */}
        <div className="coupon-search-section">
          <div className="search-input-group">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="쿠폰 이름을 입력하세요."
              className="search-input"
            />
            <button 
              onClick={handleSearch}
              className="search-button"
              disabled={loading}
            >
              🔍
            </button>
          </div>
          
          {/* 필터 탭 */}
          <div className="filter-tabs">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`filter-tab ${selectedFilter === option.value ? 'active' : ''}`}
                onClick={() => setSelectedFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 메시지 */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {/* 사용자 정보 확인 */}
        {!currentUserIndex && (
          <div className="info-message">
            사용자 정보를 불러오는 중입니다...
          </div>
        )}

        {/* 쿠폰 목록 */}
        <div className="coupon-list-content">
          {loading ? (
            <div className="loading-message">로딩 중...</div>
          ) : filteredCoupons.length === 0 ? (
            <div className="no-data-message">
              {selectedFilter}에 해당하는 쿠폰의 개수는 없습니다.
            </div>
          ) : (
            <div className="coupon-grid">
              {filteredCoupons.map((coupon) => (
                <div key={coupon.couponIndex} className="coupon-card">
                  <div className="coupon-card-header">
                    <div className={`coupon-status ${getCouponStatusClass(coupon.couponProvidedStatusIndex)}`}>
                      {getCouponStatusText(coupon.couponProvidedStatusIndex)}
                    </div>
                    <div className="coupon-price">
                      {coupon.couponPrice?.toLocaleString()}원
                    </div>
                  </div>
                  
                  <div className="coupon-card-body">
                    <h3 className="coupon-name">{coupon.couponName || '쿠폰'}</h3>
                    <div className="coupon-store">
                      {coupon.storeName ? `발급 가맹점: ${coupon.storeName}` : '발급 가맹점 정보 없음'}
                    </div>
                    <p className="coupon-condition">{coupon.couponCondition || '쿠폰 사용 조건'}</p>
                    
                    <div className="coupon-details">
                      <div className="coupon-detail-item">
                        <span className="detail-label">발급일:</span>
                        <span className="detail-value">{coupon.issuanceDateStr ? coupon.issuanceDateStr.substring(0, 10) : '날짜 정보 없음'}</span>
                      </div>
                      <div className="coupon-detail-item">
                        <span className="detail-label">만료일:</span>
                        <span className="detail-value">{coupon.limitDateStr ? coupon.limitDateStr.substring(0, 10) : '날짜 정보 없음'}</span>
                      </div>
                      <div className="coupon-detail-item">
                        <span className="detail-label">사용 기간:</span>
                        <span className="detail-value">{coupon.couponLimit}일</span>
                      </div>
                    </div>
                  </div>
                  

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponList; 