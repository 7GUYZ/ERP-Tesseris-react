import React, { useState, useEffect } from "react";
import { getMyAlarmHistory, markAsRead } from "../../../api/auth/JiyoonAuth";
import "../../../styles/jiyun/alert/alert.css";
import {
  getUserAlarmSetting,
  updateUserAlarmSetting,
} from "../../../api/auth/JungeunAuth";

export default function AlertPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 알림 설정을 동적으로 생성하는 함수
  const createUserAlertSettings = async (userIndex, userRoleIndex) => {
    // 기본 알림 설정 (모든 사용자)
    const baseAlertSettings = [
      { key: 1, label: "공지사항 알림", alarmTypesId: 5 },
      { key: 2, label: "Q&A 답변 알림", alarmTypesId: 7 },
      { key: 5, label: "쿠폰 선물 알림", alarmTypesId: 11 },
    ];

    // 일반/정회원(1) 전용 알림 설정
    const regularUserSettings = [
      { key: 3, label: "가맹점 신청 처리 알림", alarmTypesId: 9 },
      { key: 4, label: "CM 선물 알림", alarmTypesId: 10 },
    ];

    // 사용자 역할에 따라 알림 설정 결정
    let alertSettings = [...baseAlertSettings];

    if (userRoleIndex === 1) {
      // 일반/정회원인 경우 추가 알림 설정 포함
      alertSettings = [...baseAlertSettings, ...regularUserSettings];
    }
    // 사업자(2), 가맹점(3)은 기본 알림 설정만

    const userSettings = [];

    for (const setting of alertSettings) {
      try {
        const response = await getUserAlarmSetting(
          userIndex,
          setting.alarmTypesId
        );
        const settingData = response.data;

        let active = 0; // 기본값: ON (알림 활성화)

        if (settingData.hasSetting) {
          // 설정이 있는 경우: 백엔드 값 사용
          active = settingData.isActive;
        }
        // 설정이 없는 경우: 기본값 0 (ON) 사용

        userSettings.push({
          key: setting.key,
          label: setting.label,
          active: active,
          alarmTypesId: setting.alarmTypesId,
        });
      } catch (error) {
        // 에러 시 기본값으로 설정
        userSettings.push({
          key: setting.key,
          label: setting.label,
          active: 0, // 기본값: ON (알림 활성화)
          alarmTypesId: setting.alarmTypesId,
        });
      }
    }

    return userSettings;
  };

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user-info"));
        const userIndex = userInfo?.user_index;
        const userRoleIndex = userInfo?.user_role_index;

        if (!userIndex) {
          console.error("사용자 정보를 찾을 수 없습니다.");
          setSettings([]);
          setLoading(false);
          return;
        }

        const userSettings = await createUserAlertSettings(
          userIndex,
          userRoleIndex
        );
        setSettings(userSettings);
        setLoading(false);
      } catch (error) {
        console.error("알림 설정 로드 실패:", error);
        setSettings([]);
        setLoading(false);
      }
    };

    loadUserSettings();
  }, []);

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
        console.log(
          "response.data.data가 배열인가?",
          Array.isArray(response?.data?.data)
        );

        if (
          response &&
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
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

  // 토글 변경 시 백엔드에 저장
  const handleSettingChange = async (key) => {
    try {
      // 사용자 정보 가져오기
      const userInfo = JSON.parse(localStorage.getItem("user-info"));
      const userIndex = userInfo?.user_index;

      if (!userIndex) {
        console.error("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // 현재 설정 찾기
      const currentSetting = settings.find((item) => item.key === key);
      if (!currentSetting) {
        console.error("설정을 찾을 수 없습니다.");
        return;
      }

      // 새로운 상태 계산 (0=ON, 1=OFF)
      const newActive = currentSetting.active === 0 ? 1 : 0;

      // 백엔드에 업데이트 요청
      const response = await updateUserAlarmSetting(
        userIndex,
        currentSetting.alarmTypesId,
        newActive
      );

      if (response.data.success) {
        // 성공 시 로컬 상태 업데이트
        setSettings((prev) =>
          prev.map((item) =>
            item.key === key ? { ...item, active: newActive } : item
          )
        );
      }
    } catch (error) {
      // 에러 처리 (콘솔 로그 제거)
    }
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
      setNotifications((prev) =>
        prev.map((n) =>
          n.alarmId === notification.alarmId ? { ...n, isRead: 1 } : n
        )
      );

      console.log("알림 읽음 처리 완료 - alarmId:", notification.alarmId);
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  if (loading) {
    return <div className="alert-loading">로딩 중...</div>;
  }

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
                      <span className="alert-setting-label">
                        • {setting.label}
                      </span>
                      <label className="alert-toggle">
                        <input
                          type="checkbox"
                          checked={setting.active === 0}
                          onChange={() => handleSettingChange(setting.key)}
                        />
                        <span className="alert-slider"></span>
                        <span className="alert-toggle-text">
                          {setting.active === 0 ? "ON" : "OFF"}
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

            {loading && <div className="alert-loading">로딩 중...</div>}

            {error && <div className="alert-error">{error}</div>}

            <div className="alert-notification-list">
              {sortedNotifications.map((notification) => {
                // createdAt 배열을 Date 객체로 변환
                const formatCreatedAt = (createdAt) => {
                  if (Array.isArray(createdAt)) {
                    // [2025, 7, 27, 18, 8, 25] 형식을 Date로 변환
                    const [year, month, day, hour, minute, second] = createdAt;
                    return new Date(
                      year,
                      month - 1,
                      day,
                      hour,
                      minute,
                      second
                    ).toLocaleString("ko-KR");
                  } else if (createdAt) {
                    return new Date(createdAt).toLocaleString("ko-KR");
                  }
                  return "날짜 없음";
                };

                return (
                  <div
                    key={notification.alarmId}
                    className={`alert-notification-row ${
                      notification.isRead === 1 ? "alert-read" : "alert-unread"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                    style={{ cursor: "pointer" }}
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
