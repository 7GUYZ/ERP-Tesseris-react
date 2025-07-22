import React, { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import CustomButton from "../../components/ui/deokkyu/Deoktton"
import Circle from "../../components/forms/deokkyu/registerstore/Circle"
import { useNavigate } from "react-router-dom"
import "../../styles/deokkyu/Registercommon.css"
import "../../styles/deokkyu/RegisterStore2.css"

export default function RegisterStore2() {
  const navigate = useNavigate()
  
  // 신청자 정보 (localStorage에서 가져옴)
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: ''
  })

  // 사업자 등록 정보
  const [businessInfo, setBusinessInfo] = useState({
    storeRegistrationNum: '',
    storeCorporateName: '',
    storeBossName: '',
    storeTypeTaxation: '',
    storeBusinessLicensePhoto: null
  })

  // 가맹점 등록 정보
  const [storeInfo, setStoreInfo] = useState({
    store_name: '',
    store_phone: '',
    store_postcode: '',
    store_address: '',
    store_detail_address: '',
    storeSite: '',
    storeSignPhoto: null,
    storeFrontPhoto: null,
    hasManager: '',
    managerId: ''
  })

  // 다음 주소 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // localStorage에서 user-info 가져오기
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('user-info')
    if (savedUserInfo) {
      const parsed = JSON.parse(savedUserInfo)
      setUserInfo({
        name: parsed.name || '',
        phone: parsed.phone || ''
      })
    }
  }, [])

  const handleApplyClick = () => {
    // 필수 항목 검증
    if (!businessInfo.storeRegistrationNum || !businessInfo.storeCorporateName || 
        !businessInfo.storeBossName || !businessInfo.storeTypeTaxation ||
        !storeInfo.store_name || !storeInfo.store_phone || 
        !storeInfo.store_postcode || !storeInfo.store_address) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    // 담당자 여부가 YES인데 담당자 아이디가 없는 경우
    if (storeInfo.hasManager === 'YES' && !storeInfo.managerId) {
      alert('담당자 아이디를 입력해주세요.')
      return
    }
    
    // 다음 페이지로 이동 (또는 제출 처리)
    navigate('/registerstore3')
  }

  const handleCancelClick = () => { // 이전페이지로 이동
    navigate('/registerstore1')
  }

  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStoreInfoChange = (field, value) => {
    setStoreInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0]
    if (file) {
      if (field === 'storeBusinessLicensePhoto') {
        setBusinessInfo(prev => ({
          ...prev,
          [field]: file
        }))
      } else {
        setStoreInfo(prev => ({
          ...prev,
          [field]: file
        }))
      }
    }
  }

  const removeImage = (field) => {
    if (field === 'storeBusinessLicensePhoto') {
      setBusinessInfo(prev => ({
        ...prev,
        [field]: null
      }))
    } else {
      setStoreInfo(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  // 이미지 미리보기 컴포넌트
  const ImagePreview = ({ file, onRemove }) => {
    if (!file) return null

    const imageUrl = URL.createObjectURL(file)
    
    return (
      <div className="image-preview">
        <img src={imageUrl} alt="미리보기" className="preview-image" />
        <button type="button" onClick={onRemove} className="image-remove">
          ×
        </button>
      </div>
    )
  }

  // 다음 주소 검색
  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data) {
          setStoreInfo(prev => ({
            ...prev,
            store_postcode: data.zonecode,
            store_address: data.address
          }))
        }
      }).open()
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <ChevronLeft onClick={handleCancelClick} className="back-icon" />
        <h1 className="header-title">가맹점 신청</h1>
        <div className="header-spacer" />
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className="step-circles">
          <Circle filled />
          <Circle filled />
          <Circle />
        </div>
      </div>

      {/* Main Content */}
      <div className="form-content">
        {/* 1. 신청자 정보 섹션 */}
        <div className="form-section">
          <h2 className="section-title">신청자 정보</h2>
          <div className="user-info-display">
            <div className="info-item">
              <span className="info-label">이름</span>
              <span className="info-value">{userInfo.name || '정보 없음'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">전화번호</span>
              <span className="info-value">{userInfo.phone || '정보 없음'}</span>
            </div>
          </div>
        </div>

        {/* 2. 사업자 등록 정보 입력 섹션 */}
        <div className="form-section">
          <h2 className="section-title">사업자 등록 정보</h2>
          
          <div className="form-group">
            <label className="form-label required">사업자등록번호</label>
            <input
              type="text"
              className="form-input"
              placeholder="000-00-00000"
              value={businessInfo.storeRegistrationNum}
              onChange={(e) => handleBusinessInfoChange('storeRegistrationNum', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">상호명</label>
            <input
              type="text"
              className="form-input"
              placeholder="상호명을 입력하세요"
              value={businessInfo.storeCorporateName}
              onChange={(e) => handleBusinessInfoChange('storeCorporateName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">사업자등록증상 대표자명</label>
            <input
              type="text"
              className="form-input"
              placeholder="대표자명을 입력하세요"
              value={businessInfo.storeBossName}
              onChange={(e) => handleBusinessInfoChange('storeBossName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">사업자 유형</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="general"
                  name="storeTypeTaxation"
                  value="일반과세자"
                  className="radio-input"
                  checked={businessInfo.storeTypeTaxation === '일반과세자'}
                  onChange={(e) => handleBusinessInfoChange('storeTypeTaxation', e.target.value)}
                />
                <label htmlFor="general" className="radio-label">일반과세자</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="simple"
                  name="storeTypeTaxation"
                  value="간이과세자"
                  className="radio-input"
                  checked={businessInfo.storeTypeTaxation === '간이과세자'}
                  onChange={(e) => handleBusinessInfoChange('storeTypeTaxation', e.target.value)}
                />
                <label htmlFor="simple" className="radio-label">간이과세자</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">사업자 등록증 사진</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="businessLicense"
                className="file-upload-input"
                accept="image/*"
                onChange={(e) => handleFileUpload('storeBusinessLicensePhoto', e)}
              />
              <label
                htmlFor="businessLicense"
                className={`file-upload-button ${businessInfo.storeBusinessLicensePhoto ? 'has-file' : ''}`}
              >
                {businessInfo.storeBusinessLicensePhoto 
                  ? '파일이 선택되었습니다' 
                  : '사업자 등록증 사진을 업로드하세요'}
              </label>
              <div className="image-preview-container">
                <ImagePreview 
                  file={businessInfo.storeBusinessLicensePhoto} 
                  onRemove={() => removeImage('storeBusinessLicensePhoto')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. 가맹점 등록 정보 입력 섹션 */}
        <div className="form-section">
          <h2 className="section-title">가맹점 등록 정보</h2>
          
          <div className="form-group">
            <label className="form-label required">가게명</label>
            <input
              type="text"
              className="form-input"
              placeholder="가게명을 입력하세요"
              value={storeInfo.store_name}
              onChange={(e) => handleStoreInfoChange('store_name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">가게 전화번호</label>
            <input
              type="tel"
              className="form-input"
              placeholder="000-0000-0000"
              value={storeInfo.store_phone}
              onChange={(e) => handleStoreInfoChange('store_phone', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">가게 주소</label>
            <div className="address-group">
              <div className="address-row">
                <div className="address-input">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="우편번호"
                    value={storeInfo.store_postcode}
                    readOnly
                  />
                </div>
                <button 
                  type="button" 
                  className="address-search-btn"
                  onClick={handleAddressSearch}
                >
                  주소검색
                </button>
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="주소"
                value={storeInfo.store_address}
                readOnly
              />
              <input
                type="text"
                className="form-input"
                placeholder="상세주소를 입력하세요"
                value={storeInfo.store_detail_address}
                onChange={(e) => handleStoreInfoChange('store_detail_address', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">대표 사이트 주소</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com (선택사항)"
              value={storeInfo.storeSite}
              onChange={(e) => handleStoreInfoChange('storeSite', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">가맹점 간판 사진</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="storeSign"
                className="file-upload-input"
                accept="image/*"
                onChange={(e) => handleFileUpload('storeSignPhoto', e)}
              />
              <label
                htmlFor="storeSign"
                className={`file-upload-button ${storeInfo.storeSignPhoto ? 'has-file' : ''}`}
              >
                {storeInfo.storeSignPhoto 
                  ? '파일이 선택되었습니다' 
                  : '가맹점 간판 사진을 업로드하세요'}
              </label>
              <div className="image-preview-container">
                <ImagePreview 
                  file={storeInfo.storeSignPhoto} 
                  onRemove={() => removeImage('storeSignPhoto')}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">가맹점 매장 정면 사진</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="storeFront"
                className="file-upload-input"
                accept="image/*"
                onChange={(e) => handleFileUpload('storeFrontPhoto', e)}
              />
              <label
                htmlFor="storeFront"
                className={`file-upload-button ${storeInfo.storeFrontPhoto ? 'has-file' : ''}`}
              >
                {storeInfo.storeFrontPhoto 
                  ? '파일이 선택되었습니다' 
                  : '가맹점 매장 정면 사진을 업로드하세요'}
              </label>
              <div className="image-preview-container">
                <ImagePreview 
                  file={storeInfo.storeFrontPhoto} 
                  onRemove={() => removeImage('storeFrontPhoto')}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">담당자 여부</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="manager-yes"
                  name="hasManager"
                  value="YES"
                  className="radio-input"
                  checked={storeInfo.hasManager === 'YES'}
                  onChange={(e) => handleStoreInfoChange('hasManager', e.target.value)}
                />
                <label htmlFor="manager-yes" className="radio-label">YES</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="manager-no"
                  name="hasManager"
                  value="NO"
                  className="radio-input"
                  checked={storeInfo.hasManager === 'NO'}
                  onChange={(e) => {
                    handleStoreInfoChange('hasManager', e.target.value)
                    handleStoreInfoChange('managerId', '') // NO 선택시 담당자 ID 초기화
                  }}
                />
                <label htmlFor="manager-no" className="radio-label">NO</label>
              </div>
            </div>

            {storeInfo.hasManager === 'YES' && (
              <div className="conditional-input">
                <label className="form-label required">담당자 아이디 (사업자 회원)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="담당자 아이디를 입력하세요"
                  value={storeInfo.managerId}
                  onChange={(e) => handleStoreInfoChange('managerId', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 확인 버튼 */}
      <div className="bottom-button-container">
        <CustomButton onClick={handleApplyClick}>
          다음 단계
        </CustomButton>
      </div>
    </div>
  )
}


