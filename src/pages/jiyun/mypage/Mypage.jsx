import { useEffect, useState, useRef } from "react";
import { getSuggestion, getNickname } from "../../../api/auth/JiyoonAuth";
import Toast from "../../../components/ui/jungeun/Toast";
import { useNavigate, Link } from "react-router-dom";
import "../../../styles/jiyun/mypage/mypage.css";
import {
  ChevronRight,
  User,
  Lock,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
} from "lucide-react";
import { logout } from "../../../api/auth/JungeunAuth";
import useAuthStore from "../../../store/jungeun/AuthStore";

export default function MobileMyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [suggestionList, setSuggestionList] = useState([]);
  const [nickname, setNickname] = useState("");
  const [suggestionLoading, setSuggestionLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();
  const qrRef = useRef(null);

  const handleLogout = async (e) => {
    e.preventDefault()

    try {
      const response = await logout();
      if (response.data.status === "success") {
        useAuthStore.getState().zu_logout();
        localStorage.removeItem("access-token");
        localStorage.removeItem("user-info");
        // 홈으로 이동
        navigate("/");

      }
    } catch (error) {

    }
  }

  useEffect(() => {
    const userData = localStorage.getItem("user-info");
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  // 닉네임 불러오기
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await getNickname();
        setNickname(response.data.nickname);
      } catch (err) {
        setNickname("");
      }
    };
    fetchNickname();
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

  // 역할별 조건부 렌더링 함수들
  const isUser = () => userInfo?.user_role_index === "1";
  const isAdmin = () => userInfo?.user_role_index === "2";
  const isBusiness = () => userInfo?.user_role_index === "3";
  const showReferralSection = () => isUser() || isBusiness();
  const showBusinessInfo = () => isBusiness();

  return (
    <div className="mypage-container">
      {toastVisible && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={handleToastClose}
        />
      )}
      <main className="mypage-main">
        <div className="mypage-section">
          <div className="mypage-card">
            <div className="mypage-profileHeader">
              <h5 className="mypage-userName">
                {userInfo?.name || "로딩 중..."}
              </h5>
              <h2 className="mypage-userSubtitle">
                {nickname || "로딩 중..."}
              </h2>
            </div>
            <div className="mypage-profileInfo">
              <div className="mypage-sectionTitle">계정 정보</div>
              <div className="mypage-infoRow">
                <div className="mypage-infoLabel">
                  <User className="menuIcon" />
                  <span>휴대폰</span>
                </div>
                <span className="mypage-infoValue">
                  {maskPhoneNumber(userInfo?.phone) || "로딩 중..."}
                </span>
              </div>
              {/* 사업자 등록 정보 */}
              {showBusinessInfo() && (
                <button className="mypage-infoButton">
                  <div className="mypage-infoLabel">
                    <User className="menuIcon" />
                    <span>사업자 등록 정보</span>
                  </div>
                  <ChevronRight className="menuIcon" />
                </button>
              )}
              {/* 가맹점 정보  */}
              {showBusinessInfo() && (
                <button className="mypage-infoButton">
                  <div className="mypage-infoLabel">
                    <User className="menuIcon" />
                    <span>가맹점 정보</span>
                  </div>
                  <ChevronRight className="menuIcon" />
                </button>
              )}
              {/* 계좌정보 변경  */}
              <Link to="/user_update" className="mypage-infoButton">
                <div className="mypage-infoLabel">
                  <User className="menuIcon" />
                  <span>계정정보 변경</span>
                </div>
                <ChevronRight className="menuIcon" />
              </Link>
            </div>
          </div>
        </div>
        {/* 추천 코드 */}
        {showReferralSection() && (
          <div className="mypage-section">
            <div className="mypage-card">
              <div className="mypage-cardHeader">
                <h3 className="mypage-cardTitle">추천 코드</h3>
              </div>
              <div className="mypage-referralContent">
                <span className="mypage-referralCode">{userInfo?.email}</span>
                <button className="mypage-copyButton" onClick={handleCopyUserId}>
                  코드 복사
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 추천인 목록 */}
        {showReferralSection() && (
          <div className="mypage-section">
            <div className="mypage-card">
              <div className="mypage-cardHeader">
                <h3 className="mypage-cardTitle">추천인 목록</h3>
                <div className="mypage-headerButtons">
                  <button
                    className="mypage-toggleButton"
                    onClick={toggleSuggestion}
                  >
                    {isSuggestionOpen ? "닫기" : "열기"}
                  </button>
                </div>
              </div>
              {isSuggestionOpen && (
                <>
                  <div className="mypage-tableContainer">
                    <table className="mypage-table">
                      <thead>
                        <tr className="mypage-headerRow">
                          <th>No</th>
                          <th>아이디</th>
                          <th>이름</th>
                          <th>등급</th>
                          <th>가입일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr
                            key={indexOfFirstItem + index}
                            className="mypage-dataRow"
                          >
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td className="mypage-idCell">
                              {item.suggestionUserEmail || "-"}
                            </td>
                            <td>{item.suggestionUserName || "-"}</td>
                            <td>{item.suggestionUserRole || "-"}</td>
                            <td>{item.joinDate || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="mypage-pagination">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`mypage-pageNumber${currentPage === page ? " active" : ""
                              }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <div className="mypage-section">
          <div className="mypage-card">
            <div className="mypage-cardHeader">
              <h3 className="mypage-cardTitle">보안 / 설정</h3>
            </div>
            <div className="mypage-menuContent">
              <Link to="/mypage/changepassword" className="mypage-menuItem">
                <div className="mypage-menuLabel">
                  <Lock className="menuIcon" />
                  <span>비밀번호 변경</span>
                </div>
                <ChevronRight className="menuIcon" />
              </Link>
              <div className="mypage-separator"></div>
              <Link to="/pinChange/pwCheck" className="mypage-menuItem">
                <div className="mypage-menuLabel">
                  <Lock className="menuIcon" />
                  <span>PIN 번호 변경</span>
                </div>
                <ChevronRight className="menuIcon" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mypage-section">
          <div className="mypage-card">
            <div className="mypage-cardHeader">
              <h3 className="mypage-cardTitle">고객센터</h3>
            </div>
            <div className="mypage-menuContent">
              <Link to="/notice-list" className="mypage-menuItem">
                <div className="mypage-menuLabel">
                  <Bell className="menuIcon" />
                  <span>공지사항</span>
                </div>
                <ChevronRight className="menuIcon" />
              </Link>
              <div className="mypage-separator"></div>
              <Link to="/sichan/qna/list" className="mypage-menuItem">
                <div className="mypage-menuLabel">
                  <HelpCircle className="menuIcon" />
                  <span>Q&A</span>
                </div>
                <ChevronRight className="menuIcon" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mypage-section">
          <div className="mypage-card">
            <div className="mypage-cardHeader">
              <h3 className="mypage-cardTitle">약관</h3>
            </div>
            <div className="mypage-menuContent">
              <Link to="/terms" className="mypage-menuItem">
                <div className="mypage-menuLabel">
                  <FileText className="menuIcon" />
                  <span>약관 및 이용 동의</span>
                </div>
                <ChevronRight className="menuIcon" />
              </Link>
              <div className="mypage-separator"></div>
              <button className="mypage-menuItem" onClick={handleLogout}>
                <div className="mypage-menuLabel" >
                  <LogOut className="menuIcon" />
                  <span>로그아웃</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <footer className="mypage-footer">
          <div className="mypage-footerContent">
            <a
              className="mypage-kakaoLink"
              href="https://pf.kakao.com/_ebYWn/chat"
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오톡 상담하기
            </a>
            <div className="mypage-companyInfo">
              씨엠바더코리아㈜ | 사업자 등록번호 364-86-03002
              <br />
              주소: 서울 금천구 가산디지털1로 171, 601~606호(가산동,SKV1센터) |
              대표자 김애경
              <br />
              연락처: 1566-1691
            </div>
            <div className="mypage-copyright">
              Copyright © CMBARTER KOREA All Rights Reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
