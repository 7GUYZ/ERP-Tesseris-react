import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/jiyun/terms/marketing.css";

export default function MarketingTermsPage() {
  const navigate = useNavigate();

  return (
    <div className="terms-wrap">
      <header className="terms-header">
        <button onClick={() => navigate("/terms")} className="back-button">
          &lt;
        </button>
        <h2>이용약관</h2>
      </header>

      <main className="terms-content">
        <ul className="terms-titlebox">
          <li className="terms-title">마케팅/서비스, 이벤트 정보제공</li>
          <li className="terms-version">ver. 2022.11.30</li>
        </ul>

        <section className="terms-text">
          <p>
            <strong>
              마케팅/서비스/이벤트 정보 제공을 위한 개인정보 수집 이용 동의
            </strong>
            <br />
            "회사"는 선택 항목으로 아래 개인정보를 추가 수집 이용합니다.
            <br />
            <br />
            <strong>1. 수집 이용 항목</strong>
            <br />
            - 이메일주소, 휴대폰번호, 회원 가입 시 수집한 항목, 서비스 이용 시
            수집한 항목, 서비스 이용기록
            <br />
            <br />
            <strong>2. 수집 이용 목적</strong>
            <br />
            - 회사에서 제공하는 서비스 일체에 대한 맞춤 서비스 제공, 마케팅 및
            프로모션 활용 (광고성/이벤트 정보 제공)
            <br />
            <br />
            <strong>3. 보유 및 이용 기간</strong>
            <br />
            - 회원 탈퇴 또는 동의 철회 시까지 합니다.
            <br />
            (단, 관련법령 또는 회사 정책에 의하여 보관해야 하는 경우는 예외)
            <br />
            <br />
            위 개인정보 수집 이용 동의는 선택사항이므로 동의를 거부하더라도
            서비스 이용이 가능합니다.
            <br />
            더 이상 맞춤 서비스 제공, 마케팅 및 프로모션 활용을 원하시지 않는
            경우,
            <br />
            <strong> &gt; 내 정보 관리 &gt; 혜택 알림 설정</strong> 메뉴 혹은,
            <br />
            개별 서비스의 <strong>내 정보 관리</strong> 메뉴에서 동의를 철회하실
            수 있습니다.
          </p>
        </section>

        <hr className="divider" />

        <section className="agree-info">
          <p>
            정보제공 및 이용 동의를 철회한 이후부터는 해당 서비스에서 회원님의
            정보를 조회할 수 없습니다.
          </p>
        </section>
      </main>
    </div>
  );
}
