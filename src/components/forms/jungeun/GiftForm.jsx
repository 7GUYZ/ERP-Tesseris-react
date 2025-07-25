import { useEffect, useState } from "react"
import { X, UserRoundSearch } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../../../styles/jungeun/gift.css"
import { getCurrentCM, searchUser } from "../../../api/auth/JungeunAuth"

export default function GiftForm() {
    const navigate = useNavigate();
    const [recipientEmail, setRecipientEmail] = useState("")
    const [giftAmount, setGiftAmount] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const minAmount = 10000
    const maxAmount = 2000000
    const [currentCM, setCurrentCM] = useState(0);

    const handleSearch = async () => {
        if (!recipientEmail.trim()) {
            showToast("이메일을 입력해주세요");
            return;
        }

        if (!isValidEmail(recipientEmail.trim())) {
            showToast("올바른 이메일 형식을 입력해주세요");
            return;
        }

        // 자신의 이메일인지 확인
        const userInfo = JSON.parse(localStorage.getItem("user-info"));
        if (userInfo && userInfo.email === recipientEmail.trim()) {
            showToast("선물은 다른 사용자에게만 보낼 수 있습니다");
            return;
        }

        setIsSearching(true);
        try {
            const response = await searchUser(recipientEmail);
            
            if (response.data.resultCode === 200) {
                const userData = response.data.data;
                if (userData) {
                    // userRoleIndex가 1이 아닌 경우 선물 불가
                    if (userData.userRoleIndex !== 1) {
                        setSearchResults([]);
                        setShowResults(false);
                        showToast("해당 회원에게는 선물할 수 없습니다");
                        return;
                    }
                    // 단일 사용자 데이터를 배열로 변환
                    setSearchResults([userData]);
                    setShowResults(true);
                } else {
                    setSearchResults([]);
                    setShowResults(false);
                    showToast("회원을 찾을 수 없습니다");
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
                showToast("사용자 검색에 실패했습니다");
            }
        } catch (error) {
            console.error("Search Error:", error);
            setSearchResults([]);
            setShowResults(false);
            showToast("검색 중 오류가 발생했습니다");
        } finally {
            setIsSearching(false);
        }
    }

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setRecipientEmail(user.userId);
        setShowResults(false);
    }

    const handleUserDeselect = () => {
        setSelectedUser(null);
        setRecipientEmail("");
        setSearchResults([]);
        setShowResults(false);
    }

    const handleInputChange = (e) => {
        const value = e.target.value || "";
        setRecipientEmail(value);
        // 실시간 검색 제거
    }

    const handleGiftAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "")
        setGiftAmount(value)
    }

    const formatNumber = (num) => {
        if (!num || isNaN(num)) return "";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    const isValidAmount =
        giftAmount && Number.parseInt(giftAmount) >= minAmount && Number.parseInt(giftAmount) <= maxAmount
    const isFormValid = selectedUser && isValidAmount
    const remainingCM = currentCM - (Number.parseInt(giftAmount) || 0)

    const getInitials = (name) => {
        return name.split('').slice(0, 1).join('').toUpperCase();
    }

    // 사용자 역할 표시 함수
    const getUserRoleText = (roleIndex) => {
        switch (roleIndex) {
            case 1:
                return "일반";
            case 2:
                return "사업자";
            case 3:
                return "가맹점";
            default:
                return "알 수 없음";
        }
    }

    // 사용자 역할 배지 색상 함수
    const getUserRoleColor = (roleIndex) => {
        switch (roleIndex) {
            case 1:
                return "#10B981"; // 초록색
            case 2:
                return "#3B82F6"; // 파란색
            case 3:
                return "#F59E0B"; // 주황색
            default:
                return "#6B7280"; // 회색
        }
    }

    // 전화번호 마스킹 함수
    const maskPhoneNumber = (phone) => {
        if (!phone) return "";
        
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 10) return phone;
        
        // 앞 3자리 + **** + 뒤 4자리
        const prefix = cleaned.slice(0, 3);
        const suffix = cleaned.slice(-4);
        
        return `${prefix}-****-${suffix}`;
    }

    // 이름 마스킹 함수
    const maskName = (name) => {
        if (!name || name.length < 2) return name;
        
        if (name.length === 2) {
            return name.charAt(0) + '*';
        }
        
        return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
    }

    // 이메일 형식 검사 함수
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 토스트 메시지 표시 함수
    const showToast = (message) => {
        window.dispatchEvent(
            new CustomEvent("show-toast", {
                detail: {
                    type: "error",
                    message: message,
                },
            })
        );
    }

    // 선물하기 버튼 클릭 핸들러
    const handleGiftSubmit = () => {
        if (isFormValid) {
            // 선물할 정보를 state로 전달
            navigate('/gift/pin', {
                state: {
                    giftAmount: Number.parseInt(giftAmount),
                    recipientUser: selectedUser,
                    currentCM: currentCM
                }
            });
        }
    }

    // 현재 CM 보유량 백엔드에서 가져오기
    useEffect(() => {
        const user_index = Number(JSON.parse(localStorage.getItem("user-info"))?.user_index);
        const fetchCurrentCM = async () => {
            try {
                const response = await getCurrentCM(user_index);
                if (response.data.resultCode === 200) {
                    setCurrentCM(response.data.data.currentCM);
                }
            } catch (e) {
                console.error("Error fetching current CM:", e);
                setCurrentCM(0);
            }
        };
        fetchCurrentCM();
    }, []);

    return (
        <div>
            {/* Page Title */}
            <div className="gift-page-header">
                <h1 className="gift-page-title">선물하기</h1>
                <p className="gift-page-subtitle">다른 사용자에게 CM을 선물할 수 있습니다</p>
            </div>

            <div className="gift-container">
                <div className="gift-content">
                    {/* Current CM Section */}
                    <div className="gift-section">
                        <h2 className="gift-section-title">현재 CM 보유액</h2>
                        <div className="gift-cm-card">
                            <div className="gift-cm-status">
                                <span className="gift-status-badge">사용가능</span>
                            </div>
                            <div className="gift-cm-amount">{formatNumber(currentCM)} CM </div>
                        </div>
                    </div>

                    {/* Recipient ID Section */}
                    <div className="gift-section">
                        <h2 className="gift-section-title">선물할 회원 <span style={{color: 'lightslategray',  fontWeight: '500'}}>(이메일 검색)</span></h2>
                        <div className="gift-input-group">
                            <input
                                type="email"
                                className="gift-input"
                                placeholder="이메일을 입력하세요."
                                value={recipientEmail || ""}
                                onChange={handleInputChange}
                            />
                            <button
                                className={`gift-search-btn ${isSearching ? "gift-searching" : ""}`}
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <div className="gift-spinner"></div>
                                ) : (
                                    <UserRoundSearch size={20} />
                                )}
                            </button>
                        </div>

                        {/* Search Results */}
                        {showResults && searchResults.length > 0 && (
                            <div className="gift-search-results">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.userIndex}
                                        className={`gift-search-result-item ${selectedUser?.userIndex === user.userIndex ? 'selected' : ''}`}
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <div className="gift-user-info">
                                            <div className="gift-user-avatar">
                                                {getInitials(user.userName)}
                                            </div>
                                            <div className="gift-user-details">
                                                <div className="gift-user-header">
                                                    <div className={`gift-user-name ${selectedUser?.userIndex === user.userIndex ? 'selected' : ''}`}>
                                                        {maskName(user.userName)}
                                                    </div>
                                                    <div 
                                                        className="gift-user-role-badge"
                                                        style={{ backgroundColor: getUserRoleColor(user.userRoleIndex) }}
                                                    >
                                                        {getUserRoleText(user.userRoleIndex)}
                                                    </div>
                                                </div>
                                                <div className={`gift-user-id ${selectedUser?.userIndex === user.userIndex ? 'selected' : ''}`}>
                                                    {user.userEmail}
                                                </div>
                                                <div className={`gift-user-phone ${selectedUser?.userIndex === user.userIndex ? 'selected' : ''}`}>
                                                    {maskPhoneNumber(user.userPhone)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedUser && (
                            <div className="gift-selected-user">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <p style={{ color: '#10B981', fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>
                                        ✓ {maskName(selectedUser.userName)} ({selectedUser.userEmail}) [{getUserRoleText(selectedUser.userRoleIndex)} 회원]
                                    </p>
                                    <button className="gift-deselect-btn" onClick={handleUserDeselect}>
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gift Amount Section */}
                    <div className="gift-section">
                        <h2 className="gift-section-title">선물할 CM</h2>
                        <div className="gift-input-group">
                            <input
                                type="text"
                                className="gift-input"
                                placeholder="금액을 입력하세요."
                                value={giftAmount && giftAmount !== "" ? formatNumber(Number.parseInt(giftAmount)) : ""}
                                onChange={handleGiftAmountChange}
                            />
                            <span className="gift-currency">CM</span>
                        </div>
                        <p className="gift-info-text">
                            * 선물 금액은 최소 {formatNumber(minAmount)} ~ 최대 {formatNumber(maxAmount)} CM 입니다.
                        </p>
                    </div>

                    {/* Remaining CM Section */}
                    <div className="gift-section">
                        <h2 className="gift-section-title">선물 후 CM 보유액</h2>
                        <div className="gift-cm-card">
                            <div className="gift-cm-status">
                                <span className="gift-status-badge">사용가능</span>
                            </div>
                            <div className="gift-cm-amount">{formatNumber(Math.max(0, remainingCM))} CM</div>
                        </div>
                    </div>

                    {/* Gift Button */}
                    <button className={`gift-submit-btn ${isFormValid ? "gift-active" : ""}`} disabled={!isFormValid} onClick={handleGiftSubmit}>
                        선물하기
                    </button>
                </div>
            </div>
        </div>
    );
}