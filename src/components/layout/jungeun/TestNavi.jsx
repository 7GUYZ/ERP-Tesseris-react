import React from "react";
import { Link, useLocation } from "react-router-dom";

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "56px",
  backgroundColor: "#2c3e50",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  zIndex: 999,
  borderTop: "1px solid #444",
};

const linkStyle = {
  flex: 1,
  textAlign: "center",
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
  padding: "6px 0",
};

const activeStyle = {
  fontWeight: "bold",
  color: "#00d8ff",
  borderTop: "2px solid #00d8ff",
};

const TestNavi = () => {
  const { pathname } = useLocation();

  const isActive = pathname === "/TestMain";

  return (
    <nav style={navStyle}>
      <Link to="/TestMain" style={{ ...linkStyle, ...(isActive ? activeStyle : {}) }}>
        홈
      </Link>
      <Link to="/TestMain" style={{ ...linkStyle, ...(isActive ? activeStyle : {}) }}>
        알림
      </Link>
      <Link to="/TestMain" style={{ ...linkStyle, ...(isActive ? activeStyle : {}) }}>
        마이페이지
      </Link>
      <Link to="/TestMain" style={{ ...linkStyle, ...(isActive ? activeStyle : {}) }}>
        설정
      </Link>
    </nav>
  );
};

export default TestNavi;
