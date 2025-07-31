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
  }, [isOpen, userIndex, storeUserIndex, paymentAmount]);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 가맹점별 쿠폰 조회
      const response = await paymentApi.getStoreCoupons(userIndex, storeUserIndex, searchTerm);
      if (response.data.resultCode === 200) {
        // 결제 금액에 따라 쿠폰 필터링
        const filteredCoupons = response.data.data.filter(coupon => {
          // 10,000원 이상 결제 시에만 10,000원 쿠폰 표시
          if (coupon.couponPrice === 10000) {
            return paymentAmount >= 10000;
          }
          // 50,000원 이상 결제 시에만 50,000원 쿠폰 표시
          else if (coupon.couponPrice === 50000) {
            return paymentAmount >= 50000;
          }
          // 기타 쿠폰은 모두 표시
          return true;
        });
        setCoupons(filteredCoupons);
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>쿠폰 선택</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* 검색 */}
          <div className="search-container">
            <input
              type="text"
              placeholder="쿠폰명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button 
              onClick={handleSearch}
              className="search-button"
            >
              검색
            </button>
          </div>
          
          {/* 로딩 */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>쿠폰 목록을 불러오는 중...</p>
            </div>
          )}
          
          {/* 에러 */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {/* 쿠폰 목록 */}
          {!loading && !error && (
            <div className="coupon-grid">
              {coupons.length === 0 ? (
                <div className="no-results">
                  {searchTerm ? '검색 결과가 없습니다.' : '사용 가능한 쿠폰이 없습니다.'}
                </div>
              ) : (
                coupons.map(coupon => (
                  <div
                    key={coupon.couponIndex}
                    className="coupon-card"
                    onClick={() => handleCouponSelect(coupon)}
                  >
                    <div className="coupon-card-header">
                      <span className="coupon-status status-available">사용 가능</span>
                      <span className="coupon-price">{coupon.couponPrice.toLocaleString()} CM</span>
                    </div>
                    <div className="coupon-card-body">
                      <h3 className="coupon-name">{coupon.couponName}</h3>
                      <p className="coupon-condition">할인 쿠폰</p>
                      <div className="coupon-details">
                        <div className="coupon-detail-item">
                          <span className="detail-label">발급 가맹점</span>
                          <span className="detail-value">{coupon.storeName}</span>
                        </div>
                        <div className="coupon-detail-item">
                          <span className="detail-label">만료일</span>
                          <span className="detail-value">{coupon.couponLimitTime}</span>
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