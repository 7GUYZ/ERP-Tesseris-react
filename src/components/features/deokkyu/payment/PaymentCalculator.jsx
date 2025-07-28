import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaymentRequest, confirmPayment, registerStore } from '../../../../api/auth/DeokkyuAuth';

const PaymentCalculator = (storeData) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('pending') // pending, success, failed
  
  // 가맹비 정보
  const franchiseFee = 10000

  // 결제 금액 계산
  const calculatePaymentDetails = () => {
    return {
      amount: franchiseFee,
      orderName: '가맹점 신청비',
      customerName: storeData?.userInfo?.name || '고객',
      customerEmail: storeData?.userInfo?.email || 'customer@example.com'
    }
  }

  // 토스페이먼츠 결제 처리
  const handleCardPayment = async () => {
    if (!storeData) {
      alert('결제 정보를 불러올 수 없습니다.')
      return
    }

    // FormData 상태 확인
    console.log("=== 결제 시작 전 FormData 상태 확인 ===");
    console.log("window.tempFormData 존재 여부:", !!window.tempFormData);
    if (window.tempFormData) {
      console.log("FormData 내용:");
      for (let [key, value] of window.tempFormData.entries()) {
        console.log(`${key}:`, value);
      }
    } else {
      console.error("❌ FormData가 없습니다!");
    }

    // 결제 시작 이벤트 발생 (localStorage 보호)
    window.dispatchEvent(new CustomEvent('payment-start'));

    // 토스페이먼츠 스크립트 로드 확인
    if (!window.TossPayments) {
      alert('결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    // CLIENT_KEY 확인 및 검증
    const clientKey = 'test_ck_KNbdOvk5rkmna9Q6ZzJ23n07xlzm';
    
    console.log('환경 변수 확인:', {
      'REACT_APP_TOSS_CLIENT_KEY': process.env.REACT_APP_TOSS_CLIENT_KEY ? '설정됨' : '설정되지 않음',
      '사용할 키': clientKey.substring(0, 20) + '...'
    })
    
    // 클라이언트 키 형식 검증
    if (!clientKey || !clientKey.startsWith('test_ck_')) {
      alert('토스페이먼츠 클라이언트 키가 올바르지 않습니다. 환경 변수를 확인해주세요.')
      console.error('클라이언트 키 오류:', clientKey)
      return
    }

    // 모바일 환경 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    setIsLoading(true)
    
    try {
      // 1. 결제 요청 생성 (DeokkyuAuth 사용)
      const paymentRequestData = calculatePaymentDetails()
      
      console.log('결제 요청 데이터:', paymentRequestData)
      
      const paymentResponse = await createPaymentRequest(paymentRequestData)
      const paymentRequest = paymentResponse.data
      
      console.log('결제 요청 응답:', paymentRequest)
      
      // 2. 토스페이먼츠 초기화 및 검증
      let tossPayments
      try {
        tossPayments = window.TossPayments(clientKey)
        console.log('토스페이먼츠 초기화 성공')
      } catch (initError) {
        console.error('토스페이먼츠 초기화 오류:', initError)
        throw new Error(`토스페이먼츠 초기화 실패: ${initError.message}`)
      }
      
      // TossPayments 초기화 확인
      if (!tossPayments) {
        throw new Error('토스페이먼츠 초기화에 실패했습니다.')
      }
      
      // orderId가 없으면 임시로 생성
      const orderId = paymentRequest?.orderId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      console.log('결제 정보:', {
        amount: franchiseFee,
        orderId: orderId,
        orderName: '가맹점 신청비'
      })
      
      // 결제 옵션 설정 (모바일 앱 리디렉션 방지)
      const paymentOptions = {
        amount: franchiseFee,
        orderId: orderId,
        orderName: '가맹점 신청비',
        customerName: storeData.userInfo?.name || '고객',
        customerEmail: storeData.userInfo?.email || 'customer@example.com',
        successUrl: `${window.location.origin}/registercomplete?success=true`,
        failUrl: `${window.location.origin}/registerstore3?failed=true`,
        // 모바일 앱 리디렉션 방지 옵션
        flowMode: 'DEFAULT', // 기본 웹 결제 플로우 사용
        easyPay: null, // 간편결제 옵션 비활성화
        useAppCardOnly: false, // 앱카드만 사용하지 않음
        discountCode: null, // 할인코드 사용 안함
      }
      
      // 모바일에서 추가 옵션
      if (isMobile) {
        paymentOptions.mobileType = 'web' // 모바일에서도 웹으로 처리
        paymentOptions.appScheme = null // 앱 스키마 비활성화
      }
      
      console.log('최종 결제 옵션:', paymentOptions)
      
      await tossPayments.requestPayment('카드', paymentOptions)
      
    } catch (error) {
      console.error('결제 오류:', error)
      setPaymentStatus('failed')
      
      // 더 구체적인 오류 메시지
      if (error.message && error.message.includes('CLIENT_KEY')) {
        alert('결제 시스템 인증에 문제가 있습니다.')
      } else if (error.message && error.message.includes('amount')) {
        alert('결제 금액에 문제가 있습니다.')
      } else {
        alert(`결제 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 결제 성공 처리
  const handlePaymentSuccess = useCallback(async (paymentKey, orderId, amount) => {
    console.log("🎉 === 결제 성공 처리 시작 ===");
    console.log("결제 정보:", { paymentKey, orderId, amount });
    
    // FormData를 localStorage에 임시 저장 (페이지 이동 시 유지)
    if (window.tempFormData) {
      console.log("💾 FormData를 localStorage에 임시 저장...");
      const formDataEntries = [];
      for (let [key, value] of window.tempFormData.entries()) {
        if (value instanceof File) {
          // File 객체는 Blob으로 변환하여 저장
          const blob = new Blob([value], { type: value.type });
          formDataEntries.push({ key, value: blob, isFile: true, fileName: value.name });
        } else {
          formDataEntries.push({ key, value, isFile: false });
        }
      }
      localStorage.setItem('temp-formdata-entries', JSON.stringify(formDataEntries));
      console.log("✅ FormData 임시 저장 완료");
    }
    
    // 결제 정보를 localStorage에 저장
    const paymentInfo = { paymentKey, orderId, amount };
    localStorage.setItem('temp-payment-info', JSON.stringify(paymentInfo));
    console.log("💾 결제 정보 저장:", paymentInfo);
    
    try {
      // 1. 결제 승인 요청 (DeokkyuAuth 사용)
      console.log("📞 1단계: 결제 승인 요청 시작...");
      const confirmData = {
        paymentKey,
        orderId,
        amount
      }
      
      console.log("결제 승인 데이터:", confirmData);
      const confirmResponse = await confirmPayment(confirmData);
      console.log("✅ 결제 승인 성공:", confirmResponse);
      
      // 2. 성공 처리 및 데이터 정리
      console.log("🎊 2단계: 성공 처리 및 데이터 정리...");
      setPaymentStatus('success')
      
      // FormData 정리 (localStorage는 RegisterComplete에서 정리)
      if (window.tempFormData) {
        delete window.tempFormData
        console.log("🧹 FormData 정리 완료");
      }
      
      console.log("✅ 결제 승인 완료! 가맹점 정보 저장은 RegisterComplete에서 처리됩니다.");
      
      // 3. 성공 완료 페이지로 이동
      console.log("🚀 성공 완료 페이지로 이동: /registercomplete");
      navigate('/registercomplete')
      
    } catch (error) {
      console.error('❌ 결제 승인 오류:', error)
      console.error('에러 타입:', error.constructor.name)
      console.error('에러 메시지:', error.message)
      console.error('에러 응답:', error.response)
      setPaymentStatus('failed')
      alert('결제 승인 중 오류가 발생했습니다.')
    }
  }, [navigate])

  const paymentDetails = calculatePaymentDetails()

  return {
    franchiseFee,
    isLoading,
    paymentStatus,
    paymentDetails,
    handleCardPayment,
    handlePaymentSuccess
  }
}

export default PaymentCalculator 