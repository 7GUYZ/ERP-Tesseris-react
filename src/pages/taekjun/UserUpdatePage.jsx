import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaekjunAuth } from '../../api/auth/TaekjunAuth';
import '../../styles/taekjun/UserUpdatePage.css';

const UserUpdatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bankList, setBankList] = useState([]);
  
  // 폼 상태
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    userAddress: '',
    userDetailAddress: '',
    userZipCode: '',
    userBankName: '',
    userBankNumber: '',
    userBankHolder: ''
  });

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

  // 현재 사용자 정보 조회
  useEffect(() => {
    fetchUserInfo();
    fetchBankList();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('사용자 정보 조회 시작...');
      const response = await TaekjunAuth.getUserInfo();
      console.log('API 응답:', response);
      
      if (response.data.resultCode === 200) {
        const userData = response.data.data;
        console.log('사용자 데이터:', userData);
        setFormData({
          userName: userData.userName || '',
          userPhone: userData.userPhone || '',
          userEmail: userData.userEmail || '',
          userAddress: userData.userAddress || '',
          userDetailAddress: userData.userDetailAddress || '',
          userZipCode: userData.userZipCode || '',
          userBankName: userData.userBankName || '',
          userBankNumber: userData.userBankNumber || '',
          userBankHolder: userData.userBankHolder || ''
        });
      } else {
        console.error('API 오류:', response.data);
        setError(response.data.resultMessage || '사용자 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('사용자 정보 조회 오류:', err);
      console.error('오류 상세:', err.response?.data);
      setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBankList = async () => {
    try {
      const response = await TaekjunAuth.getBankList();
      if (response.data.resultCode === 200) {
        setBankList(response.data.data);
      } else {
        console.error('은행 목록 조회 오류:', response.data);
      }
    } catch (err) {
      console.error('은행 목록 조회 오류:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 카카오 주소 검색 (SignupPage와 동일한 방식)
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
        setFormData(prev => ({
          ...prev,
          userZipCode: data.zonecode,
          userAddress: addr,
          userDetailAddress: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await TaekjunAuth.updateUserInfo(formData);
      
      if (response.data.resultCode === 200) {
        setSuccess('정보가 성공적으로 수정되었습니다.');
        setTimeout(() => {
          navigate(-1); // 이전 페이지로 돌아가기
        }, 2000);
      } else {
        setError(response.data.resultMessage || '정보 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('정보 수정 오류:', err);
      setError('정보 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading && !formData.userName) {
    return (
      <div className="user-update-container">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="user-update-container">
      <div className="user-update-header">
        <h1>내정보 수정</h1>
        <p>개인정보를 수정할 수 있습니다. (PIN번호와 패스워드는 제외)</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="user-update-form">
        <div className="form-group">
          <label htmlFor="userName">이름 *</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            required
            className="form-input"
            placeholder="이름을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userPhone">전화번호 *</label>
          <input
            type="tel"
            id="userPhone"
            name="userPhone"
            value={formData.userPhone}
            onChange={handleInputChange}
            required
            className="form-input"
            placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userEmail">이메일</label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
            className="form-input"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userZipCode">우편번호</label>
          <div className="address-search-container">
            <input
              type="text"
              id="userZipCode"
              name="userZipCode"
              value={formData.userZipCode}
              onChange={handleInputChange}
              className="form-input"
              placeholder="우편번호를 입력하세요"
              readOnly
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="address-search-button"
            >
              주소 검색
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userAddress">주소</label>
          <input
            type="text"
            id="userAddress"
            name="userAddress"
            value={formData.userAddress}
            onChange={handleInputChange}
            className="form-input"
            placeholder="주소를 입력하세요"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="userDetailAddress">상세주소</label>
          <input
            type="text"
            id="userDetailAddress"
            name="userDetailAddress"
            value={formData.userDetailAddress}
            onChange={handleInputChange}
            className="form-input"
            placeholder="상세주소를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userBankName">은행명</label>
          <select
            id="userBankName"
            name="userBankName"
            value={formData.userBankName}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">은행을 선택하세요</option>
            {bankList.map((bank, index) => (
              <option key={index} value={bank.user_bank_name}>
                {bank.user_bank_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="userBankNumber">계좌번호</label>
          <input
            type="text"
            id="userBankNumber"
            name="userBankNumber"
            value={formData.userBankNumber}
            onChange={handleInputChange}
            className="form-input"
            placeholder="계좌번호를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userBankHolder">예금주명</label>
          <input
            type="text"
            id="userBankHolder"
            name="userBankHolder"
            value={formData.userBankHolder}
            onChange={handleInputChange}
            className="form-input"
            placeholder="예금주명을 입력하세요"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserUpdatePage; 