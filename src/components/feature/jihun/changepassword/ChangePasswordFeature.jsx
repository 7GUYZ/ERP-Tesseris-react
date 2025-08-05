import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../context/jungeun/ToastContext';
import { changePassword } from '../../../../api/auth/JihunAuth';

const ChangePasswordFeature = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('비밀번호 변경 시작 - formData:', formData);
      
      // 현재 사용자 정보 가져오기
      const userInfo = localStorage.getItem('user-info');
      if (!userInfo) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }
      
      const userData = JSON.parse(userInfo);
      const userIndex = userData.user_index;
      console.log('사용자 정보:', userData);
      console.log('userIndex:', userIndex);
      
      // 비밀번호 변경 API 호출
      console.log('API 호출 시작...');
      const response = await changePassword(formData, userIndex);
      console.log('API 응답:', response);
      
      if (response.data && response.status === 200) {
        console.log('비밀번호 변경 성공');
        showToast('success', '비밀번호가 성공적으로 변경되었습니다.');
        navigate('/mypage');
      } else {
        console.log('API 응답 오류:', response.data);
        throw new Error(response.data?.resultMessage || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      console.error('오류 상세:', error.response);
      const errorMessage = error.response?.data?.resultMessage || error.message || '비밀번호 변경에 실패했습니다.';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handlePasswordChange
  };
};

export default ChangePasswordFeature; 