"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom";
import InputField from "./LoginInputField.jsx"
import LoginButton from "./LoginButton.jsx"
import ErrorMessage from "../../ui/jungeun/ErrorMessage.jsx"
import { login } from "../../../api/auth/JungeunAuth.jsx"
import useAuthStore from "../../../store/jungeun/AuthStore.js"
import { useToast } from "../../../context/jungeun/ToastContext.jsx"
import { useWebSocket } from "../../../context/jungeun/WebSocketContext.jsx"
import { useNotificationToast } from "../../../context/jungeun/NotificationToastContext.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { showToast } = useToast()
  const { showNotificationToast } = useNotificationToast();
  const navigate = useNavigate();
  const { connectWebSocket } = useWebSocket();

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    // 간단한 이메일 정규식
    const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // 실시간 유효성 검사
  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)

    if (errors.email) {
      if (value.trim() === "") {
        setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }))
      } else if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }))
      } else {
        setErrors((prev) => ({ ...prev, email: "" }))
      }
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)

    if (errors.password) {
      if (value.trim() === "") {
        setErrors((prev) => ({ ...prev, password: "비밀번호를 입력해주세요." }))
      } else {
        setErrors((prev) => ({ ...prev, password: "" }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // 이메일 검증
    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요."
    } else if (!validateEmail(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다."
    }

    // 비밀번호 검증 (길이 제한 없음)
    if (!password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    // 폼 유효성 검사
    if (!validateForm()) {
      showToast("error", "입력 정보를 확인해주세요");
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await login(email, password);
      console.log(response);

      // 백엔드 응답에 맞춰서 처리
      if (response.data && response.data.resultCode === 200) {
        // response.data.data = user-info 변수에 저장
        const userInfo = response.data.data

        if (["1", "2", "3"].includes(userInfo.user_role_index)) {
          // 토큰 저장
          const accessToken = response.headers['authorization'];

          if (accessToken) {
            // localStorage에 토큰 저장
            localStorage.setItem("access-token", accessToken)
            // localStorage에 user-info 저장 - 백엔드에서 응답 본문에 포함된 데이터 저장
            localStorage.setItem("user-info", JSON.stringify(response.data.data))
          }

          // 로그인 성공 시 Zustand 스토어 상태 업데이트
          useAuthStore.getState().zu_login();

          // ✅ WebSocket 연결 (자동 알림 수신) - 권한 체크 안에서 실행
          connectWebSocket(accessToken, userInfo.user_index, (notification) => {
            showNotificationToast('info', notification.message);
          });

          // 성공 토스트 메시지
          showToast("success", response.data.resultMessage || "로그인에 성공했습니다");
          
          // 외부 결제 요청인지 확인
          const externalPaymentData = localStorage.getItem('external-payment-data');
          if (externalPaymentData) {
            try {
              const parsedData = JSON.parse(externalPaymentData);
              if (parsedData.external) {
                console.log('외부 결제 요청 감지, 결제 페이지로 이동');
                // 외부 결제 정보를 PaymentPage state로 전달
                const paymentState = {
                  fromExternal: true,
                  externalData: parsedData,
                  paymentData: {
                    amount: parsedData.amount || '',
                    selectedStore: null,
                    selectedCoupons: [],
                    pinCode: ''
                  }
                };
                
                localStorage.removeItem('external-payment-data'); // 사용 후 삭제
                setTimeout(() => navigate("/payment", { state: paymentState }), 1000);
                return;
              }
            } catch (error) {
              console.error('외부 결제 데이터 파싱 오류:', error);
              localStorage.removeItem('external-payment-data'); // 오류 시 삭제
            }
          }
          
          // 일반 로그인인 경우
          setTimeout(() => navigate("/main"), 2500);
        } else {
          showToast("error", "허용되지 않은 사용자입니다");
        }
      }
    } catch (error) {
      console.error("로그인 에러:", error);

      // 에러 메시지 처리
      let errorMessage = "로그인에 실패했습니다";
      if (error.response?.data?.resultMessage) {
        errorMessage = error.response.data.resultMessage;
      }

      showToast("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="user-login-form" onSubmit={handleLogin}>
      <h1 className="user-login-title">TESSERIS<br /><span style={{ fontSize: 18 }}>소상공인 물물교환 결제시스템</span></h1>
      <p className="user-login-subtitle">서비스 이용을 위해 로그인해주세요.</p>
      <InputField
        type="text"
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={handleEmailChange}
        icon="id"
        error={errors.email}
      />
      {errors.email && <ErrorMessage message={errors.email} />}
      <InputField
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={handlePasswordChange}
        icon="lock"
        error={errors.password}
      />
      {errors.password && <ErrorMessage message={errors.password} />}
      <LoginButton type="submit" isLoading={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </LoginButton>
      <div className="user-login-link-container">
        <button
          href="/"
          className="user-login-link"
          onMouseEnter={(e) => {
            e.target.style.color = "#FDCD00"
            e.target.style.opacity = "1"
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#170F58"
            e.target.style.opacity = "0.8"
          }}
          onClick={(e) => {
            e.preventDefault()
            navigate("/passwordfind")
          }}
        >
          비밀번호 찾기
        </button>
        <button
          type="button"
          className="user-login-link"
          onMouseEnter={(e) => {
            e.target.style.color = "#FDCD00"
            e.target.style.opacity = "1"
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#170F58"
            e.target.style.opacity = "0.8"
          }}
          onClick={(e) => {
            e.preventDefault()
            navigate("/signup")
          }}
        >
          회원가입
        </button>
      </div>
    </form>
  )
}

export default LoginForm
