import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../../api/auth/TaekjunAuth';
import '../../../styles/taekjun/Modal.css';

const CouponSelectionModal = ({ isOpen, onClose, onSelect, userIndex }) => {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userIndex) {
      fetchCoupons();
    }
  }, [isOpen, userIndex]);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await paymentApi.getUserCoupons(userIndex, searchTerm);
      if (response.data.resultCode === 200) {
        setCoupons(response.data.data);
      } else {
        setError('쿠폰 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('쿠폰 목록 조회 오류:', err);
      setError('쿠폰 목록을 불러오는데 실패했습니다.');
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
            <div className="coupon-list">
              {coupons.length === 0 ? (
                <div className="no-results">
                  {searchTerm ? '검색 결과가 없습니다.' : '사용 가능한 쿠폰이 없습니다.'}
                </div>
              ) : (
                coupons.map(coupon => (
                  <div
                    key={coupon.couponIndex}
                    className="coupon-item"
                    onClick={() => handleCouponSelect(coupon)}
                  >
                    <div className="coupon-info">
                      <div className="coupon-header">
                        <h3 className="coupon-name">{coupon.couponName}</h3>
                        <span className="coupon-price">{coupon.couponPrice.toLocaleString()} CM</span>
                      </div>
                      <div className="coupon-details">
                        <span className="coupon-store">발급 가맹점: {coupon.storeName}</span>
                        <span className="coupon-limit">만료일: {coupon.couponLimitTime}</span>
                      </div>
                    </div>
                    <div className="coupon-arrow">→</div>
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