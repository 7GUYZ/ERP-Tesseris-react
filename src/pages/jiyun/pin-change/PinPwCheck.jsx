import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pwCheck } from "../../../api/auth/JiyoonAuth";
import Modal from "../../../components/feature/jiyun/Modal";
import "../../../styles/jiyun/pin-change/pin-change.css";

export default function PinPwCheck() {
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    if (!password) {
      setModalMessage("비밀번호를 입력해주세요.");
      setShowModal(true);
      return;
    }
    try {
      const response = await pwCheck(password);
      if (response.data.success) {
        navigate("/pinChange/pinInsert");
      } else {
        setModalMessage("비밀번호가 일치하지 않습니다.");
        setShowModal(true);
        setPassword("");
      }
    } catch (error) {
      setModalMessage("비밀번호 확인 중 오류가 발생했습니다.");
      setShowModal(true);
      setPassword("");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="pinchange-container">
      <div className="pinchange-header">
        <button className="back-button" onClick={() => navigate("/mypage")}> &lt; </button>
        <h2>PIN 번호 변경</h2>
      </div>
      <div className="pinchange-section">
        <div className="pinchange-card">
          <div className="pinchange-content">
            <label className="pinchange-label">로그인 비밀번호</label>
            <input
              type="password"
              className="pinchange-input"
              placeholder="PIN 번호 변경을 위해 비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="pinchange-button" onClick={handleNext}>
              다음
            </button>
          </div>
        </div>
      </div>
      {showModal && <Modal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
}
