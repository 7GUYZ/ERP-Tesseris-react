import { api } from "../Http";

// ===== 가맹점 신청 관련 API =====

/**
 * 가맹점 신청 등록
 * @param {FormData} formData - 가맹점 신청 데이터
 * @returns {Promise} API 응답
 */
export const registerStore = (formData) => {
  const token = localStorage.getItem("access-token");
  return api.post("/user/store/register", formData, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
}

// ===== 결제 관련 API =====

/**
 * 결제 요청 생성 (토스페이먼츠)
 * @param {Object} paymentData - 결제 정보
 * @returns {Promise} API 응답
 */
export const createPaymentRequest = (paymentData) => {
  const token = localStorage.getItem("access-token");
  return api.post("/user/payment/create", paymentData, {
    headers: {
      Authorization: `${token}`
    }
  });
}

/**
 * 결제 승인 처리
 * @param {Object} confirmData - 결제 승인 데이터
 * @returns {Promise} API 응답
 */
export const confirmPayment = (confirmData) => {
  const token = localStorage.getItem("access-token");
  return api.post("/user/payment/confirm", confirmData, {
    headers: {
      Authorization: `${token}`
    }
  });
}
