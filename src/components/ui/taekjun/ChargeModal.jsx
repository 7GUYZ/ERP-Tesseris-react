import React, { useState } from 'react';
import '../../../styles/taekjun/ChargeModal.css';

const ChargeModal = ({ isOpen, onClose, onConfirm, currentBalance, requiredAmount }) => {
  const [chargeAmount, setChargeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const insufficientAmount = requiredAmount - currentBalance;
  const suggestedAmount = Math.max(insufficientAmount, 10000); // 최소 10,000 TS

  const handleCharge = async () => {
    if (!chargeAmount || parseInt(chargeAmount) <= 0) {
      setError('충전 금액을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 실제 충전 API 호출 (임시로 성공 처리)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onConfirm(parseInt(chargeAmount));
      onClose();
    } catch (error) {
      setError('충전 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCharge = (amount) => {
    setChargeAmount(amount.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="charge-modal-overlay">
      <div className="charge-modal-container">
        <div className="charge-modal-header">
          <h2 className="charge-modal-title">TS 충전</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="charge-modal-close-button"
          >
            ×
          </button>
        </div>
        
        <div className="charge-modal-body">
          {/* 현재 상황 안내 */}
          <div className="charge-modal-info">
            <div className="charge-modal-info-item">
              <span className="charge-modal-info-label">현재 보유 TS:</span>
              <span className="charge-modal-info-value">{currentBalance.toLocaleString()} TS</span>
            </div>
            <div className="charge-modal-info-item">
              <span className="charge-modal-info-label">필요한 TS:</span>
              <span className="charge-modal-info-value">{requiredAmount.toLocaleString()} TS</span>
            </div>
            <div className="charge-modal-info-item charge-modal-insufficient">
              <span className="charge-modal-info-label">부족한 TS:</span>
              <span className="charge-modal-info-value charge-modal-insufficient-value">
                {insufficientAmount.toLocaleString()} TS
              </span>
            </div>
          </div>

          {/* 충전 금액 입력 */}
          <div className="charge-modal-form-group">
            <label className="charge-modal-label">충전 금액 (TS)</label>
            <input
              type="number"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              placeholder="충전할 금액을 입력하세요"
              className="charge-modal-input"
              min="1000"
              step="1000"
            />
          </div>

          {/* 빠른 충전 버튼 */}
          <div className="charge-modal-quick-charge">
            <span className="charge-modal-quick-label">빠른 충전:</span>
            <div className="charge-modal-quick-buttons">
              <button
                type="button"
                onClick={() => handleQuickCharge(suggestedAmount)}
                className="charge-modal-quick-button charge-modal-suggested"
              >
                {suggestedAmount.toLocaleString()} TS
              </button>
              <button
                type="button"
                onClick={() => handleQuickCharge(50000)}
                className="charge-modal-quick-button"
              >
                50,000 TS
              </button>
              <button
                type="button"
                onClick={() => handleQuickCharge(100000)}
                className="charge-modal-quick-button"
              >
                100,000 TS
              </button>
            </div>
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="charge-modal-error-message">
              {error}
            </div>
          )}

          {/* 충전 후 잔액 표시 */}
          {chargeAmount && parseInt(chargeAmount) > 0 && (
            <div className="charge-modal-balance-preview">
              <span className="charge-modal-balance-label">충전 후 잔액:</span>
              <span className="charge-modal-balance-value">
                {(currentBalance + parseInt(chargeAmount)).toLocaleString()} TS
              </span>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="charge-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="charge-modal-cancel-button"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleCharge}
            disabled={loading || !chargeAmount || parseInt(chargeAmount) <= 0}
            className="charge-modal-confirm-button"
          >
            {loading ? '충전 중...' : '충전하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChargeModal; 