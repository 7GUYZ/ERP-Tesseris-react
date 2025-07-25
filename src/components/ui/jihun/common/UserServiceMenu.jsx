import React, { useEffect, useState } from "react";
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
  AppWindow,
  FileSearch,
  Users,
  Store,
  MessageCircleQuestion,
  ShoppingCart,
  FileUser,
  Coins,
  BanknoteArrowUp,
  Building2,
  Dices,
  Tickets,
  PartyPopper,
  FolderPlus,
  CalendarPlus,
} from "lucide-react";
import '../../../../styles/jihun/common/common.css';
import { useNavigate } from "react-router-dom";

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

// [커스텀 메뉴 추가/삭제/순서변경은 위 배열에서 자유롭게]

export default function UserServiceMenu() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();


  if (userRole === "1") {
    // 일반회원 전용 메뉴 
    serviceItems = [
      { icon: FileUser, label: "정회원 신청", color: "usermain-icon-orange", path: "/main" },
      { icon: Coins, label: "CM 충전", color: "usermain-icon-pink", path: "/main" },
      { icon: FileText, label: "CM 내역", color: "usermain-icon-red", path: "/main" },
      { icon: BanknoteArrowUp, label: "수당 내역", color: "usermain-icon-red", path: "/main" },
      { icon: AppWindow, label: "씨엠바더 홈페이지", color: "usermain-icon-blue", path: "/main" },
      { icon: Building2, label: "가맹점 신청", color: "usermain-icon-cyan", path: "/main" },
      { icon: Tickets, label: "쿠폰 보관함", color: "usermain-icon-violet", path: "/main" },
      { icon: MessageCircleQuestion, label: "카톡 상담", color: "usermain-icon-yellow", path: "/main" },
      { icon: Dices, label: "씨엠 게임 보상", color: "usermain-icon-teal", path: "/main" },
      { icon: PartyPopper, label: "쿠폰 이벤트", color: "usermain-icon-indigo", path: "/main" },
      { icon: ShoppingCart, label: "쇼핑몰", color: "usermain-icon-green", path: "/main" },
    ];
  }
  if (userRole === "2") {
    // 사업자 전용 메뉴 
    serviceItems = [
      { icon: FileText, label: "CM 내역", color: "usermain-icon-red", path: "/main" },
      { icon: AppWindow, label: "씨엠바더 홈페이지", color: "usermain-icon-blue", path: "/main" },
      { icon: FileSearch, label: "중개수수료 현황", color: "usermain-icon-orange", path: "/main" },
      { icon: Users, label: "산하 사업자", color: "usermain-icon-cyan", path: "/BusinessList" },
      { icon: Store, label: "산하 가맹점", color: "usermain-icon-violet", path: "/StoreList" },
      { icon: MessageCircleQuestion, label: "카톡 상담", color: "usermain-icon-yellow", path: "/main" },
      { icon: ShoppingCart, label: "쇼핑몰", color: "usermain-icon-green", path: "/main" },
    ];
  }
  if (userRole === "3") {
    // 가맹점 전용 메뉴 
    serviceItems = [
      { icon: FileText, label: "CM 내역", color: "usermain-icon-red", path: "/main" },
      { icon: BanknoteArrowUp, label: "수당 내역", color: "usermain-icon-red", path: "/main" },
      { icon: AppWindow, label: "씨엠바더 홈페이지", color: "usermain-icon-blue", path: "/main" },
      { icon: Coins, label: "CM 충전", color: "usermain-icon-pink", path: "/main" },
      { icon: Store, label: "매장 관리", color: "usermain-icon-cyan", path: "/" },
      { icon: FolderPlus, label: "쿠폰 발행함", color: "usermain-icon-green", path: "/main" },
      { icon: MessageCircleQuestion, label: "카톡 상담", color: "usermain-icon-yellow", path: "/main" },
      { icon: Users, label: "고객 관리", color: "usermain-icon-orange", path: "/main" },
      { icon: PartyPopper, label: "쿠폰 이벤트", color: "usermain-icon-indigo", path: "/main" },
      { icon: CalendarPlus, label: "쿠폰 이벤트 등록", color: "usermain-icon-red", path: "/main" },
      { icon: ShoppingCart, label: "쇼핑몰", color: "usermain-icon-green", path: "/main" },
    ];
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user-info")) || {};
    setUserRole(data.user_role_index);
  }, []);


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
                onClick={() => navigate(item.path)} // [주소 이동 기능]
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