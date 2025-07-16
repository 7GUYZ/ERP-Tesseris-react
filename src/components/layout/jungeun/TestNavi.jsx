import React from "react";
import { Link, useLocation } from "react-router-dom";

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "56px",
  background: "#fff",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  zIndex: 999,
  // boxShadow, border, borderRadius 등 제거
  // boxShadow: "0 -2px 16px rgba(44,62,80,0.08)",
  // borderTop: "1px solid #e0e0e0",
  // padding: "0 8px",
};

const linkStyle = {
  flex: 1,
  textAlign: "center",
  color: "#7b7b7b",
  textDecoration: "none",
  fontSize: "15px",
  padding: "8px 0 0 0",
  // borderRadius: "8px 8px 0 0",
  transition: "background 0.18s cubic-bezier(.4,0,.2,1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "60px",
  minHeight: "100%",
};

// 활성화 메뉴: 하늘색 배경만 적용, 나머지 효과 없음
const activeStyle = {
  background: "#e3f2fd",
};

const iconStyle = {
  fontSize: "22px",
  marginBottom: "2px",
  display: "block",
};

const navItems = [
  { to: "/TestMain", label: "홈", icon: "🏠" },
  { to: "/TestAlarm", label: "알림", icon: "🔔" },
  { to: "/TestMyPage", label: "마이페이지", icon: "👤" },
  { to: "/TestSettings", label: "설정", icon: "⚙️" },
];

const TestNavi = () => {
  const { pathname } = useLocation();

  return (
    <nav style={navStyle}>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          style={{
            ...linkStyle,
            ...(pathname === item.to ? activeStyle : {}),
          }}
        >
          <span style={iconStyle}>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default TestNavi;
