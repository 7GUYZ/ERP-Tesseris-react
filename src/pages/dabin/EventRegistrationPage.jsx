import { useState, useEffect } from "react"
import { ArrowLeft, Check, X } from "lucide-react"
import { getAvailableCoupons, registerEvent } from "../../api/auth/DabinAuth"
import Toast from "../../components/ui/jungeun/Toast"
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import "../../styles/dabin/EventRegistrationPage.css"

export default function EventRegistrationPage() {
  const [formData, setFormData] = useState({
    couponType: "전체",
    eventName: "",
    targetCondition: "",
    downloadCode: "",
  })

  const [availableCoupons, setAvailableCoupons] = useState([])
  const [selectedCoupons, setSelectedCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCouponDetail, setShowCouponDetail] = useState(false)
  const [selectedCouponDetail, setSelectedCouponDetail] = useState(null)
  const [couponDetailLoading, setCouponDetailLoading] = useState(false)

  // Toast states
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('info')
  const [showToast, setShowToast] = useState(false)

  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const closeToast = () => {
    setShowToast(false)
  }

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
      const response = await getAvailableCoupons(minPrice)
      
      if (response.data.resultCode === 200) {
        console.log('API 응답 성공:', response.data.data)
        // 쿠폰 타입에 따른 스타일 매핑
        const couponsWithStyle = response.data.data.map((coupon, index) => {
          // couponLimitTime 값 로깅
          console.log(`쿠폰 ${coupon.couponName} - couponLimitTime:`, coupon.couponLimitTime);
          
          return {
            id: coupon.couponIndex,
            name: coupon.couponName,
            amount: coupon.couponPrice,
            status: coupon.couponIssuanceStatus,
            period: coupon.couponLimitTime 
              ? new Date(coupon.couponLimitTime).toLocaleDateString() 
              : (coupon.couponLimit ? `${coupon.couponLimit}일` : ''), // 만료일이 없으면 일수로 표시
            type: getCouponType(coupon.couponPrice),
            couponIndex: coupon.couponIndex
          };
        })
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

  // 쿠폰 가격에 따른 타입 결정 (지폐 색상 적용)
  const getCouponType = (price) => {
    if (price >= 50000) return "price-50000"      // ₩50,000 - 신사임당 - 노란색
    if (price >= 10000) return "price-10000"      // ₩10,000 - 세종대왕 - 초록색
    if (price >= 5000) return "price-5000"        // ₩5,000 - 율곡 이이 - 주황색
    if (price >= 1000) return "price-1000"        // ₩1,000 - 퇴계 이황 - 파란색
    return "main"                                  // 기본값
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

  const handleCouponDetail = async (couponIndex) => {
    setShowCouponDetail(true)
    setCouponDetailLoading(true)
    setSelectedCouponDetail(null)
    
    try {
      const accessToken = localStorage.getItem("access-token")
      
      const response = await fetch(`/api/coupon-detail/${couponIndex}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? (accessToken.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`) : ''
        }
      })

      const data = await response.json()

      if (data.success) {
        setSelectedCouponDetail(data.coupon)
      } else {
        console.error('쿠폰 상세 정보 조회 실패:', data.message)
      }
    } catch (error) {
      console.error('쿠폰 상세 정보 조회 오류:', error)
    } finally {
      setCouponDetailLoading(false)
    }
  }

  const closeCouponDetail = () => {
    setShowCouponDetail(false)
    setSelectedCouponDetail(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "미설정"
    try {
      // LocalDateTime 형식 처리 (예: "2025-01-27T01:06:26.122")
      let date
      if (typeof dateString === 'string') {
        // ISO 형식이 아닌 경우 처리
        if (dateString.includes('T')) {
          date = new Date(dateString)
        } else {
          // 숫자나 다른 형식인 경우
          date = new Date(dateString)
        }
      } else {
        date = new Date(dateString)
      }
      
      if (isNaN(date.getTime())) {
        console.log('Invalid date:', dateString)
        return "미설정"
      }
      
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      console.error('Date formatting error:', error, dateString)
      return "미설정"
    }
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('ko-KR').format(number)
  }

  const maskUserName = (name) => {
    if (!name) return ''
    return name.replace(/.(?=.$)/g, '*')
  }

  const handleRegister = async () => {
    try {
      // 유효성 검사
      if (!formData.eventName || formData.eventName.trim() === '') {
        showToastMessage("이벤트 이름을 입력해주세요.", "error");
        return;
      }
      
      if (!formData.targetCondition || formData.targetCondition.trim() === '') {
        showToastMessage("적용할 조건을 입력해주세요.", "error");
        return;
      }
      
      if (!formData.downloadCode || formData.downloadCode.trim() === '') {
        showToastMessage("1인당 다운로드 제한을 입력해주세요.", "error");
        return;
      }
      
      const downloadCount = parseInt(formData.downloadCode);
      if (isNaN(downloadCount) || downloadCount < 1) {
        showToastMessage("1인당 다운로드 제한은 1 이상이어야 합니다.", "error");
        return;
      }
      
      if (selectedCoupons.length === 0) {
        showToastMessage("쿠폰을 선택해주세요.", "error");
        return;
      }
      
      // 1인당 다운로드 제한이 선택한 쿠폰 개수보다 많은지 체크
      if (downloadCount > selectedCoupons.length) {
        showToastMessage(`다운로드 제한이 쿠폰 수를 초과합니다.`, "error");
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

      const response = await registerEvent(requestData)
      
      if (response.data.resultCode === 200) {
        showToastMessage("이벤트가 등록되었습니다!", "success")
        
        // 폼 초기화 (쿠폰 종류도 전체로 초기화)
        setFormData({
          couponType: "전체", // 필터링 초기화
          eventName: "",
          targetCondition: "적용할 조건",
          downloadCode: "",
        })
        setSelectedCoupons([])
        // 쿠폰 목록 새로고침 (전체로 초기화)
        fetchAvailableCoupons("전체")
      } else {
        // 서버에서 반환된 오류 메시지 확인
        let errorMessage = "이벤트 등록에 실패했습니다."
        
        if (response.data.resultMessage) {
          // 중복 이름 오류인지 확인
          if (response.data.resultMessage.includes("Duplicate entry") || 
              response.data.resultMessage.includes("중복") ||
              response.data.resultMessage.includes("이미 존재")) {
            errorMessage = "이미 존재하는 이벤트 이름입니다."
          } else {
            errorMessage = response.data.resultMessage
          }
        }
        
        showToastMessage(errorMessage, "error")
      }
    } catch (error) {
      console.error('이벤트 등록 오류:', error)
      
      // 네트워크 오류나 서버 오류 처리
      let errorMessage = "이벤트 등록 중 오류가 발생했습니다."
      
      if (error.response) {
        // 서버에서 응답이 온 경우
        const responseData = error.response.data
        if (responseData && responseData.resultMessage) {
          if (responseData.resultMessage.includes("Duplicate entry") || 
              responseData.resultMessage.includes("중복") ||
              responseData.resultMessage.includes("이미 존재")) {
            errorMessage = "이미 존재하는 이벤트 이름입니다."
          } else {
            errorMessage = responseData.resultMessage
          }
        }
      } else if (error.request) {
        // 네트워크 오류
        errorMessage = "네트워크 연결을 확인해주세요."
      }
      
      showToastMessage(errorMessage, "error")
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
          <FormControl fullWidth className="event-reg-form-select">
            <Select
              value={formData.couponType}
              onChange={(e) => handleInputChange("couponType", e.target.value)}
              displayEmpty
              sx={{
                '& .MuiSelect-select': {
                  textAlign: 'left',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  '&:hover': {
                    borderColor: '#170f58',
                  },
                  '&.Mui-focused': {
                    borderColor: '#170f58',
                    boxShadow: '0 0 0 4px rgba(23, 15, 88, 0.1)',
                  },
                },
              }}
            >
              <MenuItem value="전체" sx={{ textAlign: 'center' }}>전체</MenuItem>
              <MenuItem value="1000" sx={{ textAlign: 'center' }}>1,000원</MenuItem>
              <MenuItem value="5000" sx={{ textAlign: 'center' }}>5,000원</MenuItem>
              <MenuItem value="10000" sx={{ textAlign: 'center' }}>10,000원</MenuItem>
              <MenuItem value="50000" sx={{ textAlign: 'center' }}>50,000원</MenuItem>
            </Select>
          </FormControl>
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
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
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
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        <div className="event-reg-form-group">
          <label>1인당 다운로드 제한</label>
          <input
            type="number"
            value={formData.downloadCode}
            onChange={(e) => handleInputChange("downloadCode", e.target.value)}
            className="event-reg-form-input"
            placeholder="사용자 1명당 다운로드 가능한 횟수를 입력하세요"
            inputMode="numeric"
            pattern="[0-9]*"
            min="0"
            max="999"
            autoComplete="off"
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
                <div className="event-reg-brand-logo">Tesseris</div>
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
                  <div className="event-reg-badge-text">TESSERIS KOREA INC.</div>
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
                  handleCouponDetail(coupon.couponIndex)
                }}
              >
                쿠폰 상세보기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 쿠폰 상세보기 모달 */}
      {showCouponDetail && (
        <div className="event-reg-modal-overlay" onClick={closeCouponDetail}>
          <div className="event-reg-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="event-reg-modal-header">
              <h2>쿠폰 상세보기</h2>
              <button className="event-reg-modal-close" onClick={closeCouponDetail}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="event-reg-modal-body">
              {couponDetailLoading ? (
                <div className="event-reg-modal-loading">로딩 중...</div>
              ) : selectedCouponDetail ? (
                <div className="event-reg-coupon-detail">
                  <div className="event-reg-detail-field">
                    <label>쿠폰 이름</label>
                    <input 
                      type="text" 
                      value={selectedCouponDetail.couponName || ''} 
                      readOnly 
                    />
                  </div>

                  <div className="event-reg-detail-field">
                    <label>쿠폰 가격</label>
                    <input 
                      type="text" 
                      value={formatNumber(selectedCouponDetail.couponPrice || 0)} 
                      readOnly 
                    />
                  </div>

                  <div className="event-reg-detail-field">
                    <label>쿠폰 기한</label>
                    <input 
                      type="text" 
                      value={selectedCouponDetail.couponLimit || ''} 
                      readOnly 
                    />
                  </div>

                  <div className="event-reg-detail-field">
                    <label>쿠폰 발행일</label>
                    <input 
                      type="text" 
                      value={formatDate(selectedCouponDetail.couponIssuanceTime)} 
                      readOnly 
                    />
                  </div>

                  <div className="event-reg-detail-field">
                    <label>쿠폰 상태</label>
                    <input 
                      type="text" 
                      value={selectedCouponDetail.couponIssuanceStatus || ''} 
                      readOnly 
                    />
                  </div>

                  {selectedCouponDetail.providedUserIndex && (
                    <>
                      <div className="event-reg-detail-field">
                        <label>지급 받은 회원 이름</label>
                        <input 
                          type="text" 
                          value={maskUserName(selectedCouponDetail.userName || '')} 
                          readOnly 
                        />
                      </div>

                      <div className="event-reg-detail-field">
                        <label>지급 쿠폰 상태</label>
                        <input 
                          type="text" 
                          value={selectedCouponDetail.couponProvidedStatus || ''} 
                          readOnly 
                        />
                      </div>

                      <div className="event-reg-detail-field">
                        <label>쿠폰 지급일</label>
                        <input 
                          type="text" 
                          value={formatDate(selectedCouponDetail.couponProvidedTime)} 
                          readOnly 
                        />
                      </div>

                      <div className="event-reg-detail-field">
                        <label>쿠폰 지급 만기일</label>
                        <input 
                          type="text" 
                          value={formatDate(selectedCouponDetail.couponLimitTime)} 
                          readOnly 
                        />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="event-reg-modal-error">
                  쿠폰 정보를 불러올 수 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Component */}
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={closeToast}
        />
      )}
    </div>
  )
}