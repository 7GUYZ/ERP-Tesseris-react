import { api } from "../Http";

//공지사항
export const noticeDetail = (noticeIdx) =>
  api.get(`/notice/detail/${noticeIdx}`);

//공지사항 목록
export const noticeList = () => api.get("/notice/list");