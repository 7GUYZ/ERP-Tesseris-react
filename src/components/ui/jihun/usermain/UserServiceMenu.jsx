import React from "react";
import {
  Bell,
  Settings,
  User,
  CreditCard,
  DollarSign,
  PieChart,
  Gift,
  Building,
  Smartphone,
  FileText,
  Award,
} from "lucide-react";
import '../../../../styles/jihun/usermain/usermain.css';

// [분기처리 위치] 아래 userType 값을 권한에 따라 동적으로 할당하세요.
// 예: 'user' | 'business' | 'franchise'
const userType = 'user'; // <-- 여기에 권한 분기처리 로직을 넣으세요.

// [커스텀 메뉴 구성 위치] 아래 배열을 개발자가 원하는 대로 추가/삭제/변경하면 됩니다.
// path: 클릭 시 이동할 주소
const baseServiceItems = [
  { icon: User, label: "계좌 조회", color: "usermain-icon-blue", path: "/account" },
  { icon: CreditCard, label: "CM 충전", color: "usermain-icon-purple", path: "/charge" },
  { icon: DollarSign, label: "CM 사용", color: "usermain-icon-green", path: "/use" },
  { icon: PieChart, label: "수입 내역", color: "usermain-icon-orange", path: "/income" },
  { icon: Gift, label: "가맹점 안내", color: "usermain-icon-pink", path: "/franchise" },
  { icon: Building, label: "무료 송금", color: "usermain-icon-indigo", path: "/remit" },
  { icon: Smartphone, label: "가맹 신청", color: "usermain-icon-teal", path: "/apply" },
  { icon: FileText, label: "제휴 보상", color: "usermain-icon-red", path: "/reward" },
  { icon: Award, label: "공동 이벤트", color: "usermain-icon-yellow", path: "/event" },
  { icon: Settings, label: "스마트", color: "usermain-icon-gray", path: "/smart" },
  { icon: Bell, label: "플레이어", color: "usermain-icon-cyan", path: "/player" },
  { icon: User, label: "정보", color: "usermain-icon-violet", path: "/info" },
];

// [분기처리 예시] userType에 따라 다른 메뉴를 보여주고 싶으면 아래처럼 분기
let serviceItems = baseServiceItems;
if (userType === 'business') {
  // 사업자 전용 메뉴 예시
  serviceItems = [
    ...baseServiceItems,
    { icon: Settings, label: "사업자 관리", color: "usermain-icon-gray", path: "/business" },
  ];
}
if (userType === 'franchise') {
  // 가맹점 전용 메뉴 예시
  serviceItems = [
    ...baseServiceItems,
    { icon: Gift, label: "가맹점 관리", color: "usermain-icon-pink", path: "/franchise/manage" },
  ];
}
// [커스텀 메뉴 추가/삭제/순서변경은 위 배열에서 자유롭게]

export default function UserServiceMenu() {
  return (
    <div className="usermain-servicemenu">
      <div className="usermain-servicemenu-card">
        <div className="usermain-servicemenu-inner">
          <h3 className="usermain-servicemenu-title">서비스 메뉴</h3>
          <div className="usermain-servicemenu-grid">
            {serviceItems.slice(0, 12).map((item, index) => (
              <div
                key={index}
                className="usermain-servicemenu-item"
                onClick={() => window.location.href = item.path} // [주소 이동 기능]
                style={{ cursor: 'pointer' }}
              >
                <div className={`usermain-servicemenu-iconwrap ${item.color}`}>
                  <item.icon className="usermain-servicemenu-icon" />
                </div>
                <span className="usermain-servicemenu-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 