import React, { useState } from "react";
import "../../../styles/jiyun/alert/alert.css";

export default function AlertPage() {
  // admin 방식의 알림 설정 데이터
  const initialSettings = [
    { key: "announcement", label: "공지사항 알림", active: 1 },
    { key: "coupon1", label: "쿠폰 알림", active: 0 },
    { key: "qa", label: "Q&A 알림", active: 0 },
    { key: "coupon2", label: "쿠폰 알림", active: 0 },
    { key: "charge", label: "충전 알림", active: 0 },
    { key: "coupon3", label: "쿠폰 알림", active: 0 },
  ];

  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState(initialSettings);

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
    {
      id: 9,
      message: "OO 가맹점에서 쿠폰을 선물했습니다.",
      timestamp: "2024.01.15 08:55",
      isRead: false,
      type: "coupon",
    },
  ];

  // 알림을 isRead 기준으로 정렬: 신규 알림(false) 위, 지난 알림(true) 아래
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead === b.isRead) return 0;
    return a.isRead ? 1 : -1;
  });

  const handleSettingChange = (key) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, active: item.active ? 0 : 1 } : item
      )
    );
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
                  {settings.map((setting) => (
                    <div className="alert-setting-row" key={setting.key}>
                      <span className="alert-setting-label">• {setting.label}</span>
                      <label className="alert-toggle">
                        <input
                          type="checkbox"
                          checked={!!setting.active}
                          onChange={() => handleSettingChange(setting.key)}
                        />
                        <span className="alert-slider"></span>
                        <span className="alert-toggle-text">
                          {setting.active ? "ON" : "OFF"}
                        </span>
                      </label>
                    </div>
                  ))}
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
              {sortedNotifications.map((notification) => (
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
