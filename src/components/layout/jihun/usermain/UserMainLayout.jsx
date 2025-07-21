import React from "react";
import { Outlet } from "react-router-dom";
import UserMainHeader from "./UserMainHeader";
import UserMainNavi from "./UserMainNavi";
import UserMainHome from "../../../feature/jihun/usermain/UserMainHome";
import "../../../../styles/jihun/usermain/usermain.css";

const UserMainLayout = () => {
  return (
    <div className="user-main-layout">
      <UserMainHeader />
      <main className="user-main-content">
        <UserMainHome />
        <Outlet /> {/* 자식 페이지 렌더링 */}
      </main>
      <UserMainNavi />
    </div>
  );
};

export default UserMainLayout; 