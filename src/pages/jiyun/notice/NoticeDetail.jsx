import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { noticeDetail } from "../../../api/auth/JiyoonAuth";
import "../../../styles/jiyun/notice/noticeDetail.css";

export default function NoticeDetail() {
  const { noticeIdx } = useParams();
  const [noticeData, setNoticeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getNotice = async () => {
      try {
        const response = await noticeDetail(noticeIdx);
        setNoticeData(response.data);
      } catch (err) {
        setError("공지 상세 페이지를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    getNotice();
  }, [noticeIdx]);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  if (loading) return <div className="notice-detail-page">로딩 중...</div>;
  if (error) return <div className="notice-detail-page">{error}</div>;

  return (
    <div className="notice-detail-container">
      <div className="notice-detail-header">
        <button className="notice-detail-back-button" onClick={() => navigate("/notice-list")}>
          &lt;
        </button>
        <h2>공지사항</h2>
      </div>
      <div className="notice-detail-section">
        <div className="notice-detail-card">
      <div className="notice-detail-content">
        <div className="notice-detail-meta">
          <p className="notice-detail-subject">{noticeData.noticeTitle}</p>
          <p className="notice-detail-date">
            {formatDate(noticeData.noticeCreateTime)}
          </p>
        </div>
        <div className="notice-detail-body">{noticeData.noticeDesc}</div>
      </div>
        </div>
      </div>
    </div>
  );
}
