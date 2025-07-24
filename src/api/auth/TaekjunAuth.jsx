import { api } from "../Http";

// 회원가입 API
export const signupApi = {
    // 주소 검색
    searchAddress: (query) => api.get('signin/search-address', { params: { query } }),
    
    // 키워드 검색 (상세 주소)
    searchAddressKeyword: (query) => api.get('signin/search-address-keyword', { params: { query } }),
    
    // 이메일 인증 메일 발송
    sendAuthEmail: (data) => api.post('signin/send-auth-email', data),
    
    // 이메일 인증 코드 검증
    verifyAuthEmail: (data) => api.post('signin/verify-auth-email', data),
    
    // 최종 회원가입
    finalSignup: (data) => api.post('signin/step3-final-signup', data),
    
    // 사용자 검색 (추천인 찾기)
    searchUser: (identifier) => api.get('signin/search-user', { params: { identifier } }),
    
    // 추천인 관계 생성
    createReferral: (data) => api.post('signin/create-referral', data),
    
    // 추천인 목록 조회
    getReferralList: (userIndex) => api.get(`referral/list/${userIndex}`),
    
    // 추천인 수 조회
    getReferralCount: (userIndex) => api.get(`referral/count/${userIndex}`),
    
    // 추천인 코드 유효성 검사
    validateReferralCode: (referralCode) => api.get(`referral/validate/${referralCode}`),
    
    // 검색 타입에 따른 사용자 검색
    searchUserByType: (data) => api.post('referral/search', data),
    
    // 추천 보상 지급
    giveReferralReward: (data) => api.post('referral/reward', data),
    
    // 이메일/닉네임 중복확인
    checkDuplicate: ({ email, nickname }) => api.get('signin/check-duplicate', { params: { email, nickname } }),
};