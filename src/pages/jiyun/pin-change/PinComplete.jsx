import { useNavigate } from "react-router-dom";
import "../../../styles/jiyun/pin-change/pin-change.css";

export default function PinComplete() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/mypage");
  };

  return (
    <div className="pinchange-container">
      <div className="pinchange-header">
        <button className="back-button" onClick={handleConfirm}>
          &lt;
        </button>
        <h2>PIN 번호 변경</h2>
      </div>
      <div className="pinchange-section">
        <div className="pinchange-card">
          <div className="pinchange-content">
            <h3 style={{ fontWeight: "bold" }}>PIN 번호 변경 완료</h3>
            <p>PIN 번호 변경이 완료되었습니다.</p>
            <button className="pinchange-button" onClick={handleConfirm}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
