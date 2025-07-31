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

// 패스워드 찾기 API
export const passwordFindApi = {
    // 패스워드 찾기 인증 메일 발송
    sendPasswordFindAuthEmail: (data) => api.post('passwordfind/send-auth-email', data),
    
    // 패스워드 찾기 이메일 인증 코드 검증
    verifyPasswordFindAuthEmail: (data) => api.post('passwordfind/verify-auth-email', data),
    
    // 패스워드 변경
    changePassword: (data) => api.post('passwordfind/change-password', data),
};

// 고객 관리 API
export const customerManagementApi = {
    // 내 가맹점 고객 목록 조회
    getMyCustomers: (params) => api.get('customer-management/my-customers', { params }),
    
    // 내 가맹점 특정 고객 조회
    getMyCustomerByUserIndex: (storeUserIndex, customerUserIndex) => 
        api.get('customer-management/my-customer', { params: { storeUserIndex, customerUserIndex } }),
    
    // user_index로 고객 정보 조회
    getCustomerByUserIndex: (userIndex) => 
        api.get('customer-management/customer-by-user-index', { params: { userIndex } }),
    
    // user_index로 고객 상태 조회
    getCustomerStatusByUserIndex: (userIndex) => 
        api.get('customer-management/customer-status', { params: { userIndex } }),
    
    // 특정 가맹점의 고객 조회
    getCustomerByStoreAndUserIndex: (storeUserIndex, customerUserIndex) => 
        api.get('customer-management/store-customer', { params: { storeUserIndex, customerUserIndex } }),
    
    // 고객 상태 변경 (단골/일반 등록)
    updateCustomerStatus: (data) => api.put('customer-management/update-status', data),
    
    // 쿠폰 선물
    giftCoupon: (data) => api.post('customer-management/gift-coupon', data),
};

// 쿠폰 리스트 API
export const couponListApi = {
    // 내가 받은 쿠폰 리스트 조회
    getMyCoupons: (userIndex) => api.get('coponlist/my-coupons', { params: { userIndex } }),
};

// 가맹점 리스트 API
export const storeListApi = {
    // 가맹점 카테고리 목록 조회
    getStoreCategories: () => api.get('taekjun/storelist'),
    // 필터링된 가맹점 목록 조회
    getFilteredStoreList: (storeCategoryIndex) => {
        // 전체(0) 선택 시에는 카테고리 파라미터를 제거
        if (storeCategoryIndex === 0) {
            return api.get('taekjun/storelist/filtered');
        } else {
            return api.get('taekjun/storelist/filtered', { 
                params: { store_category_index: storeCategoryIndex } 
            });
        }
    },
    // 가맹점 상세 정보 조회
    getStoreDetail: (storeIndex) => api.get('taekjun/storelist/detail', { 
        params: { store_index: storeIndex } 
    }),
};

// 결제 API
export const paymentApi = {
    // 결제 정보 조회 (월 한도, 사용량, 보유 CM)
    getPaymentInfo: (userIndex) => api.get('payment/info', { 
        params: { userIndex } 
    }),
    // 결제용 가맹점 목록 조회
    getPaymentStoreList: () => api.get('payment/stores'),
    // 사용자의 쿠폰 목록 조회
    getUserCoupons: (userIndex, couponName) => api.get('payment/coupons', { 
        params: { userIndex, couponName } 
    }),
    // 특정 가맹점의 쿠폰 목록 조회
    getStoreCoupons: (userIndex, storeUserIndex, couponName) => api.get('payment/store-coupons', { 
        params: { userIndex, storeUserIndex, couponName } 
    }),
    // 결제 실행
    processPayment: (request, userIndex) => api.post('payment/process', request, { 
        params: { userIndex } 
    }),
    // 결제 성공 시 내 CM 차감 및 가맹점 입금
    processPaymentTransfer: (userIndex, storeUserIndex, amount) => api.post('payment/transfer', { 
        userIndex, 
        storeUserIndex, 
        amount 
    }),
};

// CM 사용 내역 API
export const userLogApi = {
                // 전체 CM 사용 내역 조회 (페이징)
            getAllLogs: (userIndex, page = 0, size = 20, year = null, month = null) => api.get(`user_log/${userIndex}`, { 
                params: { page, size, year, month } 
            }),
    // 월별 CM 사용 내역 조회
    getMonthlyLogs: (userIndex, year, month) => api.get(`user_log/${userIndex}/monthly`, { 
        params: { year, month } 
    }),
    // 거래 타입별 CM 사용 내역 조회 (페이징)
    getLogsByTransactionType: (userIndex, transactionType, page = 0, size = 20) => api.get(`user_log/${userIndex}/transaction-type/${transactionType}`, { 
        params: { page, size } 
    }),
                // CM 사용 통계 조회
            getStatistics: (userIndex) => api.get(`user_log/${userIndex}/statistics`),
            
            // 내가 쓴 금액 조회
            getSpentLogs: (userIndex, page = 0, size = 20, year = null, month = null) => api.get(`user_log/${userIndex}/spent`, { 
                params: { page, size, year, month } 
            }),
            
            // 내가 받은 금액 조회
            getReceivedLogs: (userIndex, page = 0, size = 20, year = null, month = null) => api.get(`user_log/${userIndex}/received`, { 
                params: { page, size, year, month } 
            }),
            
            // 수입 거래 조회 (돈이 들어오는 거래)
            getIncomeLogs: (userIndex, page = 0, size = 20) => api.get(`user_log/${userIndex}/income`, { 
                params: { page, size } 
            }),
            
            // 지출 거래 조회 (돈이 빠져나가는 거래)
            getExpenseLogs: (userIndex, page = 0, size = 20) => api.get(`user_log/${userIndex}/expense`, { 
                params: { page, size } 
            }),
        };

// 사용자 정보 관리 API
export const TaekjunAuth = {
    // 현재 사용자 정보 조회
    getUserInfo: () => {
        // user-info 객체에서 user_index 값을 가져오기
        const userInfo = localStorage.getItem('user-info');
        let userIndex = null;
        
        if (userInfo) {
            try {
                const userInfoObj = JSON.parse(userInfo);
                userIndex = userInfoObj.user_index;
            } catch (e) {
                console.error('user-info 파싱 오류:', e);
            }
        }
        
        console.log('TaekjunAuth.getUserInfo - userIndex:', userIndex);
        return api.get(`user/info`, { 
            params: { userIndex } 
        });
    },
    
    // 사용자 정보 수정
    updateUserInfo: (userData) => {
        // user-info 객체에서 user_index 값을 가져오기
        const userInfo = localStorage.getItem('user-info');
        let userIndex = null;
        
        if (userInfo) {
            try {
                const userInfoObj = JSON.parse(userInfo);
                userIndex = userInfoObj.user_index;
            } catch (e) {
                console.error('user-info 파싱 오류:', e);
            }
        }
        
        console.log('TaekjunAuth.updateUserInfo - userIndex:', userIndex, 'userData:', userData);
        return api.put(`user/update`, userData, { 
            params: { userIndex } 
        });
    },
    
    // 은행 목록 조회
    getBankList: () => {
        return api.get(`user/banks`);
    },
    
    // 주소 검색 API
    searchAddress: (query) => {
        return api.get(`address/search`, { params: { query } });
    },
    
    // 키워드 검색 API
    searchAddressKeyword: (query) => {
        return api.get(`address/search/keyword`, { params: { query } });
    },
};