"use client"

import { useState } from "react"
import InputField from "../../components/forms/jungeun/LoginInputField.jsx"
import LoginButton from "../../components/forms/jungeun/LoginButton.jsx"
import ErrorMessage from "../../components/ui/jungeun/ErrorMessage.jsx"
import { login } from "../../api/Auth.jsx"
import useAuthStore from "../../store/jungeun/AuthStore.js"
import "../../styles/jungeun/login.css"
import { useToast } from "../../context/jungeun/ToastContext.jsx"


const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { showToast } = useToast()


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
        // 토큰 저장
        const accessToken = response.headers['authorization'];
        if (accessToken) {
          // localStorage에 토큰 저장
          localStorage.setItem("access-token", accessToken)
          // localStorage에 user-info 저장 - 백엔드에서 응답 본문에 포함된 데이터 저장
          localStorage.setItem("user-info", JSON.stringify(response.data.data))
          // 쿠키에 refresh 토큰 저장은 수동처리 할 필요 없음. 자동으로 처리됨-백엔드에서 Set-Cookie 처리함.
        }

        // 로그인 성공 시 Zustand 스토어 상태 업데이트
        useAuthStore.getState().zu_login();

        // 성공 토스트 메시지
        showToast("success", response.data.resultMessage || "로그인에 성공했습니다");

        // 잠시 후 메인 페이지로 이동
        setTimeout(() => {
          // 메인 페이지로 이동하는 로직 추가
          window.location.href = "/TestMain";
        }, 1500);
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
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-title">TESSERIS</h1>
        <p className="login-subtitle">로그인하여 계속하세요</p>
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
        <div className="login-link-container">
          <a
            href="/"
            className="login-link"
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
              window.location.href="/TestFindPw"
            }}
          >
            비밀번호 찾기
          </a>
          <a
            href="/"
            className="login-link"
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
              window.location.href = "/TestSignUp"
            }}
          >
            회원가입
          </a>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
