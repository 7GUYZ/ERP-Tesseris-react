"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Phone, MapPin } from "lucide-react"
import { useParams } from "react-router-dom"
import { getEventDetail } from "../../api/auth/DabinAuth"
import "../../styles/dabin/EventDetailPage.css"

export default function EventDetailPage() {
  const { eventMasterIndex } = useParams()
  const [eventDetail, setEventDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (eventMasterIndex) {
      fetchEventDetail()
    }
  }, [eventMasterIndex])

  const fetchEventDetail = async () => {
    try {
      setLoading(true)
      const response = await getEventDetail(parseInt(eventMasterIndex))
      
      if (response.data.resultCode === 200) {
        setEventDetail(response.data.data)
      } else {
        console.error('이벤트 상세 정보 조회 실패:', response.data.resultMessage)
        alert(response.data.resultMessage)
      }
    } catch (error) {
      console.error('이벤트 상세 정보 조회 오류:', error)
      alert("이벤트 상세 정보를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneClick = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`
    }
  }

  const handleMapClick = (storeIndex) => {
    window.open(`/franchisee-map?fidx=${storeIndex}`, '_blank')
  }

  const getCouponType = (price) => {
    if (price >= 10000) return "gray"
    if (price >= 5000) return "bronze"
    return "main"
  }

  if (loading) {
    return (
      <div className="event-detail-page">
        <div className="event-detail-loading">이벤트 상세 정보를 불러오는 중...</div>
      </div>
    )
  }

  if (!eventDetail) {
    return (
      <div className="event-detail-page">
        <div className="event-detail-error">이벤트 정보를 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="event-detail-page">
      {/* Header */}
      <div className="event-detail-header">
        <button className="event-detail-back-btn" onClick={() => window.history.back()}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="event-detail-header-title">쿠폰 이벤트</h1>
        <div className="event-detail-header-spacer"></div>
      </div>

      {/* Store Information */}
      <div className="event-detail-store-section">
        <div className="event-detail-store-card">
          <div className="event-detail-store-image">
            <img 
              src={eventDetail.storeImage || "/default-store-image.jpg"} 
              alt={eventDetail.storeName}
              onError={(e) => {
                e.target.src = "/default-store-image.jpg"
              }}
            />
          </div>
          <div className="event-detail-store-info">
            <div className="event-detail-store-header">
              <h2 className="event-detail-store-name">{eventDetail.storeName}</h2>
              <div className="event-detail-cm-available">
                <span>{eventDetail.userCmUse} CM 가능</span>
              </div>
            </div>
            <p className="event-detail-store-address">{eventDetail.storeAddress}</p>
            <div className="event-detail-store-actions">
              <span className="event-detail-store-category">{eventDetail.storeCategoryName}</span>
              <div className="event-detail-action-buttons">
                <button 
                  className="event-detail-action-btn event-detail-phone-btn"
                  onClick={() => handlePhoneClick(eventDetail.storePhone)}
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  className="event-detail-action-btn event-detail-map-btn"
                  onClick={() => handleMapClick(eventDetail.storeIndex)}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="event-detail-coupon-section">
        <div className="event-detail-coupon-card">
          <div className={`event-detail-coupon-background ${getCouponType(eventDetail.couponPrice)}`}> 
            <div className="event-detail-coupon-content">
              <div className="event-detail-coupon-info">
                <div className="event-detail-coupon-name">{eventDetail.couponName}</div>
                <div className="event-detail-coupon-status">{eventDetail.couponIssuanceStatus}</div>
                <div className="event-detail-coupon-period">{eventDetail.couponLimit}일</div>
              </div>
            </div>
            <div className="event-detail-coupon-badge">
              <div className="event-detail-badge-circle">
                <div className="event-detail-badge-text">CMBARTER KOREA INC.</div>
                <div className="event-detail-badge-dots">••••••••••••</div>
                <div className="event-detail-badge-amount">{eventDetail.couponPrice.toLocaleString()}</div>
                <div className="event-detail-badge-dots">••••••••••••</div>
              </div>
            </div>
            <div className="event-detail-coupon-brand">
              <div className="event-detail-brand-logo">CMBarterkorea</div>
              <div className="event-detail-brand-decoration"></div>
            </div>
            <div className="event-detail-coupon-decoration">
              <div className="event-detail-decoration-lines"></div>
              <div className="event-detail-decoration-elements">
                <div className="event-detail-decoration-leaf"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 