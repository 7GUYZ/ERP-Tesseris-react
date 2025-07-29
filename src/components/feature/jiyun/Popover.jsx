import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyAlarmHistory } from "../../../api/auth/JiyoonAuth";
import useNotificationStore from "../../../store/jiyun/NotificationStore";
import '../../../styles/jiyun/popover/popover.css';

const Popover = () => {
  const navigate = useNavigate();
  
  // 전역 상태에서 알림 데이터 가져오기
  const { notifications, loading, error, setNotifications, setLoading, setError } = useNotificationStore();

  // 알림 데이터 로드 (지연 로딩 추가)
  useEffect(() => {
    const getAlarmList = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 토큰 체크 추가
        const token = localStorage.getItem("access-token");
        if (!token) {
          setNotifications([]);
          setLoading(false);
          return;
        }
        
        // localStorage에서 user_index 가져오기
        const userInfo = JSON.parse(localStorage.getItem("user-info"));
        const userIndex = userInfo?.user_index;

        if (!userIndex) {
          setError("사용자 정보를 찾을 수 없습니다.");
          return;
        }
        
        const response = await getMyAlarmHistory(userIndex);
        
        if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          setNotifications(response.data.data);
        } else {
          setNotifications([]);
        }
        
      } catch (error) {
        console.error("Popover 알림 데이터 로드 실패:", error);
        setError("알림 내역을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    // 지연 로딩: 인터셉터가 완전히 설정될 때까지 대기
    const timer = setTimeout(() => {
      getAlarmList();
    }, 1000); // 1초 지연

    return () => clearTimeout(timer);
  }, [setNotifications, setLoading, setError]);

  // 신규 알림만 필터링 (isRead === 0)
  const newNotifications = Array.isArray(notifications) ? notifications.filter((n) => n.isRead === 0) : [];

  // 종 클릭 시 알림 페이지로 이동
  const handleBellClick = () => {
    navigate('/alert');
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button className="notification-button" onClick={handleBellClick} style={{ position: 'relative' }}>
        <Bell size={20} />
        {newNotifications.length > 0 && (
          <span className="notification-popover-badge" style={{ top: 2, right: 2, position: 'absolute' }}>
            {newNotifications.length > 100 ? "100+" : newNotifications.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default Popover;
