import React from 'react';
import '../../../../styles/jihun/charge/BalanceDisplay.css';

const BalanceDisplay = ({ label, balance, isCurrent = false }) => {
  return (
    <div className="balance-display">
      <div className="balance-label">
        {label}
      </div>
      <div className="balance-bar">
        <div className="balance-bar-content">
          <span className="balance-status">사용가능</span>
          <span className="balance-amount">
            {balance ? `${balance.toLocaleString()} TS 머니` : '0 TS 머니'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceDisplay; 