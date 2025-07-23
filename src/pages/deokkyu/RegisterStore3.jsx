import React, { useState, useEffect, useCallback } from "react"
import { ChevronLeft } from "lucide-react"
import CustomButton from "../../components/ui/deokkyu/Deoktton"
import Circle from "../../components/forms/deokkyu/registerstore/Circle"
import { useNavigate, useLocation } from "react-router-dom"
import "../../styles/deokkyu/Registercommon.css"
import "../../styles/deokkyu/RegisterStore3.css"

export default function RegisterStore3() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 결제 관련 상태
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('pending') // pending, success, failed
  
  // 가맹비 정보
  const franchiseFee = 10000
  
  // 이전 페이지에서 전달받은 데이터
  const [storeData, setStoreData] = useState(null)
  
  // 페이지 로드 시 이전 데이터 확인
  useEffect(() => {
    const tempData = localStorage.getItem('register-store-temp')
    if (!tempData) {
      alert('이전 단계 정보가 없습니다. 처음부터 다시 진행해주세요.')
      navigate('/registerstore0')
      return
    }
    
    try {
      const parsedData = JSON.parse(tempData)
      setStoreData(parsedData)
    } catch (error) {
      console.error('데이터 파싱 오류:', error)
      alert('데이터 처리 중 오류가 발생했습니다.')
      navigate('/registerstore0')
    }
  }, [navigate])

  // 뒤로가기 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // 토스페이먼츠 결제 처리
  const handlePayment = async () => {
    if (!storeData) {
      alert('결제 정보를 불러올 수 없습니다.')
      return
    }

    setIsLoading(true)
    
    try {
      // 1. 결제 요청 생성 (서버에 결제 요청)
      const paymentRequest = await createPaymentRequest()
      
      // 2. 토스페이먼츠 결제창 열기
      const tossPayments = window.TossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY)
      
      await tossPayments.requestPayment('카드', {
        amount: franchiseFee,
        orderId: paymentRequest.orderId,
        orderName: '가맹점 신청비',
        customerName: storeData.userInfo.name,
        customerEmail: storeData.userInfo.email || 'customer@example.com',
        successUrl: `${window.location.origin}/registerstore3/success`,
        failUrl: `${window.location.origin}/registerstore3/fail`,
      })
      
    } catch (error) {
      console.error('결제 오류:', error)
      setPaymentStatus('failed')
      alert('결제 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 서버에 결제 요청 생성
  const createPaymentRequest = async () => {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
        body: JSON.stringify({
          amount: franchiseFee,
          orderName: '가맹점 신청비',
          customerName: storeData.userInfo.name,
          customerEmail: storeData.userInfo.email || 'customer@example.com'
        })
      })
      
      if (!response.ok) {
        throw new Error('결제 요청 생성 실패')
      }
      
      return await response.json()
    } catch (error) {
      console.error('결제 요청 오류:', error)
      throw error
    }
  }

  // 가맹점 정보 서버 저장
  const saveStoreData = useCallback(async () => {
    try {
      const formData = new FormData()
      
      // 신청자 정보
      formData.append('userName', storeData.userInfo.name)
      formData.append('userPhone', storeData.userInfo.phone)
      
      // 사업자 등록 정보
      formData.append('storeRegistrationNum', storeData.businessInfo.storeRegistrationNum)
      formData.append('storeCorporateName', storeData.businessInfo.storeCorporateName)
      formData.append('storeBossName', storeData.businessInfo.storeBossName)
      formData.append('storeTypeTaxation', storeData.businessInfo.storeTypeTaxation)
      
      if (storeData.businessInfo.storeBusinessLicensePhoto) {
        formData.append('storeBusinessLicensePhoto', storeData.businessInfo.storeBusinessLicensePhoto)
      }
      
      // 가맹점 등록 정보
      formData.append('store_name', storeData.storeInfo.store_name)
      formData.append('store_phone', storeData.storeInfo.store_phone)
      formData.append('store_postcode', storeData.storeInfo.store_postcode)
      formData.append('store_address', storeData.storeInfo.store_address)
      formData.append('store_detail_address', storeData.storeInfo.store_detail_address)
      formData.append('storeSite', storeData.storeInfo.storeSite)
      formData.append('hasManager', storeData.storeInfo.hasManager)
      formData.append('managerId', storeData.storeInfo.managerId)
      
      if (storeData.storeInfo.storeSignPhoto) {
        formData.append('storeSignPhoto', storeData.storeInfo.storeSignPhoto)
      }
      
      if (storeData.storeInfo.storeFrontPhoto) {
        formData.append('storeFrontPhoto', storeData.storeInfo.storeFrontPhoto)
      }
      
      const response = await fetch('/api/store/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('가맹점 정보 저장 실패')
      }
      
    } catch (error) {
      console.error('가맹점 정보 저장 오류:', error)
      throw error
    }
  }, [storeData])

  // 결제 성공 처리
  const handlePaymentSuccess = useCallback(async (paymentKey, orderId, amount) => {
    try {
      // 1. 결제 승인 요청
      const confirmResponse = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount
        })
      })
      
      if (!confirmResponse.ok) {
        throw new Error('결제 승인 실패')
      }
      
      // 2. 가맹점 정보 서버에 저장
      await saveStoreData()
      
      // 3. 성공 처리
      setPaymentStatus('success')
      localStorage.removeItem('register-store-temp') // 임시 데이터 삭제
      
      alert('가맹점 신청이 완료되었습니다!')
      navigate('/main')
      
    } catch (error) {
      console.error('결제 승인 오류:', error)
      setPaymentStatus('failed')
      alert('결제 승인 중 오류가 발생했습니다.')
    }
  }, [navigate, saveStoreData])

  // 뒤로가기 처리
  const handleCancelClick = () => {
    if (window.confirm('가맹점 신청을 취소하시겠습니까? 입력한 정보가 모두 사라집니다.')) {
      localStorage.removeItem('register-store-temp')
      navigate('/registerstore0')
    }
  }

  // URL 파라미터로 결제 결과 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const paymentKey = urlParams.get('paymentKey')
    const orderId = urlParams.get('orderId')
    const amount = urlParams.get('amount')
    
    if (paymentKey && orderId && amount) {
      handlePaymentSuccess(paymentKey, orderId, parseInt(amount))
    }
  }, [location.search, handlePaymentSuccess])

  // 토스페이먼츠 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v1'
    script.async = true
    document.head.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://js.tosspayments.com/v1"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  if (!storeData) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>결제 정보를 불러오는 중...</p>
        </div>
      </div>
    )
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
          <Circle filled />
          <Circle filled />
        </div>
      </div>

      {/* Main Content */}
      <div className="payment-content">
        {/* 결제 정보 섹션 */}
        <div className="payment-section">
          <h2 className="section-title">결제 정보</h2>
          
          <div className="payment-info">
            <div className="info-row">
              <span className="info-label">신청자</span>
              <span className="info-value">{storeData.userInfo.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">가게명</span>
              <span className="info-value">{storeData.storeInfo.store_name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">결제 금액</span>
              <span className="info-value amount">{franchiseFee.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 결제 방법 섹션 */}
        <div className="payment-section">
          <h2 className="section-title">결제 방법</h2>
          
          <div className="payment-method">
            <div className="method-item selected">
              <div className="method-icon">💳</div>
              <div className="method-info">
                <div className="method-name">신용카드</div>
                <div className="method-description">토스페이먼츠를 통한 안전한 결제</div>
              </div>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="payment-section">
          <h2 className="section-title">주의사항</h2>
          
          <div className="notice-list">
            <div className="notice-item">
              <span className="notice-number">1.</span>
              <span>가맹비는 환불되지 않습니다.</span>
            </div>
            <div className="notice-item">
              <span className="notice-number">2.</span>
              <span>결제 완료 후 가맹점 심사가 진행됩니다.</span>
            </div>
            <div className="notice-item">
              <span className="notice-number">3.</span>
              <span>심사 결과는 3-5일 내에 연락드립니다.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 버튼 */}
      <div className="bottom-button-container">
        <CustomButton 
          onClick={handlePayment} 
          disabled={isLoading || paymentStatus === 'success'}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? '결제 처리 중...' : `${franchiseFee.toLocaleString()}원 결제하기`}
        </CustomButton>
      </div>
    </div>
  )
} 