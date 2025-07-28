import { useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import useAuthStore from './store/jungeun/AuthStore';
import { ToastProvider } from './context/jungeun/ToastContext';
import { NotificationToastProvider } from './context/jungeun/NotificationToastContext';
import { setupInterceptors } from './api/auth/JungeunAuth';
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/jungeun/LoginPage";
import TestSignUp from "./pages/jungeun/TestSignUp";
import TestFindPw from "./pages/jungeun/TestFindPw";
import SignupPage from "./pages/taekjun/SignupPage";
import { WebSocketProvider, useWebSocket } from './context/jungeun/WebSocketContext';

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
    <WebSocketProvider>
      <AppContent />
    </WebSocketProvider>
  );
}

function AppContent() {
  const { connectWebSocket } = useWebSocket();

  useEffect(() => {
    // 새로고침 시 WebSocket 자동 재연결
    const userInfo = localStorage.getItem("user-info");
    const token = localStorage.getItem("access-token");
    
    // 로그인 상태 확인
    if (userInfo && token) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log('🔌 WebSocket 연결 시도:', { 
          userIndex: parsedUserInfo.user_index, 
          hasToken: !!token 
        });
        
        connectWebSocket(token, parsedUserInfo.user_index, (notification) => {
          // 알림 토스트 사용
          if (window.showNotificationToast) {
            window.showNotificationToast('info', notification.message);
          }
        });
      } catch (error) {
        console.error('WebSocket 연결 중 오류:', error);
      }
    } else {
      console.log('🔌 WebSocket 연결 건너뜀: 로그인되지 않음');
    }
  }, [connectWebSocket]);

  return (
    <NotificationToastProvider>
      <ToastProvider>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/TestSignUp' element={<TestSignUp />} />
          <Route path='/TestFindPw' element={<TestFindPw />} />
          {/* 공통 레이아웃과 Route들이 들어있는 AppRoutes(헤더, 내비 포함) */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </ToastProvider>
    </NotificationToastProvider>
  );
}

export default App

