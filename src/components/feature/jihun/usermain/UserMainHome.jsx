import React from "react";
import UserProfileCard from "../../../layout/jihun/usermain/UserProfileCard";
import UserServiceMenu from "../../../ui/jihun/usermain/UserServiceMenu"
import UserPromotionCard from "../../../ui/jihun/usermain/UserPromotionCard"
import "../../../../styles/jihun/usermain/usermain.css";

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