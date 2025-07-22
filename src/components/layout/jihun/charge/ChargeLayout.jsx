import React from 'react';
import '../../../../styles/jihun/charge/ChargeLayout.css';

const ChargeLayout = ({ children }) => {
  return (
    <div className="charge-layout">
      <div className="charge-container">
        {/* <div className="charge-header">
          <h1 className="charge-title">CM 충전</h1>
          <p className="charge-subtitle">안전하고 빠른 CM 충전 서비스</p>
        </div> */}
        <div className="charge-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChargeLayout; 