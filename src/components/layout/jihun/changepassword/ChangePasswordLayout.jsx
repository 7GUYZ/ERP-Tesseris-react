import React from 'react';
import '../../../../styles/jihun/changepassword/ChangePasswordLayout.css';

const ChangePasswordLayout = ({ children }) => {
  return (
    <div className="change-password-layout">
      <div className="change-password-container">
        <div className="change-password-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordLayout; 