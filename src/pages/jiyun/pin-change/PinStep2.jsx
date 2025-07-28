import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef(null);
  const navigatedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleConfirm = (inputPin) => {
    if (error || isSubmitting) return;
    setIsSubmitting(true);

    if (inputPin === originalPin) {
      const updatePin = async () => {
        try {
          await pinChange({ userCmPincode: inputPin });
          setModalMessage("PIN 변경 완료");
          setShowModal(true);
          timeoutRef.current = setTimeout(() => {
            if (!navigatedRef.current) {
              navigatedRef.current = true;
              navigate("/pinChange/pinComplete");
            }
          }, 1500);
        } catch {
          setModalMessage("PIN 설정 실패");
          setShowModal(true);
          setIsSubmitting(false);
        }
      };
      updatePin();
    } else {
      setError(true);
      setModalMessage("입력한 PIN이 일치하지 않습니다.");
      setShowModal(true);
      setPinInputKey((prev) => prev + 1);
      setTimeout(() => setError(false), 3000);
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        navigate("/pinChange/pinComplete");
      }
    }
  };

  return (
    <div className="pinchange-container">
      <div className="pinchange-header">
        <button className="pinchange-back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h2>PIN 번호 확인</h2>
      </div>
      <div className="pinchange-section">
        <div className="pinchange-card">
          <div className="pinchange-content-key">
            <h3>PIN 번호 재입력</h3>
            <p>다시 한번 입력해주세요.</p>
            <PinInput key={pinInputKey} onComplete={handleConfirm} />
          </div>
        </div>
      </div>
      {showModal && <Modal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
}
