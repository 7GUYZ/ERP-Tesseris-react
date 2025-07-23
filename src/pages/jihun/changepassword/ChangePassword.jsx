import React from 'react';
import ChangePasswordLayout from '../../../components/layout/jihun/changepassword/ChangePasswordLayout';
import ChangePasswordForm from '../../../components/forms/jihun/changepassword/ChangePasswordForm';
import ChangePasswordFeature from '../../../components/feature/jihun/changepassword/ChangePasswordFeature';
import ErrorMessage from '../../../components/ui/jihun/changepassword/ErrorMessage';

const ChangePassword = () => {
  const { loading, error, handlePasswordChange } = ChangePasswordFeature();

  return (
    <ChangePasswordLayout>
      <ErrorMessage 
        message={error} 
        onClose={() => {}} // 에러 메시지 자동으로 사라지도록 설정
      />
      <ChangePasswordForm 
        onSubmit={handlePasswordChange}
        loading={loading}
      />
    </ChangePasswordLayout>
  );
};

export default ChangePassword; 