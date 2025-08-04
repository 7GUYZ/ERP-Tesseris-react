import React, { useState } from 'react';
import { useToast } from '../../../../context/jungeun/ToastContext';

const ChangePasswordFeature = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 비밀번호 변경 로직
    try {
      // API 호출 등
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      toast.error('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div className="change-password-feature">
      <h3>비밀번호 변경</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>새 비밀번호</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>새 비밀번호 확인</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        </div>
        <button type="submit">비밀번호 변경</button>
      </form>
    </div>
  );
};

export default ChangePasswordFeature; 