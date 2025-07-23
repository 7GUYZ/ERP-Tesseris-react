import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import PinInput from "../../../components/forms/jiyun/pin-change/PinInput";
import Modal from "../../../components/feature/jiyun/Modal";
import "../../../styles/jiyun/pin-change/pin-change.css";
import { pinChange } from "../../../api/auth/JiyoonAuth";

export default function PinStep2() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const originalPin = state?.originalPin;
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [pinInputKey, setPinInputKey] = useState(0);

  const handleConfirm = (inputPin) => {
    if (error) return;

    if (inputPin === originalPin) {
      console.log("보내는 데이터:", { userCmPincode: inputPin });
      const updatePin = async () => {
        try {
          const response = await pinChange({ userCmPincode: inputPin });
          setModalMessage("PIN 변경 완료");
          setShowModal(true);
          setTimeout(() => {
            navigate("/pinChange/pinComplete");
          }, 1500);
        } catch {
          setModalMessage("PIN 설정 실패");
          setShowModal(true);
        }
      };
      updatePin();
    } else {
      setError(true);
      setModalMessage("입력한 PIN이 일치하지 않습니다.");
      setShowModal(true);
      setPinInputKey((prev) => prev + 1);
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
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
        <PinInput key={pinInputKey} onComplete={handleConfirm} />
      </div>

      {showModal && <Modal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
}
