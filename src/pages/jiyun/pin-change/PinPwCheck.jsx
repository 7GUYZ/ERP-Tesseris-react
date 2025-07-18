import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pwCheck } from "../../../api/auth/JiyoonAuth";
import "../../../styles/jiyun/pin-change/pin-change.css";

export default function PinPwCheck() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    try {
      // 서버에 비밀번호 확인 요청
      await pwCheck(password);
      // 성공 시 다음 단계로 이동
      navigate("/pinChange/pinInsert");
    } catch (error) {
      // 실패 시 alert
      alert("비밀번호가 일치하지 않습니다.");
    }
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
    </div>
  );
}
