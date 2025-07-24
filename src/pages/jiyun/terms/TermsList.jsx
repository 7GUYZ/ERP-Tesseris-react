import { useNavigate } from "react-router-dom";
import "../../../styles/jiyun/terms/termsList.css";

export default function TermsList() {
  const navigate = useNavigate();

  const termsList = [
    { id: "service", title: "CMBarter 서비스 이용약관" },
    { id: "privacy", title: "개인정보 수집 및 이용약관" },
    { id: "marketing", title: "마케팅 정보 수집 및 이용 동의" },
    { id: "adinfo", title: "광고성 정보 수신 동의" },
    { id: "location", title: "위치기반서비스 이용약관 동의" },
  ];

  const handleClick = (id) => {
    navigate(`/terms/${id}`);
  };

  return (
    <div className="terms-container">
      <div className="terms-header">
        <button className="back-button" onClick={() => navigate("/mypage")}>
          &lt;
        </button>
        <h2>약관 및 이용 동의</h2>
      </div>
      <div className="terms-section">
        <div className="terms-card">
          <div className="terms-menu-list">
            {termsList.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="terms-menu-item"
              >
                <span className="terms-menu-title">{item.title}</span>
                <span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
