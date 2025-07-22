import React from 'react';
import '../../../../styles/jihun/charge/ChargeLayout.css';

const ChargeLayout = ({ children }) => {
  return (
    <div className="charge-layout">
      <div className="charge-container">
        <div className="charge-header">
          <h1 className="charge-title">CM 충전</h1>
        </div>
        
        <div className="charge-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChargeLayout; 