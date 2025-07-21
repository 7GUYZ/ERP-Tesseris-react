import React from "react";
import "../../../styles/jihun/usermain/usermain.css";

import UserMainHeader from "../../components/layout/jihun/usermain/UserMainHeader"
import UserMainHome from "../../components/feature/jihun/usermain/UserMainHome"
import UserMainNavi from "../../components/layout/jihun/usermain/UserMainNavi"

export default function UserPage() {
  return (
    <div className="user-main-layout">
      {/* Top Header */}
      <UserMainHeader />

      {/* Main Content */}
      <UserMainHome />

      {/* Bottom Navigation */}
      <UserMainNavi />
    </div>
  )
} 