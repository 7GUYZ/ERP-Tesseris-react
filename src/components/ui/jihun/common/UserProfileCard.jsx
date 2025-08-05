import React, { useEffect, useState } from "react";
import '../../../../styles/jihun/common/common.css';
import { useNavigate } from "react-router-dom";
import { CurrentPoint } from "../../../../api/auth/JihunAuth";

export default function UserProfileCard() {
  // 여기에 권한 분기처리 로직을 넣으면 됩니다.
  // 예시:
  // const userType = 'franchise'; // 'franchise' | 'business'
  // let badgeText = userType === 'franchise' ? '가맹점' : '사업자';
  // let badgeClass = userType === 'franchise' ? 'usermain-profilecard-badge-franchise' : 'usermain-profilecard-badge-business';
  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user-info")) || {};
    setUserRole(data.user_role_index);
    setUserInfo(data);
    console.log(data);
    const UserCurrentPoint = async () => {
      const userCurrentPoint = await CurrentPoint(data.id);
      setUserCurrentPoint(userCurrentPoint.data);
    }
    UserCurrentPoint();
  }, []);
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [userCurrentPoint, setUserCurrentPoint] = useState(0);
  // userRole에 따라 뱃지 텍스트/클래스 결정
  let badgeText = "";
  let badgeClass = "";

  if (userRole === "1") {
    badgeText = "일반";
    badgeClass = "usermain-profilecard-badge-normal";
  } else if (userRole === "2") {
    badgeText = "사업자";
    badgeClass = "usermain-profilecard-badge-business";
  } else if (userRole === "3") {
    badgeText = "가맹점";
    badgeClass = "usermain-profilecard-badge-franchise";
  }

  return (
    <div className="usermain-profilecard">
      <div className="usermain-profilecard-header-row">
        <div>
          <h2 className="usermain-profilecard-name">{userInfo.name} 님</h2>
          <p className="usermain-profilecard-greeting">환영합니다</p>
        </div>
        <span className={badgeClass}>{badgeText}</span>
      </div>
      <div className="usermain-profilecard-balancewrap">
        <div className="usermain-profilecard-balancecard">
          <p className="usermain-profilecard-balance-label">사용 가능한 TS</p>
          <div className="usermain-profilecard-balance-amountwrap">
            <span className="usermain-profilecard-balance-amount">{userCurrentPoint.toLocaleString()}</span>
            <span className="usermain-profilecard-balance-unit">TS</span>
          </div>
          <button className="usermain-profilecard-balance-chargebtn-main" onClick={() => navigate('/charge/user', { state: { userCurrentPoint: userCurrentPoint} })}>+ 충전</button>
        </div>
      </div>
    </div>
  );
} 