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
    downloadCode: "",
  })

  const [availableCoupons, setAvailableCoupons] = useState([])
  const [selectedCoupons, setSelectedCoupons] = useState([])
  const [loading, setLoading] = useState(true)


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
          // 전체 쿠폰 객체 로깅
          console.log(`쿠폰 ${index} 전체 데이터:`, coupon);
          console.log(`쿠폰 ${coupon.couponName} - couponLimit:`, coupon.couponLimit);
          console.log(`쿠폰 ${coupon.couponName} - couponIssuanceTime:`, coupon.couponIssuanceTime);
          
          return {
            id: coupon.couponIndex,
            name: coupon.couponName,
            amount: coupon.couponPrice,
            status: coupon.couponIssuanceStatus,
            period: coupon.couponLimit ? `${coupon.couponLimit}일` : '', // 사용기간을 일수로 표시
            type: getCouponType(coupon.couponPrice),
            couponIndex: coupon.couponIndex,
            issuanceTime: coupon.couponIssuanceTime, // 발급 시간 추가
            storeName: coupon.storeName // 가맹점 이름 추가
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

  const getCouponStatusClass = (status) => {
    switch (status) {
      case "ISSUED":
        return "status-issued";
      case "EXPIRED":
        return "status-expired";
      case "USED":
        return "status-used";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-unknown";
    }
  };

  const getCouponStatusText = (status) => {
    switch (status) {
      case "ISSUED":
        return "발급";
      case "EXPIRED":
        return "만료";
      case "USED":
        return "사용";
      case "CANCELLED":
        return "취소";
      default:
        return "알 수 없음";
    }
  };

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
      
      // 이벤트 이름 중복 체크 (간단한 클라이언트 사이드 체크)
      if (formData.eventName.trim() === '1') {
        showToastMessage("이미 존재하는 이벤트 이름입니다.", "error");
        return;
      }
      

      
      if (!formData.downloadCode || formData.downloadCode.trim() === '') {
        showToastMessage("1인당 다운로드 제한을 입력해주세요.", "error");
        return;
      }
      
      const downloadCount = parseInt(formData.downloadCode);
      if (isNaN(downloadCount) || downloadCount < 1) {
        showToastMessage("다운로드 제한은 1 이상이어야 합니다.", "error");
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
        <button 
          className={`event-reg-select-all-btn${selectedCoupons.length === availableCoupons.length ? " deselect" : ""}`} 
          onClick={selectAllCoupons}
        >
          {selectedCoupons.length === availableCoupons.length ? "전체 해제" : "전체선택"}
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
            <div className="event-reg-coupon-header">
              <div className="event-reg-coupon-price">
                {coupon.amount?.toLocaleString()}원
              </div>
            </div>
              
            <div className="event-reg-coupon-body">
              <h3 className="event-reg-coupon-name">{coupon.name}</h3>
              <div className="event-reg-coupon-store">
                발급 가맹점: {coupon.storeName || 'Tesseris'}
              </div>
              
              <div className="event-reg-coupon-details">
                <div className="event-reg-coupon-detail-item">
                  <span className="event-reg-detail-label">사용 기간:</span>
                  <span className="event-reg-detail-value">{coupon.period}</span>
                </div>
              </div>
            </div>

            {/* 선택 표시 오버레이 */}
            {selectedCoupons.includes(coupon.id) && (
              <div className="event-reg-selection-overlay">
                <div className="event-reg-selection-check">
                  <Check className="w-12 h-12" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>


      
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