import React from "react";
import { Bell, Settings } from "lucide-react";
import '../../../../styles/jihun/common/common.css';

export default function UserHeader() {
  return (
    <div className="usermain-header">
      <div className="usermain-header-inner">
        <div className="usermain-header-logo">
          <h1 className="usermain-header-title">TESSERIS</h1>
        </div>
        <div className="usermain-header-actions">
          <button className="usermain-header-actionbtn">
            <Bell className="usermain-header-actionicon" />
          </button>
          <button className="usermain-header-actionbtn">
            <Settings className="usermain-header-actionicon" />
          </button>
        </div>
      </div>
    </div>
  );
} 