import React, { useState, useEffect } from 'react';
import '../../../styles/taekjun/Modal.css';
import '../../../styles/taekjun/PinCodeModal.css';

const PinCodeModal = ({ isOpen, onClose, onConfirm, title = "핀번호 입력" }) => {
  const [pinCode, setPinCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 모달이 열릴 때마다 핀번호 초기화
  useEffect(() => {
    if (isOpen) {
      setPinCode('');
      setShowPassword(false);
    }
  }, [isOpen]);
  
  // 숫자 버튼 클릭
  const handleNumberClick = (number) => {
    if (pinCode.length < 6) {
      setPinCode(prev => prev + number);
    }
  };
  
  // 삭제 버튼 클릭
  const handleDeleteClick = () => {
    setPinCode(prev => prev.slice(0, -1));
  };
  
  // 확인 버튼 클릭
  const handleConfirmClick = () => {
    if (pinCode.length === 6) {
      onConfirm(pinCode);
      onClose();
    }
  };
  
  // 취소 버튼 클릭
  const handleCancelClick = () => {
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container pin-code-modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* 핀번호 표시 */}
          <div className="pin-display">
            <div className="pin-input-container">
              {Array.from({ length: 6 }, (_, index) => (
                <div 
                  key={index} 
                  className={`pin-digit ${index < pinCode.length ? 'filled' : ''}`}
                >
                  {showPassword && index < pinCode.length ? pinCode[index] : 
                   index < pinCode.length ? '●' : ''}
                </div>
              ))}
            </div>
            
            {/* 보기/숨기기 버튼 */}
            <button 
              className="pin-toggle-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '숨기기' : '보기'}
            </button>
          </div>
          
          {/* 숫자 키패드 */}
          <div className="pin-keypad">
            <div className="keypad-row">
              <button className="pin-number-btn" onClick={() => handleNumberClick('1')}>1</button>
              <button className="pin-number-btn" onClick={() => handleNumberClick('2')}>2</button>
              <button className="pin-number-btn" onClick={() => handleNumberClick('3')}>3</button>
            </div>
            <div className="keypad-row">
              <button className="pin-number-btn" onClick={() => handleNumberClick('4')}>4</button>
              <button className="pin-number-btn" onClick={() => handleNumberClick('5')}>5</button>
              <button className="pin-number-btn" onClick={() => handleNumberClick('6')}>6</button>
            </div>
            <div className="keypad-row">
              <button className="pin-number-btn" onClick={() => handleNumberClick('7')}>7</button>
              <button className="pin-number-btn" onClick={() => handleNumberClick('8')}>8</button>
              <button className="pin-number-btn" onClick={() => handleNumberClick('9')}>9</button>
            </div>
            <div className="keypad-row">
              <button className="pin-delete-btn" onClick={handleDeleteClick}>삭제</button>
              <button className="pin-number-btn" onClick={() => handleNumberClick('0')}>0</button>
              <button className="pin-cancel-btn" onClick={handleCancelClick}>취소</button>
            </div>
          </div>
          
          {/* 확인 버튼 */}
          <div className="pin-confirm-section">
            <button 
              className={`pin-confirm-btn ${pinCode.length === 6 ? 'active' : 'disabled'}`}
              onClick={handleConfirmClick}
              disabled={pinCode.length !== 6}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinCodeModal; 