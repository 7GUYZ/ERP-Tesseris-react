import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/jiyun/terms/privacy.css";

export default function PrivacyTermsPage() {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <div className="terms-header">
        <button className="back-button" onClick={() => navigate("/terms")}>
          &lt;
        </button>
        <h2>개인정보 수집 및 이용약관</h2>
      </div>
      <div className="terms-section">
        <div className="terms-card">
          <div className="terms-content">
            <ul className="terms-titlebox">
              <li className="terms-title">개인정보 수집 및 이용약관</li>
              <li className="terms-version">ver. 2022.11.30</li>
            </ul>

            <div className="terms-text">
              <p>
                씨엠바더코리아 (이하 '"회사"') 개인정보 수집 이용 동의
                <br />
                "회사"는 원활한 서비스 제공을 위해 최소한의 범위 내에서 아래와 같이
                개인정보를 수집 이용합니다.
                <br />
                <br />
                <strong>1. 수집 이용 항목</strong>
                <br />
                (1) 회사는 회원 가입 시 아이디, 비밀번호, 이름, 생년월일, 성별,
                휴대폰번호, 이메일주소, CI, DI, 가게정보(업종, 지역, 시작연도)를
                수집 이용합니다.
                <br />
                (2) 서비스 이용과정에서 아래와 같은 자동 수집 정보가 생성되어 수집,
                저장, 조합, 분석될 수 있습니다.
                <br />
                - 접속지 정보(IP주소), 쿠키, 방문기록, 서비스 이용기록,
                기기정보(기기고유번호, OS버전, 모델명, 제조사 정보 등), 광고ID
                <br />
                <br />
                <strong>2. 수집 이용 목적</strong>
                <br />
                회원가입 및 선택서비스에서 수집한 개인정보는 아래 목적으로
                이용됩니다.
                <br />
                - 회원 가입 의사 확인, 일반회원 식별, 본인확인, 회원제 서비스 제공,
                회원관리
                <br />
                - 서비스 제공 및 관리(제휴서비스 포함), 서비스 개선, 신규 서비스
                개발
                <br />
                - 유료서비스 및 상품 구매 및 결제(환불 포함), 배송
                서비스(교환/반품/환불 포함)
                <br />
                - 민원처리 및 고객상담
                <br />
                - 고지사항 전달
                <br />
                - 불법 및 부정이용 방지, 특정금융거래정보의 보고 및 이용 등에 관한
                법률에 따른 고객 확인, 의심거래보고 등 자금세탁방지
                <br />
                - 서비스 방문 및 이용기록 통계 및 분석
                <br />
                - 서비스 만족도 조사 및 관리
                <br />
                - 알림 서비스
                <br />
                <br />
                <strong>3. 보유 및 이용 기간</strong>
                <br />
                (1) 수집한 개인정보는 회원 탈퇴 시 즉시 파기합니다.
                <br />
                (2) 관련 법령에 따라 회원탈퇴 이후에도 보관해야하는 경우에는
                법령에서 정한 보관기간을 따릅니다.
                <br />
                (3) 회사는 회원가입 남용, 불법 및 부정 이용 방지를 위해 아이디, DI를
                회원탈퇴 3년 후 파기합니다.
                <br />
                개인정보 수집 이용에 동의하지 않으실 수 있으며, 동의하지 않는 경우
                회원가입이 제한됩니다.
                <br />그 밖의 개인정보 처리에 관한 사항은 개인정보 처리방침에서
                확인하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
