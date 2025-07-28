import axios from "axios";

// Spring 서버에 가는 axios 인스턴스 생성 
export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_BASE_URL || '/springboot/api'
        : 'http://localhost:19091/api', // 개발환경: 직접 Spring Boot 서버 연결
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // CORS 허용
});

// 요청 인터셉터 추가
api.interceptors.request.use(
    (config) => {
        console.log('API 요청:', config.method?.toUpperCase(), config.url);
        console.log('요청 데이터:', config.data);
        return config;
    },
    (error) => {
        console.error('요청 오류:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
    (response) => {
        console.log('API 응답:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('응답 오류:', error.response?.status, error.response?.data);
        console.error('오류 상세:', error);
        return Promise.reject(error);
    }
);