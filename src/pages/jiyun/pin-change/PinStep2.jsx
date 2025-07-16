import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import PinInput from "../../../components/forms/jiyun/pin-change/PinInput";
import "../../../styles/jiyun/pin-change/pin-change.css";
import { pinChange } from "../../../api/auth/JiyoonAuth";

export default function PinStep2() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const originalPin = state?.originalPin;
  const [error, setError] = useState(false);

  const handleConfirm = (inputPin) => {
    if (inputPin === originalPin) {
      console.log("보내는 데이터:", { userCmPincode: inputPin });
      const updatePin = async () => {
        try {
          const response = await pinChange({ userCmPincode: inputPin });
          alert("PIN 설정 완료");
        } catch {
          alert("PIN 설정 실패");
        }
      };
      updatePin();
    } else {
      setError(true);
      alert("입력한 PIN이 일치하지 않습니다.");
    }
  };

  return (
    <div className="pin-container">
      <div className="pin-header">
        <span className="back-icon" onClick={() => navigate(-1)}>
          &lt;
        </span>
        <div className="header-title-wrapper">
          <h1 className="pin-title">PIN 번호 확인</h1>
        </div>
      </div>

      <div className="pin-content">
        <h2>PIN 번호 재입력</h2>
        <p>다시 한번 입력해주세요.</p>
        <PinInput onComplete={handleConfirm} />
      </div>
    </div>
  );
}
