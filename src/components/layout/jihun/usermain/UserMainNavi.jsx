import React from "react";
import { Home, Search, CreditCard, MapPin } from "lucide-react";
import '../../../../styles/jihun/usermain/usermain.css';

// [커스텀 네비게이션 구성 위치] 아래 배열을 개발자가 원하는 대로 추가/삭제/변경하면 됩니다.
// path: 클릭 시 이동할 주소
const navigationItems = [
  { icon: Home, label: "홈", id: "home", path: "/" },
  { icon: Search, label: "검색", id: "search", path: "/search" },
  { icon: CreditCard, label: "신용", id: "credit", path: "/credit" },
  { icon: MapPin, label: "가맹점", id: "merchants", path: "/franchise" },
];
// [커스텀 네비 추가/삭제/순서변경은 위 배열에서 자유롭게]

export default function UserMainNavi({ activeTab, setActiveTab }) {
  return (
    <div className="usermain-bottomnavi">
      <div className="usermain-bottomnavi-inner">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              window.location.href = item.path; // [주소 이동 기능]
            }}
            className={`usermain-bottomnavi-btn${activeTab === item.id ? ' active' : ''}`}
          >
            <item.icon className="usermain-bottomnavi-icon" />
            <span className="usermain-bottomnavi-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 