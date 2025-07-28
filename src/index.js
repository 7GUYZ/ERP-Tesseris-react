import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 환경변수 디버깅
const wsBaseUrl = process.env.NODE_ENV === 'production' 
  ? '' // 운영환경: 현재 도메인 사용
  : 'http://localhost:19091'; // 개발환경: localhost 사용

console.log('🔧 환경변수 확인:', {
  REACT_APP_BASENAME: process.env.REACT_APP_BASENAME,
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  WebSocket_URL: `${wsBaseUrl}/springboot/ws/notifications`,
  NODE_ENV: process.env.NODE_ENV
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={process.env.REACT_APP_BASENAME || undefined}>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
