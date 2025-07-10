import {api} from "./http"

// 스프링 서버에 보낼것들을 모아놓는것

// 1. 로그인
export const login = (m_id,m_pw) =>  
    api.post("/members/login",{m_id,m_pw})

// 2. 회원가입
export const resister = (member) =>
    api.post("/members/signup",member)

// 3. 마이페이지
export const mypage = () =>
    api.get("/members/mypage")

// 4. guestbook 리스트
export const getGuestbookList = () =>
  api.get("/guestbook/guestbooklist");

// 5. guestbook write
export const guestbookWrite = (guestbookData) => 
  api.post("/guestbook/write", guestbookData);

// 6. guestbookDetail
export const getGuestbookDetail = (id) =>
  api.get(`/guestbook/detail/${id}`);

// 7. guestbook 수정
export const getGuestbookUpdate = (payload) =>
 api.post("/guestbook/update", payload);

// 8. guestbook 삭제
export const getGuestbookDelete = (payload) =>
    api.post("/guestbook/delete", payload);

// 9. BbsList 
export const getBbsList = (page = 1, size = 10) =>
  api.get(`/bbs/bbslist?page=${page}&size=${size}`);

// Board
// 10. 게시글 목록 조회 (페이지네이션)
export const getBoardList = (page = 1, size = 3) =>
  api.get(`/board/boardlist?page=${page}&size=${size}`);


// 11. 게시글 상세 조회
export const getBoardDetail = (id) =>
  api.get(`/board/detail/${id}`);

// 12. 게시글 등록 (답글 포함)d
export const insertBoard = (payload) =>
  api.post("/board/insert", payload);

// 13. 게시글 수정
export const updateBoard = (id, payload) =>
  api.post(`/board/update/${id}`, payload);

// 14. 게시글 삭제
export const deleteBoard = (id, payload) =>
  api.post(`/board/delete/${id}`, payload);

// 조회 수 증가
export const increaseHit = (id) => 
  api.post(`/board/hit/${id}`);

// 비밀번호 검증
export const validatePassword = (id, body) =>
  api.post(`/board/validate-pwd/${id}`, body);

// 인터셉터
// 1. 모든 요청을 가로쳄
// 요청이 발생하면 인터셉터에서 config 객체를 확인한다
// 2. 특수 요청 제외
// login, signup
// 3. 제외한 나머지는 헤더에 JWT 토큰이 자동으로 추가되게 하자
api.interceptors.request.use(
    (config) => {
        const exCludePath = ["/members/login","/members/signup"]; // 제외할 목록
        if(! exCludePath.includes(config.url)){
            const tokens = localStorage.getItem("tokens")
            if(tokens){
                const parsed = JSON.parse(tokens); // 객체로 파싱
                // const accessToken = JSON.parse(tokens);
                if(parsed.accessToken){
                    config.headers.Authorization = `Bearer ${parsed.accessToken}`
                }
            }
        }
        // console.log(config.headers.Authorization);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    res => res ,
    async (error) => {
        const {config, response} = error;
        console.log("error :" + error);
        // config._retry 는 재시도 방지용(무한루프 방지)
        if(response?.status === 401 && !config._retry){
            config._retry = true; // 한번만 재시도 하도록 설정
            try {
                const tokens = JSON.parse(localStorage.getItem("tokens"));
                const result = await api.post("/members/refresh",{
                    refreshToken : tokens.refreshToken
                });

                const {accessToken, refreshToken} = result.data.data;
                localStorage.setItem("tokens", JSON.stringify({accessToken,refreshToken}));

                config.headers.Authorization = `Bearer ${accessToken}`;
                return api(config);

            } catch (error) {
                return Promise.reject(error.response || error);
            }
        }
        if (response?.status === 419) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)