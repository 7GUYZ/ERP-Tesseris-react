import "../../../styles/jiyun/mypage-general/mypageGeneral.css";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Share2,
  User,
  Lock,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
} from "lucide-react";

export default function MobileMyPage() {
  return (
    <div className="mypagegeneral-container">
      {/* Header */}
      <div className="mypagegeneral-header">
        <ArrowLeft className="back-icon" />
        <h1 className="header-title">내 정보</h1>
      </div>

      <div className="content">
        {/* User Info Section */}
        <div className="card">
          <div className="card-content">
            <div className="user-info">
              <h2 className="username">ksh5688</h2>
            </div>

            {/* Account Info */}
            <div className="account-section">
              <div className="section-title">계정 정보</div>

              <div className="menu-item border-bottom">
                <div className="menu-left">
                  <User className="menu-icon" />
                  <span className="menu-text">휴대폰</span>
                </div>
                <div className="menu-right">
                  <span className="phone-number">010-****-5688</span>
                  <ChevronRight className="chevron-icon" />
                </div>
              </div>

              <div className="menu-item">
                <div className="menu-left">
                  <User className="menu-icon" />
                  <span className="menu-text">계좌정보 변경</span>
                </div>
                <ChevronRight className="chevron-icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="card">
          <div className="card-content">
            <div className="referral-header">
              <div className="section-title">추천 코드</div>
              <button className="copy-button">코드 복사</button>
            </div>

            {/* QR Code */}
            <div className="qr-section">
              <div className="qr-container">
                <div className="qr-code">QR CODE</div>
              </div>
              <div className="qr-label">바코드</div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="action-button">
                  <div className="action-icon">
                    <Download className="icon" />
                  </div>
                </button>
                <button className="action-button">
                  <div className="action-icon">
                    <Share2 className="icon" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Referral List Section */}
        <div className="card">
          <div className="card-content">
            <div className="referral-header">
              <div className="section-title">추천인 목록</div>
              <button className="outline-button">닫기</button>
            </div>

            {/* Table Header */}
            <div className="table-header">
              <div>No</div>
              <div>아이디</div>
              <div>이름</div>
              <div>등급</div>
              <div>가입일</div>
            </div>

            {/* Empty State */}
            <div className="empty-state">
              <div className="empty-message">검색 결과가 없습니다.</div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="card">
          <div className="card-no-padding">
            <div className="card-header">보안 / 설정</div>

            <div className="menu-list">
              <button className="menu-button">
                <div className="menu-left">
                  <Lock className="menu-icon" />
                  <span className="menu-text">비밀번호 변경</span>
                </div>
                <ChevronRight className="chevron-icon" />
              </button>

              <div className="separator"></div>

              <button className="menu-button">
                <div className="menu-left">
                  <Lock className="menu-icon" />
                  <span className="menu-text">PIN 번호 변경</span>
                </div>
                <ChevronRight className="chevron-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="card">
          <div className="card-no-padding">
            <div className="card-header">고객센터</div>

            <div className="menu-list">
              <button className="menu-button">
                <div className="menu-left">
                  <Bell className="menu-icon" />
                  <span className="menu-text">공지사항</span>
                </div>
                <ChevronRight className="chevron-icon" />
              </button>

              <div className="separator"></div>

              <button className="menu-button">
                <div className="menu-left">
                  <HelpCircle className="menu-icon" />
                  <span className="menu-text">Q&A</span>
                </div>
                <ChevronRight className="chevron-icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-no-padding">
            <div className="card-header">약관</div>

            <div className="menu-list">
              <button className="menu-button">
                <div className="menu-left">
                  <FileText className="menu-icon" />
                  <span className="menu-text">약관 및 이용 동의</span>
                </div>
                <ChevronRight className="chevron-icon" />
              </button>

              <div className="separator"></div>

              <button className="menu-button">
                <div className="menu-left">
                  <LogOut className="menu-icon" />
                  <span className="menu-text">로그아웃</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="kakao-link">카카오톡 상담하기</div>
          <div className="company-info">
            <div>㈜메이트다크라이버 | 사업자 등록번호 364-86-03002</div>
            <div>
              주소: 서울 금천구 가산디지털1로, 601-606(가산동,SKV1센터) | 대표자
              김해철
            </div>
            <div>전화: 1666-1891</div>
            <div className="copyright">
              Copyright © CMEARTER KOREA All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
