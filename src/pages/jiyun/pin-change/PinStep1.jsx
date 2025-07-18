import { useNavigate } from "react-router-dom";
import PinInput from "../../../components/forms/jiyun/pin-change/PinInput";
import "../../../styles/jiyun/pin-change/pin-change.css";

export default function PinStep1() {
  const navigate = useNavigate();

  const handleComplete = (pin) => {
    navigate("/pinChange/pinconfirm", { state: { originalPin: pin } });
  };

  return (
    <div className="pin-container">
      <div className="pin-header">
        <span className="back-icon" onClick={() => navigate(-1)}>
          &lt;
        </span>
        <div className="header-title-wrapper">
          <h1 className="pin-title">PIN 번호 변경</h1>
        </div>
      </div>

      <div className="pin-content">
        <h2>새 PIN 번호 입력</h2>
        <p>변경하실 PIN 번호를 입력해주세요.</p>
        <PinInput onComplete={handleComplete} />
      </div>
    </div>
  );
}
