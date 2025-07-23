import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Store, 
  ShoppingCart, 
  CreditCard, 
  Settings, 
  FileText,
  BarChart3,
  Users,
  Bell,
  HelpCircle
} from "lucide-react";

import "../../styles/jungeun/testMain.css"; // 아래 CSS를 이 파일에 저장

export default function TestMain() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("user-info")) || {};
    setUserInfo(storedUserInfo);
    setUserRole(storedUserInfo.user_role_index);
  }, []);

  // 역할별 메뉴 설정
  const getMenuByRole = (roleIndex) => {
    switch (roleIndex) {
      case "1": // 일반 사용자
        return [
          { id: "cm-charge", title: "CM 충전", icon: CreditCard, action: () => navigate("/TestMain"), color: "#3b82f6" },
          { id: "cm-history", title: "CM 내역", icon: FileText, action: () => navigate("/TestMain"), color: "#22c55e" },
          { id: "commission-history", title: "수당 내역", icon: BarChart3, action: () => navigate("/TestMain"), color: "#eab308" },
          { id: "homepage", title: "씨엠바더 홈페이지", icon: Store, action: () => window.open("/TestMain", "_blank"), color: "#a21caf" },
          { id: "franchise-apply", title: "가맹점 신청", icon: ShoppingCart, action: () => navigate("/registerstore0"), color: "#ef4444" },
          { id: "coupon-box", title: "쿠폰 보관함", icon: FileText, action: () => navigate("/TestMain"), color: "#6366f1" },
          { id: "kakao-consult", title: "카톡 상담", icon: HelpCircle, action: () => window.open("/TestMain", "_blank"), color: "#3b82f6" },
          { id: "game-reward", title: "씨엠 게임 보상", icon: Users, action: () => navigate("/TestMain"), color: "#22c55e" },
          { id: "coupon-event", title: "쿠폰 이벤트", icon: Bell, action: () => navigate("/TestMain"), color: "#eab308" },
          { id: "shop", title: "쇼핑몰", icon: Store, action: () => window.open("/TestMain", "_blank"), color: "#a21caf" }
        ];
      
      case "2": // 사업자
        return [
          { id: "cm-history", title: "CM 내역", icon: FileText, action: () => navigate("/TestMain"), color: "#22c55e" },
          { id: "homepage", title: "씨엠바더 홈페이지", icon: Store, action: () => window.open("/TestMain", "_blank"), color: "#a21caf" },
          { id: "commission-status", title: "중개수수료 현황", icon: BarChart3, action: () => navigate("/TestMain"), color: "#eab308" },
          { id: "sub-business", title: "산하 사업자", icon: Users, action: () => navigate("/BusinessList"), color: "#6366f1" },
          { id: "sub-franchise", title: "산하 가맹점", icon: ShoppingCart, action: () => navigate("/StoreList"), color: "#ef4444" },
          { id: "kakao-consult", title: "카톡 상담", icon: HelpCircle, action: () => window.open("/TestMain", "_blank"), color: "#3b82f6" },
          { id: "shop", title: "쇼핑몰", icon: Store, action: () => window.open("/TestMain", "_blank"), color: "#a21caf" }
        ];
      
      case "3": // 가맹점
        return [
          { id: "cm-history", title: "CM 내역", icon: FileText, action: () => navigate("/TestMain"), color: "#22c55e" },
          { id: "commission-history", title: "수당 내역", icon: BarChart3, action: () => navigate("/TestMain"), color: "#eab308" },
          { id: "homepage", title: "씨엠바더 홈페이지", icon: Store, action: () => window.open("/TestMain", "_blank"), color: "#a21caf" },
          { id: "cm-charge", title: "CM 충전", icon: CreditCard, action: () => navigate("/TestMain"), color: "#3b82f6" },
          { id: "store-management", title: "매장 관리", icon: Settings, action: () => navigate("/TestMain"), color: "#64748b" },
          { id: "coupon-publish", title: "쿠폰 발행함", icon: FileText, action: () => navigate("/TestMain"), color: "#6366f1" },
          { id: "kakao-consult", title: "카톡 상담", icon: HelpCircle, action: () => window.open("/TestMain", "_blank"), color: "#3b82f6" },
          { id: "customer-management", title: "고객 관리", icon: Users, action: () => navigate("/TestMain"), color: "#3b82f6" },
          { id: "coupon-event", title: "쿠폰 이벤트", icon: Bell, action: () => navigate("/TestMain"), color: "#eab308" },
          { id: "coupon-event-register", title: "쿠폰 이벤트 등록", icon: Bell, action: () => navigate("/TestMain"), color: "#a21caf" },
          { id: "shop", title: "쇼핑몰", icon: Store, action: () => window.open("/TestMain", "_blank"), color: "#a21caf" }
        ];
      
      default:
        return [];
    }
  };

  const getRoleName = (roleIndex) => {
    switch (roleIndex) {
      case "1": return "일반 사용자";
      case "2": return "사업자";
      case "3": return "가맹점";
      default: return "사용자";
    }
  };

  const menuItems = getMenuByRole(userRole);

  return (
    <div className="testmain-root">
      <div className="testmain-header">
        <h1>안녕하세요, {userInfo.name || "사용자"}님!</h1>
        <p>{getRoleName(userRole)} 메뉴에 오신 것을 환영합니다.</p>
      </div>
      <div className="testmain-grid">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="testmain-card"
              onClick={item.action}
            >
              <div className="testmain-icon" style={{ backgroundColor: item.color }}>
                <Icon size={32} color="#fff" />
              </div>
              <div className="testmain-title">{item.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
