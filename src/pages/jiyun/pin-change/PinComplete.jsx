import { useNavigate } from "react-router-dom";
import "../../../styles/jiyun/pin-change/pin-change.css";

export default function PinComplete() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/general/mypage");
  };

  return (
    <div className="pin-container">
      <div className="pin-header">
        <div></div>
        <div className="header-title-wrapper">
          <h1 className="pin-title">PIN 번호 변경</h1>
        </div>
        <span className="back-icon" onClick={handleConfirm}>
          ✕
        </span>
      </div>

      <div className="pin-content">
        <h2 style={{ fontWeight: "bold" }}>PIN 번호 변경 완료</h2>
        <p>PIN 번호 변경이 완료되었습니다.</p>
      </div>

      <button className="pin-next-button" onClick={handleConfirm}>
        확인
      </button>
    </div>
  );
}
