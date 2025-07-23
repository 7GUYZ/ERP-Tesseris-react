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
      <header className="terms-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h2>약관 및 이용 동의</h2>
      </header>
      <ul className="terms-list">
        {termsList.map((item) => (
          <li
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="terms-item"
          >
            <span>{item.title}</span>
            <span className="arrow">〉</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
