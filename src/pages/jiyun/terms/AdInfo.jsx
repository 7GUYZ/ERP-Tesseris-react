import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/jiyun/terms/adinfo.css";

export default function AdInfoTermsPage() {
  const navigate = useNavigate();

  return (
    <div className="terms-wrap">
      <header className="terms-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &lt;
        </button>
        <h2>이용약관</h2>
      </header>

      <main className="terms-content">
        <ul className="terms-titlebox">
          <li className="terms-title">광고성 정보 수신 동의</li>
          <li className="terms-version">ver. 2022.11.30</li>
        </ul>

        <section className="terms-text">
          <p>
            "일반회원" 회원에게 제공하는 서비스(가게홍보서비스, 위치정보서비스
            등)의 광고성 정보를 수신합니다.
            <br />
            <br />
            광고성 정보는 신규 서비스 홍보 및 회사에서 제공하는 서비스에 대한
            소개, 이벤트 안내 등을 포함합니다.
            <br />
            <br />
            광고성 정보 수신 동의는{" "}
            <strong>회사 &gt; 내 정보 관리 &gt; 혜택 알림 설정</strong> 에서
            변경할 수 있습니다.
          </p>
        </section>
      </main>
    </div>
  );
}
