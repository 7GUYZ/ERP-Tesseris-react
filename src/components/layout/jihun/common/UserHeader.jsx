import React from "react";
import { Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import '../../../../styles/jihun/common/common.css';

export default function UserHeader() {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/mypage');
  };

  const handleAlertClick = () => {
    navigate('/alert');
  };

  return (
    <div className="usermain-header">
      <div className="usermain-header-inner">
        <div className="usermain-header-logo">
          <h1 className="usermain-header-title">TESSERIS</h1>
        </div>
        <div className="usermain-header-actions">
          <button className="usermain-header-actionbtn" onClick={handleAlertClick}>
            <Bell className="usermain-header-actionicon" />
          </button>
          <button className="usermain-header-actionbtn" onClick={handleSettingsClick}>
            <Settings className="usermain-header-actionicon" />
          </button>
        </div>
      </div>
    </div>
  );
} 