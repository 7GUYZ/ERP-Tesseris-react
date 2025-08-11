import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/jiyun/notice/noticeList.css";
import { noticeList } from "../../../api/auth/JiyoonAuth";

export default function NoticeList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  // 백엔드에서 이미 중요공지 우선으로 정렬되어 옴
  const sortedList = list;

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // 검색어에 따라 공지사항 필터링
  const filteredList = sortedList.filter(item => 
    item.noticeTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 중요공지사항 3개 추출 (검색된 결과에서)
  const importantNotices = filteredList.filter(item => item.noticeType === '중요').slice(0, 3);
  
  // 전체 공지사항 리스트 (검색된 결과에서)
  const allNotices = filteredList;

  return (
    <div className="notice-list-container">
      <div className="notice-list-header">
        <button className="notice-list-back-button" onClick={() => navigate("/mypage")}>
          &lt;
        </button>
        <h2>공지사항</h2>
      </div>
      
      {/* 검색 입력창 */}
      <div className="notice-list-section">
        <div className="notice-search-container">
          <input
            type="text"
            placeholder="제목으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="notice-search-input"
          />
        </div>
      </div>
      
      {/* 통합 공지사항 리스트 */}
      <div className="notice-list-section">
        <div className="notice-list-card">
          <div className="notice-list-table-wrapper">
            <table className="notice-list-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>분류</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                {/* 중요공지사항 (번호 없음) */}
                {importantNotices.map((item) => (
                  <tr 
                    key={item.noticeIndex}
                    className="important-notice"
                    onClick={() => navigate(`/notice-view/${item.noticeIndex}`)}
                  >
                    <td>-</td>
                    <td>
                      <span className="notice-type-badge important">중요</span>
                    </td>
                    <td>
                      <span className="notice-list-link">
                        {item.noticeTitle}
                      </span>
                    </td>
                    <td>{item.userEmail}</td>
                    <td>{formatDate(item.noticeCreateTime)}</td>
                  </tr>
                ))}
                
                {/* 전체 공지사항 (번호 있음) */}
                {allNotices.map((item, idx) => (
                  <tr 
                    key={item.noticeIndex}
                    onClick={() => navigate(`/notice-view/${item.noticeIndex}`)}
                  >
                    <td>{idx + 1}</td>
                    <td>
                      <span className={`notice-type-badge ${item.noticeType === '중요' ? 'important' : 'normal'}`}>
                        {item.noticeType === '중요' ? '중요' : '일반'}
                      </span>
                    </td>
                    <td>
                      <span className="notice-list-link">
                        {item.noticeTitle}
                      </span>
                    </td>
                    <td>{item.userEmail}</td>
                    <td>{formatDate(item.noticeCreateTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
