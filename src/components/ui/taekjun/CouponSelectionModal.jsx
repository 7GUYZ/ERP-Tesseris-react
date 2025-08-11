import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../../api/auth/TaekjunAuth';
import '../../../styles/taekjun/Modal.css';

const CouponSelectionModal = ({ isOpen, onClose, onSelect, userIndex, storeUserIndex, paymentAmount = 0 }) => {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userIndex && storeUserIndex) {
      fetchCoupons();
    }
  }, [isOpen, userIndex, storeUserIndex]);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 가맹점별 쿠폰 조회 - 검색어 없이 모든 쿠폰 가져오기
      const response = await paymentApi.getStoreCoupons(userIndex, storeUserIndex);
      if (response.data.resultCode === 200) {
        // 단순히 해당 가맹점의 쿠폰만 표시
        setCoupons(response.data.data || []);
      } else {
        setError('가맹점 쿠폰 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('가맹점 쿠폰 목록 조회 오류:', err);
      setError('가맹점 쿠폰 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCoupons();
  };

  const handleCouponSelect = (coupon) => {
    onSelect(coupon);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="coupon-modal-overlay">
      <div className="coupon-modal-content">
        <div className="coupon-modal-header">
          <h2>쿠폰 선택</h2>
          <button className="coupon-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="coupon-modal-body">
          {/* 검색 */}
          <div className="coupon-search-container">
            <input
              type="text"
              placeholder="쿠폰명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="coupon-search-input"
            />
            <button 
              onClick={handleSearch}
              className="coupon-search-button"
            >
              검색
            </button>
          </div>
          
          {/* 로딩 */}
          {loading && (
            <div className="coupon-loading-container">
              <div className="coupon-loading-spinner"></div>
              <p>쿠폰 목록을 불러오는 중...</p>
            </div>
          )}
          
          {/* 에러 */}
          {error && (
            <div className="coupon-error-message">
              {error}
            </div>
          )}
          
          {/* 쿠폰 목록 */}
          {!loading && !error && (
            <div className="coupon-selection-grid">
              {coupons.length === 0 ? (
                <div className="coupon-no-results">
                  {searchTerm ? '검색 결과가 없습니다.' : '사용 가능한 쿠폰이 없습니다.'}
                </div>
              ) : (
                coupons.map(coupon => (
                  <div
                    key={coupon.couponIndex}
                    className="coupon-selection-card"
                    onClick={() => handleCouponSelect(coupon)}
                  >
                    <div className="coupon-selection-card-header">
                      <span className="coupon-selection-status coupon-selection-status-available">사용 가능</span>
                      <span className="coupon-selection-price">{coupon.couponPrice?.toLocaleString() || 0} TS</span>
                    </div>
                    <div className="coupon-selection-card-body">
                      <h3 className="coupon-selection-name">{coupon.couponName || '쿠폰'}</h3>
                      <p className="coupon-selection-condition">할인 쿠폰</p>
                      <div className="coupon-selection-details">
                        <div className="coupon-selection-detail-item">
                          <span className="coupon-selection-detail-label">발급 가맹점</span>
                          <span className="coupon-selection-detail-value">{coupon.storeName || '가맹점'}</span>
                        </div>
                        <div className="coupon-selection-detail-item">
                          <span className="coupon-selection-detail-label">만료일</span>
                          <span className="coupon-selection-detail-value">
                            {coupon.couponLimitTime ? 
                              (() => {
                                const limitDate = new Date(coupon.couponLimitTime);
                                const now = new Date();
                                const diffTime = limitDate.getTime() - now.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                if (diffDays <= 0) {
                                  return <span style={{color: 'red', fontWeight: 'bold'}}>만료됨</span>;
                                } else if (diffDays <= 3) {
                                  return <span style={{color: 'orange', fontWeight: 'bold'}}>{limitDate.toLocaleDateString()} (D-{diffDays})</span>;
                                } else {
                                  return limitDate.toLocaleDateString();
                                }
                              })()
                              : '날짜 정보 없음'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponSelectionModal; 