import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupApi } from '../../api/auth/TaekjunAuth';
import '../../styles/taekjun/SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: 약관 동의 상태
  const [agreements, setAgreements] = useState({
    allAgree: false,
    serviceAgree: false,
    privacyAgree: false,
    marketingAgree: false,
    advertisementAgree: false,
    locationAgree: false
  });

  // Step 2: 이메일 인증 상태
  const [emailAuth, setEmailAuth] = useState({
    email: '',
    emailDomain: '',
    name: '',
    authCode: '',
    authToken: '',
    isVerified: false
  });

  // Step 3: 사용자 정보 상태
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    pin: '',
    referralId: '',
    email: '',
    emailDomain: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    zoneCode: '',
    address: '',
    detailAddress: '',
    birthday: '',
    userGenderIndex: null
  });

  // 추천인 검색
  const [referralSearch, setReferralSearch] = useState({
    searchValue: '',
    searchResults: [],
    isSearching: false,
    selectedReferrer: null
  });

  const handleReferralSearch = async () => {
    if (!referralSearch.searchValue.trim()) {
      setError('추천인을 검색할 내용을 입력해주세요.');
      return;
    }

    setReferralSearch(prev => ({ ...prev, isSearching: true }));
    setError('');

    try {
      const response = await signupApi.searchUser(referralSearch.searchValue);
      
      if (response.data && response.data.found) {
        setReferralSearch(prev => ({
          ...prev,
          searchResults: [response.data],
          isSearching: false
        }));
      } else {
        setReferralSearch(prev => ({
          ...prev,
          searchResults: [],
          isSearching: false
        }));
        setError('해당하는 추천인을 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('추천인 검색 오류:', err);
      setError('추천인 검색 중 오류가 발생했습니다.');
      setReferralSearch(prev => ({ ...prev, isSearching: false }));
    }
  };

  const handleSelectReferrer = (referrer) => {
    setReferralSearch(prev => ({
      ...prev,
      selectedReferrer: referrer,
      searchValue: referrer.email,
      searchResults: []
    }));
    setUserInfo(prev => ({ ...prev, referralId: referrer.email }));
  };


  // 카카오 주소 API 스크립트 로드
  useEffect(() => {
    const loadKakaoScript = () => {
      if (window.daum && window.daum.Postcode) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        if (document.getElementById('kakao-address-script')) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.id = 'kakao-address-script';
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadKakaoScript().catch(console.error);
  }, []);

  // 전체 동의 처리
  const handleAllAgree = (checked) => {
    setAgreements({
      allAgree: checked,
      serviceAgree: checked,
      privacyAgree: checked,
      marketingAgree: checked,
      advertisementAgree: checked,
      locationAgree: checked
    });
  };

  // 개별 약관 동의 처리
  const handleAgreementChange = (key, checked) => {
    const newAgreements = { ...agreements, [key]: checked };
    
    // 전체 동의 상태 업데이트
    newAgreements.allAgree = newAgreements.serviceAgree && 
                             newAgreements.privacyAgree && 
                             newAgreements.marketingAgree && 
                             newAgreements.advertisementAgree && 
                             newAgreements.locationAgree;
    
    setAgreements(newAgreements);
  };

  // Step 1 완료 처리
  const handleStep1Complete = () => {
    if (!agreements.serviceAgree || !agreements.privacyAgree) {
      setError('필수 약관에 동의해주세요.');
      return;
    }
    setCurrentStep(2);
    setError('');
  };

  // 이메일 도메인 목록
  const emailDomains = [
    '@naver.com',
    '@gmail.com',
    '@daum.net',
    '@kakao.com'

  ];

  // 이메일 인증 메일 발송
  const handleSendAuthEmail = async () => {
    if (!emailAuth.email || !emailAuth.emailDomain || !emailAuth.name) {
      setError('이메일과 이름을 입력해주세요.');
      return;
    }

    const fullEmail = emailAuth.email + emailAuth.emailDomain;

    setLoading(true);
    setError('');

    try {
      const response = await signupApi.sendAuthEmail({
        email: fullEmail,
        name: emailAuth.name
      });

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
      if (err.response?.data?.message) {
        setError(err.response.data.message);
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
      const response = await signupApi.verifyAuthEmail({
        email: emailAuth.email,
        name: emailAuth.name,
        authCode: emailAuth.authCode,
        authToken: emailAuth.authToken
      });

      if (response.data.success && response.data.isValid) {
        setEmailAuth(prev => ({ ...prev, isVerified: true }));
        setSuccess('이메일 인증이 완료되었습니다.');
        // 인증된 이메일을 userInfo에 저장
        const fullEmail = emailAuth.email + emailAuth.emailDomain;
        setUserInfo(prev => ({ 
          ...prev, 
          email: fullEmail,
          emailDomain: emailAuth.emailDomain 
        }));
        setTimeout(() => setCurrentStep(3), 1000);
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

  // 카카오 주소 검색
  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      setError('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        // 각 주소의 노출 규칙에 따라 주소를 조합합니다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        let addr = ''; // 주소 변수
        let extraAddr = ''; // 참고항목 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else { // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if(data.userSelectedType === 'R'){
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if(data.buildingName !== '' && data.apartment === 'Y'){
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if(extraAddr !== ''){
            extraAddr = ' (' + extraAddr + ')';
          }
          // 조합된 참고항목을 해당 필드에 넣는다.
          // addr += extraAddr;
        } else {
          // addr += ' ';
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        setUserInfo(prev => ({
          ...prev,
          zoneCode: data.zonecode,
          address: addr,
          detailAddress: ''
        }));
        
        setSuccess('주소가 선택되었습니다.');
      },
      onclose: function(state) {
        // 사용자가 검색 결과를 선택하지 않고 팝업을 닫았을 때
        if (state === 'FORCE_CLOSE') {
          setError('주소 검색이 취소되었습니다.');
        } else if (state === 'COMPLETE_CLOSE') {
          // 정상적으로 주소를 선택한 경우는 oncomplete에서 처리됨
        }
      }
    }).open();
  };

  // 최종 회원가입
  const handleFinalSignup = async () => {
    // 유효성 검사
    if (!userInfo.email || !userInfo.password || !userInfo.nickname || !userInfo.phone || !userInfo.pin) {
      setError('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 비밀번호 6자 이상
    if (userInfo.password.length < 6) {
      setError('비밀번호는 6자 이상 입력해주세요.');
      return;
    }
    // 비밀번호가 숫자만으로 이루어진 경우
    if (/^\d+$/.test(userInfo.password)) {
      setError('비밀번호는 숫자만 사용할 수 없습니다.');
      return;
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (userInfo.pin.length !== 6) {
      setError('핀번호는 6자리로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 백엔드 Step3UserInfoDTO 구조에 맞게 데이터 구성
      const signupData = {
        name: userInfo.name,
        phone: userInfo.phone,
        pin: userInfo.pin,
        referralId: userInfo.referralId || null,
        email: userInfo.email,
        password: userInfo.password,
        nickname: userInfo.nickname,
        zoneCode: userInfo.zoneCode || null,
        address: userInfo.address || null,
        detailAddress: userInfo.detailAddress || null,
        birthday: userInfo.birthday || null,
        userGenderIndex: userInfo.userGenderIndex || null
      };

      const response = await signupApi.finalSignup(signupData);

      if (response.data.success) {
        // 백엔드에서 자동으로 추천인 관계 생성 및 포인트 지급 처리
        if (userInfo.referralId) {
          alert('회원가입이 성공적으로 완료되었습니다!\n추천인과 함께 10,000cm를 받았습니다!');
        } else {
          alert('회원가입이 성공적으로 완료되었습니다!');
        }
        
        // 로그인 페이지로 이동
        navigate('/');
      } else {
        setError(response.data.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 이메일 중복확인
  const handleEmailBlur = async () => {
    if (!userInfo.email) return;
    setLoading(true);
    setError('');
    try {
      const res = await signupApi.checkDuplicate({ email: userInfo.email });
      if (res.data.emailExists) {
        setError('이미 사용 중인 이메일입니다.');
      }
    } catch (e) {
      console.error('이메일 중복확인 오류:', e);
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError('이메일 중복확인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 닉네임 중복확인
  const handleNicknameBlur = async () => {
    if (!userInfo.nickname) return;
    setLoading(true);
    setError('');
    try {
      const res = await signupApi.checkDuplicate({ nickname: userInfo.nickname });
      if (res.data.nicknameExists) {
        setError('이미 사용 중인 닉네임입니다.');
      }
    } catch (e) {
      console.error('닉네임 중복확인 오류:', e);
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError('닉네임 중복확인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        
        {/* 진행 단계 표시 */}
        <div className="signup-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">약관 동의</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">이메일 인증</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">정보 입력</span>
          </div>
        </div>

        {/* 에러/성공 메시지 */}
        {error && <div className="signup-error">{error}</div>}
        {success && <div className="signup-success">{success}</div>}

        {/* Step 1: 약관 동의 */}
        {currentStep === 1 && (
          <div className="signup-step">
            <h2 className="step-title">약관 동의</h2>
            
            <div className="agreement-section">
              <div className="agreement-item">
                <input
                  type="checkbox"
                  id="allAgree"
                  checked={agreements.allAgree}
                  onChange={(e) => handleAllAgree(e.target.checked)}
                />
                <label htmlFor="allAgree">전체 동의</label>
              </div>
              
              <div className="agreement-item">
                <input
                  type="checkbox"
                  id="serviceAgree"
                  checked={agreements.serviceAgree}
                  onChange={(e) => handleAgreementChange('serviceAgree', e.target.checked)}
                />
                <label htmlFor="serviceAgree">서비스 이용약관 동의 (필수)</label>
              </div>
              
              <div className="agreement-item">
                <input
                  type="checkbox"
                  id="privacyAgree"
                  checked={agreements.privacyAgree}
                  onChange={(e) => handleAgreementChange('privacyAgree', e.target.checked)}
                />
                <label htmlFor="privacyAgree">개인정보 수집 및 이용 동의 (필수)</label>
              </div>
              
              <div className="agreement-item">
                <input
                  type="checkbox"
                  id="marketingAgree"
                  checked={agreements.marketingAgree}
                  onChange={(e) => handleAgreementChange('marketingAgree', e.target.checked)}
                />
                <label htmlFor="marketingAgree">마케팅 정보 수집/이용 동의 (선택)</label>
              </div>
              
              <div className="agreement-item">
                <input
                  type="checkbox"
                  id="advertisementAgree"
                  checked={agreements.advertisementAgree}
                  onChange={(e) => handleAgreementChange('advertisementAgree', e.target.checked)}
                />
                <label htmlFor="advertisementAgree">광고성 정보 수신 동의 (선택)</label>
              </div>
              
              <div className="agreement-item">
                <input
                  type="checkbox"
                  id="locationAgree"
                  checked={agreements.locationAgree}
                  onChange={(e) => handleAgreementChange('locationAgree', e.target.checked)}
                />
                <label htmlFor="locationAgree">위치기반서비스 이용약관 동의 (선택)</label>
              </div>
            </div>
            
            <button 
              className="signup-button"
              onClick={handleStep1Complete}
              disabled={!agreements.serviceAgree || !agreements.privacyAgree}
            >
              다음 단계
            </button>
          </div>
        )}

        {/* Step 2: 이메일 인증 */}
        {currentStep === 2 && (
          <div className="signup-step">
            <h2 className="step-title">이메일 인증</h2>
            
            <div className="email-auth-section">
              <div className="input-group">
                <label>이름</label>
                <input
                  type="text"
                  value={emailAuth.name}
                  onChange={(e) => setEmailAuth(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="이름을 입력하세요"
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
            
            <button 
              className="signup-button"
              onClick={() => setCurrentStep(3)}
              disabled={!emailAuth.isVerified}
            >
              다음 단계
            </button>
          </div>
        )}

        {/* Step 3: 사용자 정보 입력 */}
        {currentStep === 3 && (
          <div className="signup-step">
            <h2 className="step-title">사용자 정보 입력</h2>
            
            <div className="user-info-section">
              <div className="input-group">
                <label>이름</label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <div className="input-group">
                <label>휴대폰 번호</label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="휴대폰 번호를 입력하세요"
                />
              </div>
              
              <div className="input-group">
                <label>핀번호 (6자리)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={userInfo.pin}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, pin: e.target.value }))}
                  placeholder="6자리 핀번호를 입력하세요"
                />
              </div>
              
              <div className="input-group">
                <label>이메일 (아이디)</label>
                <input
                  type="email"
                  value={userInfo.email}
                  readOnly
                  placeholder="이메일을 입력하세요"
                  onBlur={handleEmailBlur}
                />
              </div>
              
              <div className="input-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  value={userInfo.password}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              <div className="input-group">
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  value={userInfo.confirmPassword}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
              
              <div className="input-group">
                <label>닉네임</label>
                <input
                  type="text"
                  value={userInfo.nickname}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, nickname: e.target.value }))}
                  placeholder="닉네임을 입력하세요"
                  onBlur={handleNicknameBlur}
                />
              </div>
              
              <div className="input-group">
                <label>추천인 (선택)</label>
                <div className="referral-search-group">
                  <input
                    type="text"
                    value={referralSearch.searchValue}
                    onChange={(e) => setReferralSearch(prev => ({ ...prev, searchValue: e.target.value }))}
                    placeholder="추천인을 검색하세요"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleReferralSearch();
                      }
                    }}
                  />
                  <button 
                    className="search-button"
                    onClick={handleReferralSearch}
                    disabled={loading || !referralSearch.searchValue}
                  >
                    {loading ? '검색 중...' : '검색'}
                  </button>
                </div>
                {referralSearch.isSearching && (
                  <div className="search-results">
                    {referralSearch.searchResults.map((referrer, index) => (
                      <div
                        key={index}
                        className="search-result-item"
                        onClick={() => handleSelectReferrer(referrer)}
                      >
                        {referrer.email}
                      </div>
                    ))}
                    {referralSearch.searchResults.length === 0 && (
                      <div className="search-result-item">검색 결과가 없습니다.</div>
                    )}
                  </div>
                )}
                {referralSearch.selectedReferrer && (
                  <div className="selected-referrer">
                    선택된 추천인: {referralSearch.selectedReferrer.email}
                  </div>
                )}
              </div>
              
              <div className="input-group">
                <label>생일 (선택)</label>
                <input
                  type="date"
                  value={userInfo.birthday}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, birthday: e.target.value }))}
                  placeholder="생일을 선택하세요"
                />
              </div>
              
              <div className="input-group">
                <label>성별 (선택)</label>
                <select
                  value={userInfo.userGenderIndex || ''}
                  onChange={(e) => setUserInfo(prev => ({ 
                    ...prev, 
                    userGenderIndex: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                >
                  <option value="">성별을 선택하세요</option>
                  <option value="1">남성</option>
                  <option value="2">여성</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>주소</label>
                <div className="address-input-group">
                  <input
                    type="text"
                    value={userInfo.zoneCode}
                    placeholder="우편번호"
                    readOnly
                  />
                  <button 
                    className="address-search-button"
                    onClick={handleAddressSearch}
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  type="text"
                  value={userInfo.address}
                  placeholder="기본주소"
                  readOnly
                />
                <input
                  type="text"
                  value={userInfo.detailAddress}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, detailAddress: e.target.value }))}
                  placeholder="상세주소"
                />
              </div>
            </div>
            
            <button 
              className="signup-button"
              onClick={handleFinalSignup}
              disabled={loading}
            >
              {loading ? '가입 중...' : '회원가입 완료'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage; 