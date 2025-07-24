import { useNavigate } from "react-router-dom";
import PinInput from "../../../components/forms/jiyun/pin-change/PinInput";
import "../../../styles/jiyun/pin-change/pin-change.css";

export default function PinStep1() {
  const navigate = useNavigate();

  const handleComplete = (pin) => {
    navigate("/pinChange/pinconfirm", { state: { originalPin: pin } });
  };

  return (
    <div className="pinchange-container">
      <div className="pinchange-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h2>PIN 번호 변경</h2>
      </div>
      <div className="pinchange-section">
        <div className="pinchange-card">
          <div className="pinchange-content-key">
            <h3>새 PIN 번호 입력</h3>
            <p>변경하실 PIN 번호를 입력해주세요.</p>
            <PinInput onComplete={handleComplete} />
          </div>
        </div>
      </div>
    </div>
  );
}
