import React from "react";
import UserProfileCard from "../../../components/ui/jihun/common/UserProfileCard";
import UserServiceMenu from "../../../components/ui/jihun/common/UserServiceMenu"
import UserPromotionCard from "../../../components/ui/jihun/common/UserPromotionCard"
import "../../../styles/jihun/common/common.css";

const UserMainHome = () => {
  return (
    <div className="user-main-home" style={{ display: 'flex', flexDirection: 'column', gap: '1.0rem' }}>
      {/* User Profile & Balance */}
      <UserProfileCard />

      {/* Service Menu */}
      <UserServiceMenu />

      {/* Promotion Section */}
      <UserPromotionCard />
    </div>
  )
}

export default UserMainHome 