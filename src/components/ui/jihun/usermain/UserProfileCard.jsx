import React from "react";
import { useNavigate } from "react-router-dom"; // 🔥 라우팅을 위해 추가
import "../../../../styles/jihun/usermain/usermain.css";

const UserProfileCard = () => {
  // 🔥 라우팅을 위한 navigate 훅 추가
  // const navigate = useNavigate();
  
  // 🔥 충전 버튼 클릭 핸들러 추가
  // const handleChargeClick = () => {
  //   navigate('/cm-charge'); // CM 충전 페이지로 이동
  // };

  return (
    <div className="user-profile-card">
      <div className="user-card-content">
        {/* User Info */}
        <div className="user-profile-info">
          <div className="user-profile-left">
            <div className="user-profile-text">
              <h2>JINJINGHAO님</h2>
              <p>안녕하세요</p>
            </div>
          </div>
          <span className="user-profile-badge">
            프리미엄
          </span>
        </div>

        {/* Balance Card */}
        <div className="user-balance-card">
          <div className="user-balance-content">
            <div className="user-balance-text">
              <p>사용가능 포인트</p>
              <div className="user-balance-amount">
                <span>71,100</span>
                <span>CM</span>
              </div>
            </div>
          </div>

          <div className="user-balance-buttons">
            {/* 🔥 충전 버튼에 클릭 이벤트 추가 */}
            <button 
              className="user-balance-button"
              // onClick={handleChargeClick}  // 🔥 주석 해제하면 충전 페이지로 이동
            >
              {/* 🔥 아이콘 변경 가능 */}
              <span>➕</span>  {/* 🔥 여기서 아이콘 변경 가능 (예: 💰, 🏦, 💳) */}
              {/* 🔥 버튼 텍스트 변경 가능 */}
              충전  {/* 🔥 여기서 텍스트 변경 가능 (예: "충전하기", "포인트 충전") */}
            </button>
            
            {/* 🔥 추가 버튼이 필요한 경우 */}
            {/* <button 
              className="user-balance-button secondary"
              onClick={() => navigate('/other-page')}
            >
              <span>📊</span>
              내역
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard 