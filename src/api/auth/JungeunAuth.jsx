import { api } from "../Http";

// [로그인]
export const login = (username, password) =>
  api.post("/auth/login", { username, password })

export const test = () =>
  api.get("/user/testBackend")

export const logout = () => 
  api.post("/auth/logout")

// Interceptor 등록 함수로 분리
export function setupInterceptors(navigate) {
  // 요청 인터셉터
  api.interceptors.request.use(
    (config) => {
      const excludePaths = ["/auth/login", "/auth/signUp"];
      if (!excludePaths.includes(config.url)) {
        const accessToken = localStorage.getItem("access-token");
        if (accessToken) {
          config.headers.Authorization = accessToken.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const { config, response } = error;

      // accessToken 만료 처리 (401 응답)
      if (response?.status === 401 && !config._retry) {
        console.log("🔒 401 응답 받음 → refresh 시도");

        config._retry = true;

        try {
          const result = await api.post("/auth/refresh");
          const { success, data: accessToken } = result.data;

          if (!success || !accessToken) {
            throw new Error("refreshToken expired");
          }

          console.log("새 accessToken:", accessToken);

          // accessToken 저장 및 재시도
          localStorage.setItem("access-token", `Bearer ${accessToken}`);
          config.headers.Authorization = `Bearer ${accessToken}`;
          return api(config); // 원래 요청 재전송

        } catch (e) {
          console.warn("refreshToken 만료 또는 서버 오류:", e.message);

          // 로그인 만료 처리 (전역 이벤트로 Toast 발생)
          localStorage.removeItem("access-token");
          localStorage.removeItem("user-info");
          window.dispatchEvent(
            new CustomEvent("show-toast", {
              detail: {
                type: "error",
                message: "로그인 만료 \n(4초 뒤 로그인 페이지로 이동)",
              },
            })
          );

          // 홈으로 이동
          setTimeout(() => {
            if (navigate) {
              navigate("/");
            } else {
              window.location.href = "/";
            }
          }, 4000);

          return Promise.reject(e);
          
        }
      }

      return Promise.reject(error);
    }
  );
}

// 산하 사업자 등급 불러오는 api
export const businessGradeFilter = (user_index) => {
  return api.get("/user/businessList", {
    params: {user_index}
  });
}
// 산하 사업자 등급 선택했을 때 사업자 리스트 불러오는 api
export const businessList = (business_grade_index) => {
  return api.get("/user/businessList/filtered", {
    params: {business_grade_index}
  });
}

// 가맹점 카테고리 불러오는 api
export const storeCategoryFilter = () => {
  return api.get("/user/storeList");
}

// 가맹점 카테고리 선택했을 때 가맹점 리스트 불러오는 api
export const storeList = (user_index, store_category_index) => {
  return api.get("/user/storeList/filtered", {
    params: {user_index, store_category_index}
  });
}

// 가맹점 상세보기
export const storeDetail = (store_index) => {
  return api.get("/user/storeList/detail", {
    params: {store_index}
  });
}

export const getCurrentCM = (user_index) => {
  return api.get("/user/giftCM/currentCM", {
    params: {user_index}
  });
}

// 회원 검색 API
export const searchUser = (recipientEmail) => {
  return api.get("/user/giftCM/searchUser", {
    params: {recipientEmail}
  });
}

// Pin 번호 확인 API
export const pinCheck = ({userIndex, userCmPincode}) => 
  api.post("/user/giftCM/pinCheck", {userIndex, userCmPincode});

export const giftTransfer = ({sendUserIndex, receiveUserIndex, giftAmount}) =>
  api.post("/user/giftCM/giftTransfer", {sendUserIndex, receiveUserIndex, giftAmount});

// 사용자의 알림 설정 조회
export const getUserAlarmSetting = (userIndex, alarmTypesId) => {
  return api.get("/alarms/user-alarm-setting", {
    params: { userIndex, alarmTypesId }
  });
};

// 사용자의 알림 설정 업데이트
export const updateUserAlarmSetting = (userIndex, alarmTypesId, isActive) => {
  return api.post("/alarms/update-user-alarm-setting", null, {
    params: { userIndex, alarmTypesId, isActive }
  });
};

// 중개수수료 조회 API
export const getBrokerageFee = (user_index) => {
  return api.get("/user/brokerageFee", {
    params: { user_index }
  });
};

// 팝업 이미지 목록 가져오기
export const getPopup = () => {
  return api.get("/user/getPopup");
}
