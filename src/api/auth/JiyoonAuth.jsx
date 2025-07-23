import { api } from "../Http";

//공지사항
export const noticeDetail = (noticeIdx) =>
  api.get(`/notice/detail/${noticeIdx}`);

//공지사항 목록
export const noticeList = () => api.get("/notice/list");

//핀번호 변경
export const pinChange = (pin) => api.post(`/pinChange/update`, pin);
//비밀번호 확인
export const pwCheck = (password) => api.post(`/pinChange/pwCheck`, { password });
