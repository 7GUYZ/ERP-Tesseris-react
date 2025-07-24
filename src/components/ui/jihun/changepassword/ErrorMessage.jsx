import React from 'react';
import '../../../../styles/jihun/changepassword/ErrorMessage.css';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message-container">
      <div className="error-message-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
        {onClose && (
          <button className="error-close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 