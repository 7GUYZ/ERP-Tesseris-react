import { api } from "./http";

//공지사항
export const noticeDetail = (noticeIdx) =>
  api.get(`/notice/detail/${noticeIdx}`);
export const noticeList = () => api.get("/notice/list");
