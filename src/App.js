import { useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import useAuthStore from './store/jungeun/AuthStore';
import { ToastProvider } from './context/jungeun/ToastContext';
import { setupInterceptors } from './api/auth/JungeunAuth';
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/jungeun/LoginPage";
import TestSignUp from "./pages/jungeun/TestSignUp";
import TestFindPw from "./pages/jungeun/TestFindPw";
import SignupPage from "./pages/taekjun/SignupPage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate); // navigate 함수 전달
    // 기존 로그인 상태 복원 로직
    const tokens = localStorage.getItem("access-token");
    if (tokens) {
      useAuthStore.getState().zu_login();
    }
  }, [navigate]);

  return (
    <ToastProvider>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} /> {/* 회원가입 페이지 */}
          <Route path='/TestSignUp' element={<TestSignUp />} /> {/* 임시 회원가입 페이지 */}
          <Route path='/TestFindPw' element={<TestFindPw />} /> {/* 임시 비번찾기 페이지 */}
          {/* 공통 레이아웃과 Route들이 들어있는 AppRoutes(헤더, 내비 포함) */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
    </ToastProvider>
  )
}

export default App

