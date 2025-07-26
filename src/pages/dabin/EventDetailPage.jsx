"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Phone, MapPin, Check } from "lucide-react"
import { useParams } from "react-router-dom"
import { getEventDetail, getMyStoreImages, getPresignedUrl } from "../../api/auth/DabinAuth"
import "../../styles/dabin/EventDetailPage.css"

export default function EventDetailPage() {
  const { eventMasterIndex } = useParams()
  const [eventDetail, setEventDetail] = useState(null)
  const [storeImages, setStoreImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (eventMasterIndex) {
      fetchEventDetail()
    }
  }, [eventMasterIndex])

  // StoreInfoPage와 동일한 Presigned URL 변환 함수
  const fetchPresignedUrls = async (images) => {
    if (!images || images.length === 0) {
      setStoreImages([]);
      return;
    }
    const urls = await Promise.all(
      images.map(async (img) => {
        try {
          const url = await getPresignedUrl(img.storeImage);
          return { ...img, presignedUrl: url };
        } catch {
          return { ...img, presignedUrl: null };
        }
      })
    );
    // 대표이미지(T)만 필터링
    const mainImages = urls.filter(img => img.storeMainImageStatus === 'T');
    setStoreImages(mainImages);
  };

  const fetchEventDetail = async () => {
    try {
      setLoading(true)
      
      // 1. 이벤트 상세 정보 조회
      const response = await getEventDetail(parseInt(eventMasterIndex))
      
      if (response.data.resultCode === 200) {
        setEventDetail(response.data.data)
        
        // 2. 가맹점 이미지 조회 (store_main_image_status = 'T'인 메인 이미지만)
        try {
          const storeImagesResponse = await getMyStoreImages();
          console.log('Store Images Response:', storeImagesResponse);
          
          if (storeImagesResponse && storeImagesResponse.data) {
            await fetchPresignedUrls(storeImagesResponse.data);
          } else {
            setStoreImages([]);
          }
        } catch (imageError) {
          console.error('가맹점 이미지 조회 실패:', imageError);
          setStoreImages([]);
        }
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
    if (phone && phone.trim() !== '') {
      // 전화번호 형식 정리 (하이픈 제거)
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length >= 10) {
        window.location.href = `tel:${cleanPhone}`;
      } else {
        alert('유효하지 않은 전화번호입니다.');
      }
    } else {
      alert('전화번호가 없습니다.');
    }
  }

  const handleMapClick = (storeIndex) => {
    // React 컴포넌트로 이동
    window.open(`/franchisee-map?fidx=${storeIndex}`, '_blank')
  }

  const getCouponType = (price) => {
    if (price >= 50000) return "price-50000"      // ₩50,000 - 신사임당 - 노란색
    if (price >= 10000) return "price-10000"      // ₩10,000 - 세종대왕 - 초록색
    if (price >= 5000) return "price-5000"        // ₩5,000 - 율곡 이이 - 주황색
    if (price >= 1000) return "price-1000"        // ₩1,000 - 퇴계 이황 - 파란색
    return "main"                                  // 기본값
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
            {storeImages.length > 0 ? (
              <img 
                src={storeImages[0].presignedUrl || storeImages[0].storeImage} 
                alt={eventDetail.storeName}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const noImageDiv = e.target.nextSibling;
                  if (noImageDiv) {
                    noImageDiv.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className="event-detail-no-image" style={{ display: storeImages.length > 0 ? 'none' : 'flex' }}>
              <span>등록된 이미지가 없습니다</span>
            </div>
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
      <div className="event-reg-coupons-container">
        <div className="event-reg-coupon-card selected">
          <div className={`event-reg-coupon-background ${getCouponType(eventDetail.couponPrice)}`}>
            {/* Checkbox */}
            <div className="event-reg-coupon-checkbox">
              <input
                type="checkbox"
                id="event-detail-coupon-checkbox"
                checked={true}
                readOnly
                className="event-reg-checkbox-input"
              />
              <label htmlFor="event-detail-coupon-checkbox" className="event-reg-checkbox-label"></label>
            </div>

            <div className="event-reg-coupon-brand">
              <div className="event-reg-brand-logo">Tesseris</div>
              <div className="event-reg-brand-decoration"></div>
            </div>

            <div className="event-reg-coupon-content">
              <div className="event-reg-coupon-info-box">
                <div className="event-reg-coupon-name">{eventDetail.couponName}</div>
                <div className="event-reg-coupon-status">{eventDetail.couponIssuanceStatus}</div>
                <div className="event-reg-coupon-period">{eventDetail.couponLimit}일</div>
              </div>
            </div>

            <div className="event-reg-coupon-badge">
              <div className="event-reg-badge-circle">
                <div className="event-reg-badge-text">TESSERIS KOREA INC.</div>
                <div className="event-reg-badge-dots">••••••••••••</div>
                <div className="event-reg-badge-amount">{eventDetail.couponPrice.toLocaleString()}</div>
                <div className="event-reg-badge-dots">••••••••••••</div>
              </div>
            </div>

            <div className="event-reg-coupon-decoration">
              <div className="event-reg-decoration-lines"></div>
              <div className="event-reg-decoration-elements">
                <div className="event-reg-decoration-leaf"></div>
              </div>
            </div>

            <div className="event-reg-selection-overlay">
              <div className="event-reg-selection-check">
                <Check className="w-8 h-8" />
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
} 