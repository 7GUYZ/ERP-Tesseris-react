import React, { useState } from 'react';
import '../../../../styles/jihun/changepassword/ChangePasswordForm.css';

const ChangePasswordForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: '',
    color: '#666'
  });
  const [confirmMatch, setConfirmMatch] = useState({
    isValid: false,
    message: '',
    color: '#666'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // 모든 필드 실시간 체크
    const newFormData = { ...formData, [field]: value };
    
    // 새 비밀번호 강도 체크 (현재 비밀번호가 변경되어도 재검사)
    if (newFormData.newPassword) {
      checkPasswordStrength(newFormData.newPassword, newFormData.currentPassword);
    }
    
    // 비밀번호 확인 체크 (새 비밀번호 상태가 변경되면 재검사)
    if (newFormData.confirmPassword) {
      checkPasswordMatch(newFormData.newPassword, newFormData.confirmPassword);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (!passwordStrength.isValid) {
      newErrors.newPassword = '비밀번호 요구사항을 확인해주세요.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (!confirmMatch.isValid) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password, currentPassword = formData.currentPassword) => {
    if (!password) {
      setPasswordStrength({
        isValid: false,
        message: '',
        color: '#666'
      });
      return;
    }

    // 현재 비밀번호와 새 비밀번호가 같은지 확인
    if (password === currentPassword) {
      setPasswordStrength({
        isValid: false,
        message: '새 비밀번호가 현재 비밀번호와 같습니다.',
        color: '#ff4757'
      });
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    const isValid = (typeCount >= 2 && password.length >= 10) || (typeCount >= 3 && password.length >= 8);
    
    let message = '';
    let color = '#666';

    if (password.length < 8) {
      message = '비밀번호가 너무 짧습니다.';
      color = '#ff4757';
    } else if (typeCount < 2) {
      message = '영문, 숫자, 특수문자 중 2종류 이상을 조합해주세요.';
      color = '#ff4757';
    } else if (typeCount === 2 && password.length < 10) {
      message = '2종류 조합 시 최소 10자리 이상이어야 합니다.';
      color = '#ff4757';
    } else if (isValid) {
      message = '안전한 비밀번호입니다!';
      color = '#2ed573';
    }

    setPasswordStrength({
      isValid,
      message,
      color
    });
  };

  const checkPasswordMatch = (newPassword, confirmPassword) => {
    if (!confirmPassword) {
      setConfirmMatch({
        isValid: false,
        message: '',
        color: '#666'
      });
      return;
    }

    // 새 비밀번호가 안전하지 않으면 비밀번호 확인 비활성화
    if (!passwordStrength.isValid) {
      setConfirmMatch({
        isValid: false,
        message: '새 비밀번호를 먼저 올바르게 입력해주세요.',
        color: '#ff4757'
      });
      return;
    }

    const isMatch = newPassword === confirmPassword;
    const message = isMatch ? '비밀번호가 일치합니다!' : '비밀번호가 일치하지 않습니다.';
    const color = isMatch ? '#2ed573' : '#ff4757';

    setConfirmMatch({
      isValid: isMatch,
      message,
      color
    });
  };

  const isValidPassword = (password) => {
    // 영문, 숫자, 특수문자 중 2종류 이상 조합하여 최소 10자리 이상
    // 또는 3종류 이상 조합하여 최소 8자리 이상
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    
    return (typeCount >= 2 && password.length >= 10) || (typeCount >= 3 && password.length >= 8);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="change-password-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">현재 비밀번호</label>
        <input
          type="password"
          className={`form-input ${errors.currentPassword ? 'error' : ''}`}
          placeholder="현재 비밀번호를 입력해주세요"
          value={formData.currentPassword}
          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
        />
        {errors.currentPassword && (
          <span className="error-message">{errors.currentPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">새 비밀번호</label>
        <input
          type="password"
          className={`form-input ${errors.newPassword ? 'error' : ''}`}
          placeholder="새로운 비밀번호를 입력해주세요"
          value={formData.newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
        />
        {errors.newPassword && (
          <span className="error-message">{errors.newPassword}</span>
        )}
        {formData.newPassword && (
          <span className="password-strength" style={{ color: passwordStrength.color }}>
            {passwordStrength.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">비밀번호 확인</label>
        <input
          type="password"
          className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
          placeholder="새로운 비밀번호를 다시한번 입력해주세요"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          disabled={!passwordStrength.isValid}
        />
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword}</span>
        )}
        {formData.confirmPassword && (
          <span className="password-match" style={{ color: confirmMatch.color }}>
            {confirmMatch.message}
          </span>
        )}
      </div>

      <div className="password-requirements">
        <div className="requirement-item">
          • 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상 또는 3종류 이상을 조합하여 최소 8자리 이상의 길이로 구성하세요.
        </div>
        <div className="requirement-item">
          • 연속적인 숫자나 생일, 전화번호 등 추측하기 쉬운 개인 정보 및 아이디와 비슷한 비밀번호는 사용하지 않는 것이 안전합니다.
        </div>
      </div>

      <button 
        type="submit" 
        className={`submit-button ${loading ? 'loading' : ''}`}
        disabled={loading || !confirmMatch.isValid || !passwordStrength.isValid}
      >
        {loading ? '처리중...' : '확인'}
      </button>
    </form>
  );
};

export default ChangePasswordForm; 