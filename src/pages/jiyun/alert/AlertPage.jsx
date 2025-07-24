import React, { useState } from "react";
import "../../../styles/jiyun/alert/alert.css";

export default function AlertPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    announcement: true,
    qa: false,
    charge: false,
    coupon1: false,
    coupon2: false,
    coupon3: false,
  });

  const notifications = [
    {
      id: 1,
      message: "공지사항이 등록되었습니다.",
      timestamp: "2024.01.15 14:30",
      isRead: false,
      type: "announcement",
    },
    {
      id: 2,
      message: "OO 가맹점에서 쿠폰을 선물했습니다.",
      timestamp: "2024.01.15 13:20",
      isRead: true,
      type: "coupon",
    },
    {
      id: 3,
      message: "OO 가맹점에서 쿠폰을 선물했습니다.",
      timestamp: "2024.01.15 12:45",
      isRead: true,
      type: "coupon",
    },
    {
      id: 4,
      message: "OO 가맹점에서 쿠폰을 선물했습니다.",
      timestamp: "2024.01.15 11:30",
      isRead: true,
      type: "coupon",
    },
    {
      id: 5,
      message: "OO 가맹점에서 쿠폰을 선물했습니다.",
      timestamp: "2024.01.15 10:15",
      isRead: true,
      type: "coupon",
    },
    {
      id: 6,
      message: "OO 가맹점에서 쿠폰을 선물했습니다.",
      timestamp: "2024.01.15 09:45",
      isRead: true,
      type: "coupon",
    },
    {
      id: 7,
      message: "OO 가맹점에서 쿠폰을 선물했습니다.",
      timestamp: "2024.01.15 09:20",
      isRead: true,
      type: "coupon",
    },
    {
      id: 8,
      message: "OO 가맹점에서 쿠폰을 선물했습니다.",
      timestamp: "2024.01.15 08:55",
      isRead: true,
      type: "coupon",
    },
  ];

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="alert-container">
      <main className="alert-main">
        {/* Notification Settings */}
        <div className="alert-section">
          <div className="alert-card">
            <button className="alert-toggle-button" onClick={toggleExpand}>
              <span className="alert-toggle-icon">
                {isExpanded ? "▼" : "▶"}
              </span>
              알림설정
            </button>

            {isExpanded && (
              <div className="alert-settings-panel">
                <div className="alert-settings-grid">
                  <div className="alert-setting-row">
                    <span className="alert-setting-label">• 공지사항 알림</span>
                    <label className="alert-toggle">
                      <input
                        type="checkbox"
                        checked={settings.announcement}
                        onChange={() => handleToggle("announcement")}
                      />
                      <span className="alert-slider"></span>
                      <span className="alert-toggle-text">
                        {settings.announcement ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>

                  <div className="alert-setting-row">
                    <span className="alert-setting-label">• 쿠폰 알림</span>
                    <label className="alert-toggle">
                      <input
                        type="checkbox"
                        checked={settings.coupon1}
                        onChange={() => handleToggle("coupon1")}
                      />
                      <span className="alert-slider"></span>
                      <span className="alert-toggle-text">
                        {settings.coupon1 ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>

                  <div className="alert-setting-row">
                    <span className="alert-setting-label">• Q&A 알림</span>
                    <label className="alert-toggle">
                      <input
                        type="checkbox"
                        checked={settings.qa}
                        onChange={() => handleToggle("qa")}
                      />
                      <span className="alert-slider"></span>
                      <span className="alert-toggle-text">
                        {settings.qa ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>

                  <div className="alert-setting-row">
                    <span className="alert-setting-label">• 쿠폰 알림</span>
                    <label className="alert-toggle">
                      <input
                        type="checkbox"
                        checked={settings.coupon2}
                        onChange={() => handleToggle("coupon2")}
                      />
                      <span className="alert-slider"></span>
                      <span className="alert-toggle-text">
                        {settings.coupon2 ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>

                  <div className="alert-setting-row">
                    <span className="alert-setting-label">• 충전 알림</span>
                    <label className="alert-toggle">
                      <input
                        type="checkbox"
                        checked={settings.charge}
                        onChange={() => handleToggle("charge")}
                      />
                      <span className="alert-slider"></span>
                      <span className="alert-toggle-text">
                        {settings.charge ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>

                  <div className="alert-setting-row">
                    <span className="alert-setting-label">• 쿠폰 알림</span>
                    <label className="alert-toggle">
                      <input
                        type="checkbox"
                        checked={settings.coupon3}
                        onChange={() => handleToggle("coupon3")}
                      />
                      <span className="alert-slider"></span>
                      <span className="alert-toggle-text">
                        {settings.coupon3 ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="alert-section">
          <div className="alert-card">
            <div className="alert-list-header">
              <h2 className="alert-list-title">
                알림 내역
                <span className="alert-indicator">●</span>
              </h2>
              <p className="alert-subtitle">
                *최근 1개월 이내의 알림만 표시됩니다.
              </p>
            </div>

            <div className="alert-notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`alert-notification-row ${
                    notification.isRead ? "alert-read" : "alert-unread"
                  }`}
                >
                  <div className="alert-message-content">
                    <span className="alert-message">
                      {notification.message}
                    </span>
                    <span className="alert-timestamp">
                      {notification.timestamp}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="alert-unread-dot"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
