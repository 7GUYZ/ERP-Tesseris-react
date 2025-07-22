import React from "react";
import UserProfileCard from "../../../components/ui/jihun/common/UserProfileCard";
import UserServiceMenu from "../../../components/ui/jihun/common/UserServiceMenu"
import UserPromotionCard from "../../../components/ui/jihun/common/UserPromotionCard"
import "../../../styles/jihun/common/common.css";

const UserMainHome = () => {
  return (
    <div className="user-main-home">
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