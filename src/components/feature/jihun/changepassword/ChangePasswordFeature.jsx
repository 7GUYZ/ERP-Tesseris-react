import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../../../api/auth/JihunAuth';

const ChangePasswordFeature = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await changePassword(formData, JSON.parse(localStorage.getItem('user-info')).user_index);
      console.log(response);
      if (response.status === 200 || response.data.includes('패스워드가 성공적으로 변경되었습니다.')) {
        // 성공 시 처리
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate(-1); // 이전 페이지로 이동
      } else {
        setError(response.data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('비밀번호 변경 오류:', err);
      if (err && err.response.data.includes('현재 패스워드를 확인하거나')) {
        setError('현재 비밀번호가 올바르지 않습니다.');
      } else {
        setError('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
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