import { useEffect, useState, useRef } from "react";
import { getSuggestion } from "../../../api/auth/JiyoonAuth";
import Toast from "../../../components/ui/jungeun/Toast";
import { useNavigate, Link } from "react-router-dom";
import "../../../styles/jiyun/mypage/mypage.css";
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
  const [userInfo, setUserInfo] = useState(null);
  const [suggestionList, setSuggestionList] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();
  const qrRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user-info");
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchSuggestionList = async () => {
      try {
        const response = await getSuggestion();
        setSuggestionList(response.data);
      } catch (err) {
        console.error("추천인 목록을 불러오지 못했습니다:", err);
      } finally {
        setSuggestionLoading(false);
      }
    };
    fetchSuggestionList();
  }, []);

  // 전화번호 마스킹 처리
  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3");
  };

  // userId 복사 함수
  const handleCopyUserId = () => {
    if (userInfo?.email) {
      navigator.clipboard.writeText(userInfo.email);
      setToastMessage("코드가 복사되었습니다.");
      setToastVisible(true);
    }
  };

  const handleToastClose = () => {
    setToastVisible(false);
  };

  const toggleSuggestion = () => {
    setIsSuggestionOpen(!isSuggestionOpen);
  };

  // 페이징 관련 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = suggestionList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(suggestionList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleMainPage = () => {
    navigate("/TestMain");
  };

  const handleDownloadQRCode = () => {
    const canvas = qrRef.current?.querySelector?.("canvas") || qrRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "tesseris_qrcode.png";
      link.click();
    }
  };

  return (
    <div className="general-mypagegeneral-container">
      {toastVisible && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={handleToastClose}
        />
      )}
      <div className="general-mypagegeneral-header">
        <ArrowLeft className="general-back-icon" onClick={handleMainPage} />
        <h1 className="general-header-title">내 정보</h1>
      </div>

      <div className="general-content">
        <div className="general-card">
          <div className="general-card-content">
            <div className="general-user-info">
              <h5 className="general-username">
                {userInfo?.name || "로딩 중..."}
              </h5>
              <h2 className="general-username">
                {userInfo?.email ? userInfo.email.split('@')[0] : "로딩 중..."}
              </h2>
            </div>

            <div className="general-account-section">
              <div className="general-section-title">계정 정보</div>

              <div className="general-menu-item general-border-bottom">
                <div className="general-menu-left">
                  <User className="general-menu-icon" />
                  <span className="general-menu-text">휴대폰</span>
                </div>
                <div className="general-menu-right">
                  <span className="general-phone-number">
                    {maskPhoneNumber(userInfo?.phone) || "로딩 중..."}
                  </span>
                  <div className="general-chevron-icon" />
                </div>
              </div>

              <Link className="general-menu-item">
                <div className="general-menu-left">
                  <User className="general-menu-icon" />
                  <span className="general-menu-text">계좌정보 변경</span>
                </div>
                <ChevronRight className="general-chevron-icon" />
              </Link>
            </div>
          </div>
        </div>

        <div className="general-card">
          <div className="general-card-content">
            <div className="general-referral-header">
              <div className="general-section-title">추천 코드</div>
              <button
                className="general-copy-button"
                onClick={handleCopyUserId}
              >
                코드 복사
              </button>
            </div>
          </div>
        </div>

        {/* Referral List Section */}
        <div className="general-card">
          <div className="general-card-content">
            <div className="general-referral-header">
              <div className="general-section-title">추천인 목록</div>
              <button
                className="general-outline-button"
                onClick={toggleSuggestion}
              >
                {isSuggestionOpen ? "닫기" : "열기"}
              </button>
            </div>

            {isSuggestionOpen && (
              <>
                {/* Table Header */}
                <div className="general-table-header">
                  <div>No</div>
                  <div>아이디</div>
                  <div>이름</div>
                  <div>등급</div>
                  <div>가입일</div>
                </div>

                {/* Table Content */}
                {suggestionLoading ? (
                  <div className="general-empty-state">
                    <div className="general-empty-message">로딩 중...</div>
                  </div>
                ) : suggestionList.length > 0 ? (
                  <>
                    <div className="general-table-content">
                      {currentItems.map((item, index) => (
                        <div
                          key={indexOfFirstItem + index}
                          className="general-table-row"
                        >
                          <div>{indexOfFirstItem + index + 1}</div>
                          <div>{item.recommendationUserId || "-"}</div>
                          <div>{item.recommendationUserName || "-"}</div>
                          <div>{item.recommendationUserRole || "-"}</div>
                          <div>{item.joinDate || "-"}</div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="general-pagination">
                        <div className="general-page-numbers">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              className={`general-page-number ${
                                currentPage === page ? "active" : ""
                              }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="general-empty-state">
                    <div className="general-empty-message">
                      검색 결과가 없습니다.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="general-card">
          <div className="general-card-no-padding">
            <div className="general-card-header">보안 / 설정</div>

            <div className="general-menu-list">
              <Link className="general-menu-button">
                <div className="general-menu-left">
                  <Lock className="general-menu-icon" />
                  <span className="general-menu-text">비밀번호 변경</span>
                </div>
                <ChevronRight className="general-chevron-icon" />
              </Link>

              <div className="general-separator"></div>

              <Link to="/pinChange/pwCheck" className="general-menu-button">
                <div className="general-menu-left">
                  <Lock className="general-menu-icon" />
                  <span className="general-menu-text">PIN 번호 변경</span>
                </div>
                <ChevronRight className="general-chevron-icon" />
              </Link>
            </div>
          </div>
        </div>

        <div className="general-card">
          <div className="general-card-no-padding">
            <div className="general-card-header">고객센터</div>

            <div className="general-menu-list">
              <Link to="/notice-list" className="general-menu-button">
                <div className="general-menu-left">
                  <Bell className="general-menu-icon" />
                  <span className="general-menu-text">공지사항</span>
                </div>
                <ChevronRight className="general-chevron-icon" />
              </Link>

              <div className="general-separator"></div>

              <Link className="general-menu-button">
                <div className="general-menu-left">
                  <HelpCircle className="general-menu-icon" />
                  <span className="general-menu-text">Q&A</span>
                </div>
                <ChevronRight className="general-chevron-icon" />
              </Link>
            </div>
          </div>
        </div>

        <div className="general-card">
          <div className="general-card-no-padding">
            <div className="general-card-header">약관</div>

            <div className="general-menu-list">
              <Link to="/terms" className="general-menu-button">
                <div className="general-menu-left">
                  <FileText className="general-menu-icon" />
                  <span className="general-menu-text">약관 및 이용 동의</span>
                </div>
                <ChevronRight className="general-chevron-icon" />
              </Link>

              <div className="general-separator"></div>

              <button className="general-menu-button">
                <div className="general-menu-left">
                  <LogOut className="general-menu-icon" />
                  <span className="general-menu-text">로그아웃</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="general-footer">
          <Link className="general-kakao-link">카카오톡 상담하기</Link>
          <div className="general-company-info">
            <div>씨엠바더코리아㈜ | 사업자 등록번호 364-86-03002</div>
            <div>
              주소: 서울 금천구 가산디지털1로 171, 601~606호(가산동,SKV1센터) |
              대표자 김애경
            </div>
            <div>연락처: 1566-1691</div>
            <div className="general-copyright">
              Copyright © CMBARTER KOREA All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
