import React, { useEffect, useState } from "react";
import UserProfileCard from "../../../components/ui/jihun/common/UserProfileCard";
import UserServiceMenu from "../../../components/ui/jihun/common/UserServiceMenu"
import UserPromotionCard from "../../../components/ui/jihun/common/UserPromotionCard"
import Popup from "../../../components/ui/jungeun/Popup";
import "../../../styles/jihun/common/common.css";
import "../../../styles/jungeun/popup.css";

const UserMainHome = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true); // 초기값을 true로 변경

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="user-main-home">
      {/* User Profile & Balance */}
      <UserProfileCard />

      {/* Service Menu */}
      <UserServiceMenu />

      {/* Promotion Section */}
      <UserPromotionCard />

      {/* Popup */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Popup onClose={closePopup} />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMainHome 