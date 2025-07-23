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
      // 서버에 비밀번호 확인 요청
      const response = await pwCheck(password);
      // 응답에서 success 필드 확인
      if (response.data.success) {
        // 성공 시 다음 단계로 이동
        navigate("/pinChange/pinInsert");
      } else {
        // 비밀번호 불일치
        setModalMessage("비밀번호가 일치하지 않습니다.");
        setShowModal(true);
        setPassword(""); // 비밀번호 입력 필드 초기화
      }
    } catch (error) {
      // 네트워크 에러 등 기타 에러
      setModalMessage("비밀번호 확인 중 오류가 발생했습니다.");
      setShowModal(true);
      setPassword(""); // 에러 발생 시에도 비밀번호 입력 필드 초기화
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="pin-container">
      <div className="pin-header">
        <span className="back-icon" onClick={() => navigate("/mypage")}>
          &lt;
        </span>
        <div className="header-title-wrapper">
          <h1 className="pin-title">PIN 번호 변경</h1>
        </div>
      </div>

      <div className="pin-password-content">
        <label className="pin-password-label">로그인 비밀번호</label>
        <input
          type="password"
          className="pin-password-input"
          placeholder="PIN 번호 변경을 위해 비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="pin-next-button" onClick={handleNext}>
        다음
      </button>

      {showModal && <Modal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
}
