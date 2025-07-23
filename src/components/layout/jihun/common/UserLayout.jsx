import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserNavi from "./UserNavi";
import "../../../../styles/jihun/common/common.css";

const UserLayout = () => {
  return (
    <div style={{minHeight:"100vh", display:"flex", flexDirection:"column"}}>
      <UserHeader />
      <main style={{ flex:1, overflow: "auto", padding: "20px", marginBottom:"88px", backgroundColor: "#F5F5F9"}}>
        <Outlet /> {/* 자식 페이지 렌더링 */}
      </main>
      <UserNavi />
    </div>
  );
};

export default UserLayout; 