import React, { useState, useEffect } from "react";
import { getMyAlarmHistory, markAsRead } from "../../../api/auth/JiyoonAuth";
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 목데이터 (임시)
  const mockNotifications = [
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

  // API에서 알림 데이터 로드
  useEffect(() => {
    const getAlarmList = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // localStorage에서 user_index 가져오기
        const userInfo = JSON.parse(localStorage.getItem("user-info"));
        const userIndex = userInfo?.user_index;

        if (!userIndex) {
          setError("사용자 정보를 찾을 수 없습니다.");
          return;
        }

        console.log("알림 데이터 로드 시작 - userIndex:", userIndex);
        
        const response = await getMyAlarmHistory(userIndex);
        
        console.log("알림 내역 응답:", response);
        console.log("전체 응답:", response);
        console.log("response.data:", response?.data);
        console.log("response.data.data:", response?.data?.data);
        console.log("response.data.data 타입:", typeof response?.data?.data);
        console.log("response.data.data가 배열인가?", Array.isArray(response?.data?.data));
        
        if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          console.log("알림 데이터 설정:", response.data.data);
          setNotifications(response.data.data);
        } else {
          console.log("알림 데이터가 없거나 배열이 아님, 빈 배열 설정");
          setNotifications([]);
        }
        
      } catch (error) {
        console.error("알림 데이터 로드 실패:", error);
        setError("알림 내역을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    getAlarmList();
  }, []);

  // 알림을 isRead 기준으로 정렬: 신규 알림(0) 위, 지난 알림(1) 아래
  const sortedNotifications = Array.isArray(notifications) 
    ? [...notifications].sort((a, b) => {
        if (a.isRead === b.isRead) return 0;
        return a.isRead ? 1 : -1;
      })
    : [];

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

  // 알림 클릭 핸들러 (읽음 처리)
  const handleNotificationClick = async (notification) => {
    try {
      console.log("알림 클릭 - alarmId:", notification.alarmId);
      
      // 읽음 처리 API 호출
      await markAsRead(notification.alarmId);
      
      // UI 업데이트 (새로운 알림 → 지난 알림으로 이동)
      setNotifications(prev => 
        prev.map(n => 
          n.alarmId === notification.alarmId 
            ? { ...n, isRead: 1 } 
            : n
        )
      );
      
      console.log("알림 읽음 처리 완료 - alarmId:", notification.alarmId);
      
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
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

            {loading && (
              <div className="alert-loading">로딩 중...</div>
            )}

            {error && (
              <div className="alert-error">{error}</div>
            )}

            <div className="alert-notification-list">
              {sortedNotifications.map((notification) => {
                // createdAt 배열을 Date 객체로 변환
                const formatCreatedAt = (createdAt) => {
                  if (Array.isArray(createdAt)) {
                    // [2025, 7, 27, 18, 8, 25] 형식을 Date로 변환
                    const [year, month, day, hour, minute, second] = createdAt;
                    return new Date(year, month - 1, day, hour, minute, second).toLocaleString('ko-KR');
                  } else if (createdAt) {
                    return new Date(createdAt).toLocaleString('ko-KR');
                  }
                  return '날짜 없음';
                };

                return (
                  <div
                    key={notification.alarmId}
                    className={`alert-notification-row ${
                      notification.isRead === 1 ? "alert-read" : "alert-unread"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="alert-message-content">
                      <span className="alert-message">
                        {notification.message}
                      </span>
                      <span className="alert-timestamp">
                        {formatCreatedAt(notification.createdAt)}
                      </span>
                    </div>
                    {notification.isRead === 0 && (
                      <div className="alert-unread-dot"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
