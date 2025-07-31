import React, { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import CustomButton from "../../components/ui/deokkyu/Deoktton"
import Circle from "../../components/forms/deokkyu/registerstore/Circle"
import AgreementItem from "../../components/forms/deokkyu/registerstore/AgreementItem"
import { useNavigate } from "react-router-dom"
import "../../styles/deokkyu/Registercommon.css"
import "../../styles/deokkyu/RegisterStore1.css"

export default function RegisterStore1() {

  const navigate = useNavigate()

  // 비정상 종료 시 localStorage 정리
  useEffect(() => {
          const cleanupLocalStorage = () => {
        console.log('🧹 RegisterStore1: 비정상 종료 감지 - localStorage 정리')
        localStorage.removeItem('register-store-temp')
        localStorage.removeItem('register-store-agreements')
        if (window.tempFormData) {
          delete window.tempFormData
        }
      }

    const handleBeforeUnload = (event) => {
      cleanupLocalStorage()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cleanupLocalStorage()
      }
    }

    const handlePageHide = () => {
      cleanupLocalStorage()
    }

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    // 클린업 함수
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [])

  const handleApplyClick = () => {
    // 약관 동의 데이터를 localStorage에 저장
    const agreementData = {
      agreements,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('register-store-agreements', JSON.stringify(agreementData))
    
    navigate('/registerstore2')
  }
  const handleCancelClick = () => {
    navigate('/registerstore0')
  }

  const [agreements, setAgreements] = useState({
    all: false,
    required1: false,
    required2: false,
    optional1: false,
    optional2: false,
    optional3: false
  })

  // 전체 동의 처리
  const handleAllToggle = () => {
    const newValue = !agreements.all
    setAgreements({
      all: newValue,
      required1: newValue,
      required2: newValue,
      optional1: newValue,
      optional2: newValue,
      optional3: newValue
    })
  }

  const handleToggle = (key) => {
    const updated = { ...agreements, [key]: !agreements[key] }
    updated.all = updated.required1 && updated.required2 && updated.optional1 && updated.optional2 && updated.optional3
    setAgreements(updated)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <ChevronLeft onClick={handleCancelClick} className="back-icon" />
        <h1 className="header-title">가맹점 신청</h1>
        <div className="header-spacer" />
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className="step-circles">
          <Circle filled />
          <Circle />
          <Circle />
        </div>
      </div>

      {/* Main Text */}
      <div className="agreement-content">
        <div className="main-text-section">
          <h2>지금 바로 씨엠바터를 시작해 보세요!</h2>
          <p>모두 동의해 주셔야 다음 페이지로 이동 가능합니다.</p>
        </div>

        {/* 전체 동의 */}
        <AgreementItem
          checked={agreements.all}
          onClick={handleAllToggle}
          title="모든 약관 동의"
          description="전체동의는 필수 및 선택정보에 대한 동의도 포함되어 있으며, 개별적으로도 동의를 선택하실 수 있습니다. 선택약관에 대한 동의를 거부하시는 경우에도 서비스는 이용이 가능합니다."
          bold
        />

        <div className="divider" />

        {/* 개별 약관 */}
        <AgreementItem
          checked={agreements.required1}
          onClick={() => handleToggle("required1")}
          title="[필수] CM바터 가맹점 이용약관 동의"
        />
        <AgreementItem
          checked={agreements.required2}
          onClick={() => handleToggle("required2")}
          title="[필수] 개인정보 수집 및 이용 동의"
        />
        <AgreementItem
          checked={agreements.optional1}
          onClick={() => handleToggle("optional1")}
          title="[선택] 마케팅 정보 수집/이용 동의"
        />
        <AgreementItem
          checked={agreements.optional2}
          onClick={() => handleToggle("optional2")}
          title="[선택] 광고성 정보 수신 동의"
        />
        <AgreementItem
          checked={agreements.optional3}
          onClick={() => handleToggle("optional3")}
          title="[선택] 위치기반서비스 이용약관 동의"
        />
      </div>

      {/* 확인 버튼 */}
      <div className="bottom-button-container">
        <CustomButton onClick={handleApplyClick} disabled={!agreements.required1 || !agreements.required2}>
          확인
        </CustomButton>
      </div>
    </div>
  )
}
