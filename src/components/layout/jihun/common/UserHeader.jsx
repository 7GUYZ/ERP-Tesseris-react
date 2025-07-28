import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Popover from "../../../feature/jiyun/Popover";
import '../../../../styles/jihun/common/common.css';

export default function UserHeader() {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/mypage');
  };

  return (
    <div className="usermain-header">
      <div className="usermain-header-inner">
        <div className="usermain-header-logo">
          <h1 className="usermain-header-title">TESSERIS</h1>
        </div>
        <div className="usermain-header-actions">
          <Popover />
          <button className="usermain-header-actionbtn" onClick={handleSettingsClick}>
            <Settings className="usermain-header-actionicon" />
          </button>
        </div>
      </div>
    </div>
  );
} 