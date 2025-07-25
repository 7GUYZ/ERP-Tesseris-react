"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Check } from "lucide-react"
import { getAvailableCoupons, registerEvent } from "../../api/auth/DabinAuth"
import "../../styles/dabin/EventRegistrationPage.css"

export default function EventRegistrationPage() {
  const [formData, setFormData] = useState({
    couponType: "전체",
    eventName: "",
    targetCondition: "적용할 조건",
    downloadCode: "",
  })

  const [availableCoupons, setAvailableCoupons] = useState([])
  const [selectedCoupons, setSelectedCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  // 쿠폰 목록 조회
  useEffect(() => {
    fetchAvailableCoupons()
  }, [])

  const fetchAvailableCoupons = async (selectedType = formData.couponType) => {
    try {
      setLoading(true)
      // 쿠폰 가격 필터링
      const minPrice = selectedType === "전체" ? 0 : parseInt(selectedType)
      console.log('필터링 요청:', { selectedType, minPrice })
      const response = await getAvailableCoupons(110, minPrice)
      
      if (response.data.resultCode === 200) {
        console.log('API 응답 성공:', response.data.data)
        // 쿠폰 타입에 따른 스타일 매핑
        const couponsWithStyle = response.data.data.map((coupon, index) => ({
          id: coupon.couponIndex,
          name: coupon.couponName,
          amount: coupon.couponPrice,
          status: coupon.couponIssuanceStatus,
          period: "30일", // 기본값
          type: getCouponType(coupon.couponPrice),
          couponIndex: coupon.couponIndex
        }))
        console.log('필터링된 쿠폰 목록:', couponsWithStyle)
        setAvailableCoupons(couponsWithStyle)
      } else {
        console.error('쿠폰 목록 조회 실패:', response.data.resultMessage)
      }
    } catch (error) {
      console.error('쿠폰 목록 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 쿠폰 가격에 따른 타입 결정
  const getCouponType = (price) => {
    if (price >= 10000) return "gray"
    if (price >= 5000) return "bronze"
    return "main"
  }

  const handleInputChange = (field, value) => {
    console.log('handleInputChange 호출:', { field, value })
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // 쿠폰 종류 변경 시 자동 새로고침
    if (field === "couponType") {
      console.log('쿠폰 종류 변경됨, 새로고침 예정:', value)
      setTimeout(() => {
        console.log('fetchAvailableCoupons 호출:', value)
        fetchAvailableCoupons(value)
      }, 100)
    }
  }

  const toggleCouponSelection = (couponId) => {
    setSelectedCoupons((prev) => 
      prev.includes(couponId) 
        ? prev.filter((id) => id !== couponId) 
        : [...prev, couponId]
    )
  }

  const selectAllCoupons = () => {
    if (selectedCoupons.length === availableCoupons.length) {
      setSelectedCoupons([])
    } else {
      setSelectedCoupons(availableCoupons.map((coupon) => coupon.id))
    }
  }

  const handleRegister = async () => {
    try {
      // 유효성 검사
      if (!formData.eventName || formData.eventName.trim() === '') {
        alert("이벤트 이름을 입력해주세요.");
        return;
      }
      
      if (selectedCoupons.length === 0) {
        alert("쿠폰을 선택해주세요.");
        return;
      }
      
      // 등록 중 로딩 상태
      setLoading(true)
      
      const requestData = {
        eventName: formData.eventName.trim(),
        eventCondition: formData.targetCondition,
        eventDownLimit: parseInt(formData.downloadCode) || 0,
        couponIssuanceIndexList: selectedCoupons
      }

      const response = await registerEvent(110, requestData)
      
      if (response.data.resultCode === 200) {
        const currentFilter = formData.couponType === "전체" ? "전체" : `${formData.couponType}원`
        alert(`이벤트가 등록되었습니다!\n현재 필터링: ${currentFilter}`)
        // 폼 초기화 (쿠폰 종류는 현재 필터링 상태 유지)
        setFormData({
          couponType: formData.couponType, // 현재 필터링 상태 유지
          eventName: "",
          targetCondition: "적용할 조건",
          downloadCode: "",
        })
        setSelectedCoupons([])
        // 쿠폰 목록 새로고침 (현재 필터링 상태 유지)
        fetchAvailableCoupons(formData.couponType)
      } else {
        alert("이벤트 등록에 실패했습니다: " + response.data.resultMessage)
      }
    } catch (error) {
      console.error('이벤트 등록 오류:', error)
      alert("이벤트 등록 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="event-reg-coupon-event-register">
        <div className="event-reg-loading">쿠폰 목록을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="event-reg-coupon-event-register">
      {/* Header */}
      <div className="event-reg-header">
        <button className="event-reg-back-btn" onClick={() => window.history.back()}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="event-reg-header-title">이벤트 등록</h1>
        <div className="event-reg-header-spacer"></div>
      </div>

      {/* Form Section */}
      <div className="event-reg-form-section">
        <div className="event-reg-form-group">
          <label>쿠폰 종류</label>
          <select
            value={formData.couponType}
            onChange={(e) => handleInputChange("couponType", e.target.value)}
            className="event-reg-form-select"
          >
            <option value="전체">전체</option>
            <option value="1000">1,000원</option>
            <option value="5000">5,000원</option>
            <option value="10000">10,000원</option>
            <option value="50000">50,000원</option>
          </select>
        </div>

        <div className="event-reg-form-group">
          <label>이벤트 이름</label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => handleInputChange("eventName", e.target.value)}
            className="event-reg-form-input"
            placeholder="15글자 이내"
            maxLength={15}
          />
        </div>

        <div className="event-reg-form-group">
          <label>적용할 조건</label>
          <input
            type="text"
            value={formData.targetCondition}
            onChange={(e) => handleInputChange("targetCondition", e.target.value)}
            className="event-reg-form-input"
            placeholder="적용할 조건을 입력하세요"
          />
        </div>

        <div className="event-reg-form-group">
          <label>다운로드 회수</label>
          <input
            type="text"
            value={formData.downloadCode}
            onChange={(e) => handleInputChange("downloadCode", e.target.value)}
            className="event-reg-form-input"
            placeholder="다운로드 회수를 입력하세요"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="event-reg-action-buttons">
        <button className="event-reg-select-all-btn" onClick={selectAllCoupons}>
          전체선택
        </button>
        <button className="event-reg-register-btn" onClick={handleRegister}>
          등록
        </button>
      </div>

      {/* Available Coupons */}
      <div className="event-reg-coupons-container">
        {availableCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`event-reg-coupon-card${selectedCoupons.includes(coupon.id) ? " selected" : ""}`}
            onClick={() => toggleCouponSelection(coupon.id)}
          >
            <div className={`event-reg-coupon-background ${coupon.type}`}>
              {/* Checkbox */}
              <div className="event-reg-coupon-checkbox">
                <input
                  type="checkbox"
                  id={`register-coupon-${coupon.id}`}
                  checked={selectedCoupons.includes(coupon.id)}
                  onChange={() => toggleCouponSelection(coupon.id)}
                  className="event-reg-checkbox-input"
                />
                <label htmlFor={`register-coupon-${coupon.id}`} className="event-reg-checkbox-label"></label>
              </div>

              <div className="event-reg-coupon-brand">
                <div className="event-reg-brand-logo">CMBarterkorea</div>
                <div className="event-reg-brand-decoration"></div>
              </div>

              <div className="event-reg-coupon-content">
                <div className="event-reg-coupon-info-box">
                  <div className="event-reg-coupon-name">{coupon.name}</div>
                  <div className="event-reg-coupon-status">{coupon.status}</div>
                  <div className="event-reg-coupon-period">{coupon.period}</div>
                </div>
              </div>

              <div className="event-reg-coupon-badge">
                <div className="event-reg-badge-circle">
                  <div className="event-reg-badge-text">CMBARTER KOREA INC.</div>
                  <div className="event-reg-badge-dots">••••••••••••</div>
                  <div className="event-reg-badge-amount">{coupon.amount.toLocaleString()}</div>
                  <div className="event-reg-badge-dots">••••••••••••</div>
                </div>
              </div>

              <div className="event-reg-coupon-decoration">
                <div className="event-reg-decoration-lines"></div>
                <div className="event-reg-decoration-elements">
                  <div className="event-reg-decoration-leaf"></div>
                </div>
              </div>

              {selectedCoupons.includes(coupon.id) && (
                <div className="event-reg-selection-overlay">
                  <div className="event-reg-selection-check">
                    <Check className="w-8 h-8" />
                  </div>
                </div>
              )}
            </div>

            <div className="event-reg-coupon-footer">
              <button 
                className="event-reg-coupon-detail-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`/coupon-detail/${coupon.id}`, '_blank')
                }}
              >
                쿠폰 상세보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 