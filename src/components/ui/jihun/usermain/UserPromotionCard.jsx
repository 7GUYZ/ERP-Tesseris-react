import React from "react";
import '../../../../styles/jihun/usermain/usermain.css';

export default function UserPromotionCard() {
  return (
    <div className="usermain-promotioncard">
      <div className="usermain-promotioncard-inner">
        <div className="usermain-promotioncard-dotwrap">
          <div className="usermain-promotioncard-dot"></div>
          <span className="usermain-promotioncard-brand">CMBARTER KOREA</span>
        </div>
        <h3 className="usermain-promotioncard-title">
          한국 최고의 거래되는 세상<br />
          시장바터에서 시작하세요
        </h3>
        <button className="usermain-promotioncard-btn">자세히 보기 →</button>
      </div>
    </div>
  );
} 