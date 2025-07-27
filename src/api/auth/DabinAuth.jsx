import { api } from "../Http";

// 가맹점 정보 조회 (JWT 방식)
export const getStoreMyInfo = () => api.get("/store/basic-info/info");

// 일반회원, 가맹점점 수당 내역 조회
export const getUserCommissionHistory = (page = 1, limit = 20) => 
    api.get("/user/commission-history", {
        params: { page, limit }
    });

// JWT 방식의 가맹점 이미지 조회
export const getMyStoreImages = () => api.get("/store/images/my");

// 가맹점 정보 수정 (JWT 방식)
export const updateStoreInfo = async (userIndex, storeData) => {
    try {
        // JWT 방식으로 변경 - userIndex는 더 이상 필요하지 않음
        const response = await api.put(`/store/basic-info/info`, storeData);
        return response;
    } catch (error) {
        console.error('Error updating store info:', error);
        throw error;
    }
};

// 대표이미지(가맹점 이미지) 업로드 (배치)
export const uploadStoreImage = async (userIndex, file) => {
    try {
        const formData = new FormData();
        formData.append('mainImage', file);
        formData.append('storeIndex', userIndex);
        const response = await api.post('/store/images/batch', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000 // 30초 타임아웃
        });
        return response;
    } catch (error) {
        console.error('Error uploading store image:', error);
        throw error;
    }
};

// 대표이미지(가맹점 이미지) 삭제
export const deleteStoreImage = async (imageIndex) => {
    try {
        const response = await api.delete(`/store/images/${imageIndex}`);
        return response;
    } catch (error) {
        console.error('Error deleting store image:', error);
        throw error;
    }
};

// presigned URL 받아오기
export const getPresignedUrl = async (fileKey) => {
    try {
        const response = await api.get(`/store/images/presigned`, {
            params: { fileKey }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching presigned url:', error);
        throw error;
    }
};

// 가맹점 카테고리 조회
export const getStoreCategories = async () => {
    try {
        const response = await api.get('/store/basic-info/categories');
        return response;
    } catch (error) {
        console.error('Error fetching store categories:', error);
        throw error;
    }
};

// 가맹점 운영정보 조회 (JWT 방식)
export const getStoreOperationInfo = () => api.get("/store/operation/my");

// 가맹점 운영정보 수정 (JWT 방식)
export const updateStoreOperationInfo = async (operationData) => {
    try {
        const response = await api.put(`/store/operation/my`, operationData);
        return response;
    } catch (error) {
        console.error('Error updating store operation info:', error);
        throw error;
    }
};



// JWT 방식 쿠폰 조회
export const getAvailableCoupons = async (minPrice = 0) => {
    return api.get('/dabin/event-registration/coupons', { params: { minPrice } });
};
// JWT 방식 이벤트 등록
export const registerEvent = async (eventData) => {
    return api.post('/dabin/event-registration/register', eventData);
};

// 쿠폰 이벤트 리스트 - 진행중인 이벤트 조회
export const getActiveEvents = async () => {
    try {
        const response = await api.get('/dabin/event-list/active');
        return response;
    } catch (error) {
        console.error('Error fetching active events:', error);
        throw error;
    }
};

// 쿠폰 이벤트 리스트 - 종료된 이벤트 조회
export const getEndedEvents = async () => {
    try {
        const response = await api.get('/dabin/event-list/ended');
        return response;
    } catch (error) {
        console.error('Error fetching ended events:', error);
        throw error;
    }
};

// 쿠폰 이벤트 상세보기
export const getEventDetail = async (eventMasterIndex) => {
    try {
        const response = await api.get(`/dabin/event-list/detail/${eventMasterIndex}`);
        return response;
    } catch (error) {
        console.error('Error fetching event detail:', error);
        throw error;
    }
};



// 사용자용 활성 이벤트 목록 조회
export const getUserActiveEvents = async () => {
    try {
        const response = await api.get('/user/event-list/active');
        return response;
    } catch (error) {
        console.error('사용자 활성 이벤트 목록 조회 오류:', error);
        throw error;
    }
};

// 사용자용 종료된 이벤트 목록 조회
export const getUserEndedEvents = async () => {
    try {
        const response = await api.get('/user/event-list/ended');
        return response;
    } catch (error) {
        console.error('사용자 종료된 이벤트 목록 조회 오류:', error);
        throw error;
    }
};

// 사용자용 이벤트 상세 정보 조회
export const getUserEventDetail = async (eventMasterIndex) => {
    try {
        const response = await api.get(`/user/event-list/detail/${eventMasterIndex}`);
        return response;
    } catch (error) {
        console.error('사용자 이벤트 상세 조회 오류:', error);
        throw error;
    }
};

// 사용자용 쿠폰 다운로드
export const downloadUserCoupon = async (eventMasterIndex, couponIndex) => {
    try {
        console.log('쿠폰 다운로드 요청 - eventMasterIndex:', eventMasterIndex, 'couponIndex:', couponIndex);
        
        const requestData = {
            eventMasterIndex: eventMasterIndex,
            couponIndex: couponIndex
        };
        console.log('요청 데이터:', requestData);
        
        const response = await api.post('/user/event-list/coupon/download', requestData);
        console.log('쿠폰 다운로드 응답:', response);
        
        return response;
    } catch (error) {
        console.error('사용자 쿠폰 다운로드 오류:', error);
        console.error('오류 상세:', error.response?.data);
        throw error;
    }
};

// 가맹점 지도 관련 API 함수들
// 특정 가맹점 정보 조회
export const getFranchiseInfo = async (storeIndex) => {
    try {
        const response = await api.get(`/api/franchise/${storeIndex}`);
        return response;
    } catch (error) {
        console.error('Error fetching franchise info:', error);
        throw error;
    }
};

// 모든 가맹점 카테고리 조회
export const getFranchiseCategories = async () => {
    try {
        const response = await api.get('/api/franchise/categories');
        return response;
    } catch (error) {
        console.error('Error fetching franchise categories:', error);
        throw error;
    }
};

// 주변 가맹점 검색
export const getNearbyFranchises = async (requestData) => {
    try {
        const response = await api.post('/api/franchise/nearby', requestData);
        return response;
    } catch (error) {
        console.error('Error fetching nearby franchises:', error);
        throw error;
    }
};