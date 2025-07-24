import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import CustomButton from "../../components/ui/deokkyu/Deoktton"
import "../../styles/deokkyu/Registercommon.css"
import "../../styles/deokkyu/RegisterComplete.css"

export default function RegisterComplete() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDataSaved, setIsDataSaved] = useState(false)

  // 페이지 로드 시 데이터 저장 확인
  useEffect(() => {
    // localStorage가 정리되었는지 확인
    const tempData = localStorage.getItem('register-store-temp')
    const agreementData = localStorage.getItem('register-store-agreements')
    
    if (!tempData && !agreementData) {
      setIsDataSaved(true)
      console.log('✅ 가맹점 신청 데이터가 성공적으로 저장되고 임시 데이터가 정리되었습니다.')
    } else {
      console.warn('⚠️ 임시 데이터가 아직 정리되지 않았습니다.')
      // 혹시 정리되지 않은 데이터가 있다면 여기서 정리
      if (tempData) localStorage.removeItem('register-store-temp')
      if (agreementData) localStorage.removeItem('register-store-agreements')
      setIsDataSaved(true)
    }

    // URL 파라미터 확인
    const urlParams = new URLSearchParams(location.search)
    const success = urlParams.get('success')
    
    if (success === 'true') {
      console.log('✅ 결제 성공으로 페이지에 도달했습니다.')
      // URL에서 success 파라미터 제거
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [location.search])

  const handleGoToMain = () => {
    navigate('/main')
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-spacer" />
        <h1 className="header-title">가맹점 신청</h1>
        <div className="header-spacer" />
      </div>

      {/* Main Content */}
      <div className="complete-content">
        {/* 성공 아이콘 */}
        <div className="success-icon-container">
          <div className="success-icon">✓</div>
        </div>

        {/* 완료 메시지 */}
        <div className="complete-message">
          <h2 className="complete-title">가맹점 신청이<br />완료되었습니다!</h2>
          <p className="complete-description">
            결제가 성공적으로 처리되었으며,<br />
            가맹점 심사가 시작됩니다.
          </p>
          {isDataSaved && (
            <p className="save-confirmation">
              ✅ 신청 정보가 안전하게 저장되었습니다.
            </p>
          )}
        </div>

        {/* 안내 정보 */}
        <div className="info-section">
          <h3 className="info-title">앞으로의 진행 과정</h3>
          <div className="info-list">
            <div className="info-item">
              <div className="info-step">1</div>
              <div className="info-content">
                <span className="info-label">서류 검토</span>
                <span className="info-desc">제출하신 서류를 검토합니다</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-step">2</div>
              <div className="info-content">
                <span className="info-label">현장 확인</span>
                <span className="info-desc">가맹점 현장을 확인합니다</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-step">3</div>
              <div className="info-content">
                <span className="info-label">최종 승인</span>
                <span className="info-desc">심사 완료 후 연락드립니다</span>
              </div>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="notice-section">
          <h3 className="notice-title">참고사항</h3>
          <div className="notice-list">
            <div className="notice-item">
              <span className="notice-number">•</span>
              <span>심사 결과는 3-5일 내에 연락드립니다.</span>
            </div>
            <div className="notice-item">
              <span className="notice-number">•</span>
              <span>추가 서류가 필요한 경우 별도 연락드립니다.</span>
            </div>
            <div className="notice-item">
              <span className="notice-number">•</span>
              <span>문의사항이 있으시면 고객센터로 연락주세요.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="bottom-button-container">
        <CustomButton onClick={handleGoToMain}>
          홈으로 가기
        </CustomButton>
      </div>
    </div>
  )
} 