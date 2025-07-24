import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/jiyun/notice/noticeList.css";
import { noticeList } from "../../../api/auth/JiyoonAuth";

export default function NoticeList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getNoticeList = async () => {
      try {
        const response = await noticeList();
        setList(response.data);
      } catch (err) {
        setError("공지사항 리스트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    getNoticeList();
  }, []);

  if (loading) return <div className="notice-detail-page">로딩 중...</div>;
  if (error) return <div className="notice-detail-page">{error}</div>;

  const sortedList = [...list].sort(
    (a, b) => new Date(b.noticeCreateTime) - new Date(a.noticeCreateTime)
  );

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  return (
    <div className="notice-container">
      <div className="notice-header">
        <button className="back-button" onClick={() => navigate("/mypage")}>
          &lt;
        </button>
        <h2>공지사항</h2>
      </div>
      <div className="notice-section">
        <div className="notice-card">
          <div className="notice-list">
            {sortedList.map((item) => (
              <div
                key={item.noticeIndex}
                className="notice-item"
                onClick={() => navigate(`/notice-view/${item.noticeIndex}`)}
              >
                <span className="notice-item-title">{item.noticeTitle}</span>
                <span className="notice-item-date">
                  {formatDate(item.noticeCreateTime)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
