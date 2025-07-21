import React from "react";
import '../../../../styles/jihun/common/common.css';

export default function UserPromotionCard() {
  return (
    <div className="usermain-promotioncard">
      <div className="usermain-promotioncard-inner">
        <div className="usermain-promotioncard-dotwrap">
          <div className="usermain-promotioncard-dot"></div>
          <span className="usermain-promotioncard-brand">TESSERIS</span>
        </div>
        <h3 className="usermain-promotioncard-title">
          "편리한 소상공인 물물교환 결제시스템"<br />
          TESSERIS를 이용해주셔서 항상 감사합니다
        </h3>
        <button className="usermain-promotioncard-btn">자세히 보기</button>
      </div>
    </div>
  );
} 