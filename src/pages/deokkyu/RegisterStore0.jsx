import React from "react"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import CustomButton from "../../components/ui/deokkyu/Deoktton"
import "../../styles/deokkyu/Registercommon.css"
import "../../styles/deokkyu/RegisterStore0.css"

export default function RegisterStore1() {
  const navigate = useNavigate()

  const handleApplyClick = () => {
    navigate('/registerstore1')
  }

  const handleCancelClick = () => {
    navigate('/TestMain')
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <ChevronLeft onClick={handleCancelClick} className="back-icon" />
        <h1 className="header-title">가맹점 신청</h1>
        <div className="header-spacer" />
      </div>

      {/* Content */}
      <div className="register-content">
        {/* 신청 가능해요 */}
        <div>
          <h2 className="section-title">신청 가능해요!</h2>
          <ul className="list-container">
            <li className="list-item">
              <span className="list-number">1.</span>
              <span>사업자등록증을 소지하고</span>
            </li>
            <li className="list-item">
              <span className="list-number">2.</span>
              <span>정상 영업 중인 가맹점</span>
            </li>
          </ul>
        </div>

        {/* 제한 업종 */}
        <div>
          <h2 className="section-title">이런 업종은 안돼요!</h2>
          <div className="restricted-business">
            <p className="restricted-title">제한업종</p>
            <p>
              사행성(도박), 유사수신, 디지털자산(가상화폐, NFT등)대출, 다단계, 음란물/성매매, 상표권/저작권침해 물품, 정기예약결제,
              성형외, 유기증권, 포인트증전, 개인정보매매, 판매허브상품, 크라우드펀딩, 투자/로또 정보제공업, 허위/과장광고상품,
              부동산, 인테리어업, 사행성 유형 티켓업소 등
            </p>
          </div>
        </div>

        {/* 미리 준비해주세요 */}
        <div>
          <h2 className="section-title">미리 준비해주세요!</h2>
          <ul className="list-container">
            <li className="list-item">
              <span className="list-number">1.</span>
              <span>사업자 등록증</span>
            </li>
            <li className="list-item">
              <span className="list-number">2.</span>
              <span>가맹점 사진</span>
            </li>
          </ul>
        </div>

        {/* 유의사항 */}
        <div>
          <h2 className="section-title red">유의 사항</h2>
          <ul className="list-container">
            <li className="list-item red">
              <span className="list-number">1.</span>
              <span>가맹 신청 시, 서면 사용한도액을 직접 선택해 주시기 바랍니다.</span>
            </li>
            <li className="list-item red">
              <span className="list-number">2.</span>
              <span>선택하신 한도액에 대한 첫 결제가 이루어져야 한도가 승인됩니다.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="bottom-button-container">
        <CustomButton onClick={handleApplyClick}>가맹점 신청하기</CustomButton>
      </div>
    </div>
  )
}