import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../../api/auth/TaekjunAuth';
import '../../../styles/taekjun/Modal.css';

const StoreSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchStores();
    }
  }, [isOpen]);

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await paymentApi.getPaymentStoreList();
      if (response.data.resultCode === 200) {
        setStores(response.data.data);
      } else {
        setError('가맹점 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('가맹점 목록 조회 오류:', err);
      setError('가맹점 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store =>
    store.storeName && store.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStoreSelect = (store) => {
    onSelect(store);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">가맹점 선택</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* 검색 */}
          <input
            type="text"
            placeholder="가맹점명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modal-search-input"
          />
          
          {/* 로딩 */}
          {loading && (
            <div className="modal-loading">
              가맹점 목록을 불러오는 중...
            </div>
          )}
          
          {/* 에러 */}
          {error && (
            <div className="modal-error-message">
              {error}
            </div>
          )}
          
          {/* 가맹점 목록 */}
          {!loading && !error && (
            <div className="modal-list-container">
              {filteredStores.length === 0 ? (
                <div className="modal-empty-state">
                  <div className="modal-empty-text">
                    {searchTerm ? '검색 결과가 없습니다.' : '가맹점이 없습니다.'}
                  </div>
                </div>
              ) : (
                filteredStores.map(store => (
                  <div
                    key={store.userIndex}
                    className="modal-list-item"
                    onClick={() => handleStoreSelect(store)}
                  >
                    <div className="modal-item-info">
                      <div className="modal-item-name">{store.storeName || '가맹점명 없음'}</div>
                      <div className="modal-item-details">
                        <span>가맹점</span>
                      </div>
                    </div>
                    <div className="modal-selected-indicator">→</div>
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

export default StoreSelectionModal; 