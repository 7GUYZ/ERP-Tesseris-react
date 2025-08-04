import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordFindApi } from '../../api/auth/TaekjunAuth';
import '../../styles/taekjun/PasswordFindPage.css';

const PasswordFindPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 이메일 인증 상태
  const [emailAuth, setEmailAuth] = useState({
    email: '',
    emailDomain: '',
    name: '',
    authCode: '',
    authToken: '',
    isVerified: false
  });

  // 새 패스워드 상태
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: ''
  });

  // 이메일 도메인 목록
  const emailDomains = [
    '@naver.com',
    '@gmail.com',
    '@daum.net',
    '@kakao.com'
  ];

  // 패스워드 찾기 인증 메일 발송
  const handleSendAuthEmail = async () => {
    // 입력값 검증 강화
    if (!emailAuth.email?.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!emailAuth.emailDomain) {
      setError('이메일 도메인을 선택해주세요.');
      return;
    }

    if (!emailAuth.name?.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    const fullEmail = emailAuth.email.trim() + emailAuth.emailDomain;
    const trimmedName = emailAuth.name.trim();
    
    // 디버깅용 로그 추가
    console.log('이메일 인증 요청 데이터:', {
      email: fullEmail,
      name: trimmedName,
      emailParts: {
        localPart: emailAuth.email,
        domain: emailAuth.emailDomain
      }
    });

    setLoading(true);
    setError('');

    try {
      const response = await passwordFindApi.sendPasswordFindAuthEmail({
        email: fullEmail,
        name: trimmedName
      });

      // 응답 데이터 로깅
      console.log('API 응답:', response);

      if (response.data.success) {
        setEmailAuth(prev => ({
          ...prev,
          authToken: response.data.authToken
        }));
        setSuccess('인증 메일이 발송되었습니다. 이메일을 확인해주세요.');
      } else {
        setError(response.data.message || '인증 메일 발송에 실패했습니다.');
      }
    } catch (err) {
      console.error('인증 메일 발송 오류:', err);
      console.error('오류 상세:', err.response?.data);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.resultMessage) {
        setError(err.response.data.resultMessage);
      } else {
        setError('인증 메일 발송 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 이메일 인증 코드 검증
  const handleVerifyAuthCode = async () => {
    if (!emailAuth.authCode) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await passwordFindApi.verifyPasswordFindAuthEmail({
        email: emailAuth.email + emailAuth.emailDomain,
        name: emailAuth.name,
        authCode: emailAuth.authCode,
        authToken: emailAuth.authToken
      });

      if (response.data.success && response.data.isValid) {
        setEmailAuth(prev => ({ ...prev, isVerified: true }));
        setSuccess('이메일 인증이 완료되었습니다.');
        setTimeout(() => setCurrentStep(2), 1000);
      } else {
        setError('인증 코드가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('인증 코드 검증 오류:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('인증 코드 검증 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 패스워드 변경
  const handleChangePassword = async () => {
    if (!newPassword.password || !newPassword.confirmPassword) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword.password !== newPassword.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await passwordFindApi.changePassword({
        email: emailAuth.email + emailAuth.emailDomain,
        name: emailAuth.name,
        authCode: emailAuth.authCode,
        authToken: emailAuth.authToken,
        newPassword: newPassword.password
      });

      if (response.data.success) {
        setSuccess('비밀번호가 성공적으로 변경되었습니다.');
        // 성공 알림창 표시 후 페이지 이동
        alert('비밀번호가 성공적으로 변경되었습니다!');
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setError(response.data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('비밀번호 변경 오류:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('비밀번호 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-find-container">
      <div className="password-find-card">
        <h1 className="password-find-title">비밀번호 찾기</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Step 1: 이메일 인증 */}
        {currentStep === 1 && (
          <div className="password-find-step">
            <h2 className="step-title">이메일 인증</h2>
            <p className="step-description">
              가입 시 등록한 이메일과 이름을 입력하시면 인증 메일을 발송해드립니다.
            </p>
            
            <div className="email-auth-section">
              <div className="input-group">
                <label>이름</label>
                <input
                  type="text"
                  value={emailAuth.name}
                  onChange={(e) => setEmailAuth(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="가입 시 등록한 이름을 입력하세요"
                />
              </div>
              
              <div className="input-group">
                <label>이메일</label>
                <div className="email-input-group">
                  <input
                    type="text"
                    value={emailAuth.email}
                    onChange={(e) => setEmailAuth(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="이메일 주소를 입력하세요"
                  />
                  <select
                    value={emailAuth.emailDomain}
                    onChange={(e) => setEmailAuth(prev => ({ ...prev, emailDomain: e.target.value }))}
                    className="email-domain-select"
                  >
                    <option value="">도메인 선택</option>
                    {emailDomains.map((domain, index) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="auth-button"
                    onClick={handleSendAuthEmail}
                    disabled={loading || !emailAuth.email || !emailAuth.emailDomain || !emailAuth.name}
                  >
                    {loading ? '발송 중...' : '인증 메일 발송'}
                  </button>
                </div>
              </div>
              
              {emailAuth.authToken && (
                <div className="input-group">
                  <label>인증 코드</label>
                  <div className="auth-code-group">
                    <input
                      type="text"
                      value={emailAuth.authCode}
                      onChange={(e) => setEmailAuth(prev => ({ ...prev, authCode: e.target.value }))}
                      placeholder="인증 코드를 입력하세요"
                    />
                    <button 
                      className="verify-button"
                      onClick={handleVerifyAuthCode}
                      disabled={loading || !emailAuth.authCode}
                    >
                      {loading ? '인증 중...' : '인증 확인'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: 새 비밀번호 설정 */}
        {currentStep === 2 && (
          <div className="password-find-step">
            <h2 className="step-title">새 비밀번호 설정</h2>
            <p className="step-description">
              새로운 비밀번호를 입력해주세요.
            </p>
            
            <div className="password-section">
              <div className="input-group">
                <label>새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword.password}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                />
              </div>
              
              <div className="input-group">
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={newPassword.confirmPassword}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
              
              <button 
                className="change-password-button"
                onClick={handleChangePassword}
                disabled={loading || !newPassword.password || !newPassword.confirmPassword}
              >
                {loading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </div>
          </div>
        )}

        <div className="back-to-login">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordFindPage; 