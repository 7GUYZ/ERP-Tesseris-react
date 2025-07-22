import React, { useEffect } from "react";
import '../../../../styles/jihun/usermain/usermain.css';
import { useNavigate } from "react-router-dom";

export default function UserProfileCard() {
  // 여기에 권한 분기처리 로직을 넣으면 됩니다.
  // 예시:
  // const userType = 'franchise'; // 'franchise' | 'business'
  // let badgeText = userType === 'franchise' ? '가맹점' : '사업자';
  // let badgeClass = userType === 'franchise' ? 'usermain-profilecard-badge-franchise' : 'usermain-profilecard-badge-business';

  // 임시 하드코딩 예시 (가맹점)
  const badgeText = '가맹점';
  const badgeClass = 'usermain-profilecard-badge-franchise';
  const navigate = useNavigate();
  useEffect(()=>{
    
  })
  return (
    <div className="usermain-profilecard">
      <div className="usermain-profilecard-header-row">
        <div>
          <h2 className="usermain-profilecard-name">{JSON.parse(localStorage.getItem('user-info')).name}님</h2>
          <p className="usermain-profilecard-greeting">안녕하세요</p>
        </div>
        <span className={badgeClass}>{badgeText}</span>
      </div>
      <div className="usermain-profilecard-balancewrap">
        <div className="usermain-profilecard-balancecard">
          <p className="usermain-profilecard-balance-label">사용가능 포인트</p>
          <div className="usermain-profilecard-balance-amountwrap">
            <span className="usermain-profilecard-balance-amount">71,100</span>
            <span className="usermain-profilecard-balance-unit">CM</span>
          </div>
          <button className="usermain-profilecard-balance-chargebtn-main" onClick={() => navigate('/charge')}>+ 충전</button>
        </div>
      </div>
    </div>
  );
} 