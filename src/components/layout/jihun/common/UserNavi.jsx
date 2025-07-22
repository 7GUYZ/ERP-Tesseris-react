import React from "react";
import { Home, Gift, CreditCard, MapPin } from "lucide-react";
import '../../../../styles/jihun/common/common.css';

const navigationItems = [
  { icon: Home, label: "홈", id: "home", path: "/main" }, 
  { icon: CreditCard, label: "결제", id: "credit", path: "/credit" }, // 결제 페이지 route 걸기
  { icon: Gift, label: "선물", id: "gift", path: "/gift" }, // 선물 페이지 route 걸기
  { icon: MapPin, label: "가맹점 찾기", id: "merchants", path: "/franchise" }, // 가맹점 찾기 route 걸기
];

export default function UserNavi() {
  return (
    <div className="usermain-bottomnavi">
      <div className="usermain-bottomnavi-inner">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              window.location.href = item.path;
            }}
            className="usermain-bottomnavi-btn"
          >
            <item.icon className="usermain-bottomnavi-icon" />
            <span className="usermain-bottomnavi-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 