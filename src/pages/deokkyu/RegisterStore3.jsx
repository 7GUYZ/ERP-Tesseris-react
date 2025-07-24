import React, { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import Circle from "../../components/forms/deokkyu/registerstore/Circle"
import { useNavigate, useLocation } from "react-router-dom"
import PaymentCalculator from "../../components/features/deokkyu/payment/PaymentCalculator"
import PaymentLayout from "../../components/layout/deokkyu/payment/PaymentLayout"
import PaymentInfoForm from "../../components/forms/deokkyu/payment/PaymentInfoForm"
import PaymentMethodForm from "../../components/forms/deokkyu/payment/PaymentMethodForm"
import PaymentNotice from "../../components/ui/deokkyu/payment/PaymentNotice"
import PaymentButton from "../../components/ui/deokkyu/payment/PaymentButton"
import "../../styles/deokkyu/Registercommon.css"

export default function RegisterStore3() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 이전 페이지에서 전달받은 데이터
  const [storeData, setStoreData] = useState(null)
  
  // PaymentCalculator 사용
  const {
    franchiseFee,
    isLoading,
    paymentStatus,
    handleCardPayment,
    handlePaymentSuccess
  } = PaymentCalculator(storeData)
  
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
      
      // FormData 유효성 확인
      if (!window.tempFormData) {
        console.error('FormData가 없습니다. 이전 페이지로 돌아갑니다.')
        alert('폼 데이터가 유실되었습니다. 이전 단계부터 다시 진행해주세요.')
        navigate('/registerstore2')
        return
      }
    } catch (error) {
      console.error('데이터 파싱 오류:', error)
      alert('데이터 처리 중 오류가 발생했습니다.')
      navigate('/registerstore0')
    }
  }, [navigate])

  // URL 파라미터 확인 (결제 성공/실패 처리)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const paymentKey = urlParams.get('paymentKey')
    const orderId = urlParams.get('orderId')
    const amount = urlParams.get('amount')
    const failed = urlParams.get('failed')
    
    // 결제 성공 처리
    if (paymentKey && orderId && amount) {
      handlePaymentSuccess(paymentKey, orderId, parseInt(amount))
    }
    
    // 결제 실패/취소 처리 - 메인으로 이동
    if (failed === 'true') {
      alert('결제가 취소되었거나 실패했습니다.')
      
      // localStorage 정리
      localStorage.removeItem('register-store-temp')
      localStorage.removeItem('register-store-agreements')
      
      // FormData 정리
      if (window.tempFormData) {
        delete window.tempFormData
      }
      
      // 메인 페이지로 이동
      navigate('/main')
      return
    }
  }, [location.search, handlePaymentSuccess, navigate])

  // 뒤로가기 방지 (결제 중이 아닐 때만)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // 결제 중이거나 결제 성공 상태일 때는 경고하지 않음
      if (isLoading || paymentStatus === 'success') {
        return
      }
      
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isLoading, paymentStatus])

  // 뒤로가기 처리
  const handleCancelClick = () => {
    // 결제 중일 때는 뒤로가기 버튼도 비활성화
    if (isLoading) {
      alert('결제 처리 중입니다. 잠시만 기다려주세요.')
      return
    }
    
    if (window.confirm('가맹점 신청을 취소하시겠습니까? 입력한 정보가 모두 사라집니다.')) {
      localStorage.removeItem('register-store-temp')
      localStorage.removeItem('register-store-agreements')
      
      // FormData 정리
      if (window.tempFormData) {
        delete window.tempFormData
      }
      
      navigate('/registerstore0')
    }
  }

  // 토스페이먼츠 스크립트 로드
  useEffect(() => {
    const loadTossPaymentsScript = () => {
      return new Promise((resolve, reject) => {
        // 스크립트가 이미 로드되어 있는지 확인
        if (window.TossPayments) {
          console.log('토스페이먼츠 스크립트가 이미 로드되어 있습니다.')
          resolve()
          return
        }

        // 기존 스크립트 태그가 있는지 확인
        let existingScript = document.querySelector('script[src="https://js.tosspayments.com/v1"]')
        
        if (existingScript) {
          existingScript.onload = () => {
            console.log('기존 토스페이먼츠 스크립트 로드 완료')
            resolve()
          }
          existingScript.onerror = () => {
            console.error('기존 토스페이먼츠 스크립트 로드 실패')
            reject(new Error('토스페이먼츠 스크립트 로드 실패'))
          }
          return
        }

        // 새 스크립트 태그 생성
        const script = document.createElement('script')
        script.src = 'https://js.tosspayments.com/v1'
        script.async = true
        
        script.onload = () => {
          console.log('토스페이먼츠 스크립트 로드 완료')
          // 스크립트가 로드되었지만 TossPayments가 아직 사용 가능하지 않을 수 있음
          const checkTossPayments = () => {
            if (window.TossPayments) {
              resolve()
            } else {
              setTimeout(checkTossPayments, 100)
            }
          }
          checkTossPayments()
        }
        
        script.onerror = () => {
          console.error('토스페이먼츠 스크립트 로드 실패')
          reject(new Error('토스페이먼츠 스크립트 로드 실패'))
        }
        
        document.head.appendChild(script)
      })
    }

    loadTossPaymentsScript().catch(error => {
      console.error('토스페이먼츠 초기화 오류:', error)
      // 사용자에게 오류 상황을 알릴 수 있음
    })

    // 클린업 함수는 컴포넌트가 언마운트될 때만 실행
    return () => {
      // 스크립트 제거는 하지 않음 (다른 컴포넌트에서 사용할 수 있음)
    }
  }, [])

  // 비정상 종료 시 localStorage 정리
  useEffect(() => {
    const cleanupLocalStorage = () => {
      // 결제 중이거나 성공 상태일 때는 정리하지 않음 (정상적인 플로우)
      if (isLoading || paymentStatus === 'success') {
        return
      }
      
      console.log('🧹 RegisterStore3: 비정상 종료 감지 - localStorage 정리')
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
  }, [isLoading, paymentStatus])

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

      {/* Payment Content */}
      <PaymentLayout>
        <PaymentInfoForm 
          storeData={storeData}
          franchiseFee={franchiseFee}
        />
        
        <PaymentMethodForm />
        
        <PaymentNotice />
      </PaymentLayout>

      {/* Payment Button */}
      <PaymentButton 
        onClick={handleCardPayment}
        disabled={isLoading || paymentStatus === 'success'}
        loading={isLoading}
        franchiseFee={franchiseFee}
      />
    </div>
  )
} 