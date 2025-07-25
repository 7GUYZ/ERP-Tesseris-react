import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
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

  // 이미지 미리보기 URL 상태 (메모리 누수 방지)
  const [imageUrls, setImageUrls] = useState({
    storeBusinessLicensePhoto: null,
    storeSignPhoto: null,
    storeFrontPhoto: null
  })

  // 로딩 상태
  const [imageLoading, setImageLoading] = useState({
    storeBusinessLicensePhoto: false,
    storeSignPhoto: false,
    storeFrontPhoto: false
  })

  // URL 추적을 위한 ref
  const imageUrlsRef = useRef({
    storeBusinessLicensePhoto: null,
    storeSignPhoto: null,
    storeFrontPhoto: null
  })

  // imageUrls가 변경될 때마다 ref 업데이트
  useEffect(() => {
    imageUrlsRef.current = imageUrls
  }, [imageUrls])

  // FormData 생성 함수
  const createFormData = useCallback(() => {
    const formData = new FormData()
    
    // 신청자 정보
    formData.append('userName', userInfo.name || '')
    formData.append('userPhone', userInfo.phone || '')
    
    // 사업자 등록 정보
    formData.append('storeRegistrationNum', businessInfo.storeRegistrationNum || '')
    formData.append('storeCorporateName', businessInfo.storeCorporateName || '')
    formData.append('storeBossName', businessInfo.storeBossName || '')
    formData.append('storeTypeTaxation', businessInfo.storeTypeTaxation || '')
    formData.append('storeBusinessLicensePhoto', businessInfo.storeBusinessLicensePhoto || '')
    
    // 가맹점 등록 정보
    formData.append('storeName', storeInfo.store_name || '')
    formData.append('storePhone', storeInfo.store_phone || '')
    formData.append('storePostcode', storeInfo.store_postcode || '')
    formData.append('storeAddress', storeInfo.store_address || '')
    formData.append('storeDetailAddress', storeInfo.store_detail_address || '')
    formData.append('storeSite', storeInfo.storeSite || '')
    formData.append('storeSignPhoto', storeInfo.storeSignPhoto || '')
    formData.append('storeFrontPhoto', storeInfo.storeFrontPhoto || '')
    formData.append('hasManager', storeInfo.hasManager || '')
    formData.append('managerId', storeInfo.managerId || '')
    
    // 약관 동의 정보 추가
    const agreementData = localStorage.getItem('register-store-agreements')
    if (agreementData) {
      try {
        const agreements = JSON.parse(agreementData)
        formData.append('agreementRequired1', agreements.agreements.required1 || false)
        formData.append('agreementRequired2', agreements.agreements.required2 || false)
        formData.append('agreementOptional1', agreements.agreements.optional1 || false)
        formData.append('agreementOptional2', agreements.agreements.optional2 || false)
        formData.append('agreementOptional3', agreements.agreements.optional3 || false)
        formData.append('agreementTimestamp', agreements.timestamp || '')
      } catch (error) {
        console.error('약관 동의 데이터 파싱 오류:', error)
      }
    }
    
    return formData
  }, [userInfo, businessInfo, storeInfo])

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
      try {
        const parsed = JSON.parse(savedUserInfo)
        
        // name과 phone 필드로 직접 접근
        const name = parsed.name || ''
        const phone = parsed.phone || ''
        
        setUserInfo({
          name,
          phone
        })
        
      } catch (error) {
        console.error('user-info 파싱 오류:', error)
      }
    } else {
      console.warn('⚠️ user-info가 localStorage에 없습니다.')
    }
  }, [])

  // 비정상 종료 시 localStorage 정리
  useEffect(() => {
    const cleanupLocalStorage = () => {
      console.log('🧹 RegisterStore2: 비정상 종료 감지 - localStorage 정리')
      localStorage.removeItem('register-store-temp')
      localStorage.removeItem('register-store-agreements')
      if (window.tempFormData) {
        delete window.tempFormData
      }
    }

    const handleBeforeUnload = (event) => {
      cleanupLocalStorage()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cleanupLocalStorage()
      }
    }

    const handlePageHide = () => {
      cleanupLocalStorage()
    }

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    // 클린업 함수
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [])

  // 파일 검증 함수
  const validateFile = useCallback((file) => {
    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('파일 크기는 10MB 이하여야 합니다.')
      return false
    }
    
    // 이미지 형식 검증 (iOS Photos 앱 대응)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
    
    // MIME 타입 검증
    const isValidMimeType = allowedTypes.includes(file.type)
    
    // 파일 확장자 검증 (iOS Photos 앱 대응)
    const fileName = file.name.toLowerCase()
    const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    // iOS Photos 앱의 NSItemProvider 타입 허용
    const isIOSPhotos = file.type === 'com.apple.Photos.NSItemProvider'
    
    if (!isValidMimeType && !isValidExtension && !isIOSPhotos) {
      alert('JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다.')
      return false
    }

    return true
  }, [])

  // 파일명 생성 함수
  const generateFileName = useCallback((field, originalName) => {
    const timestamp = new Date().getTime()
    const extension = originalName.split('.').pop()
    
    const prefixMap = {
      storeBusinessLicensePhoto: 'business_license',
      storeSignPhoto: 'store_sign',
      storeFrontPhoto: 'store_front'
    }
    
    return `${prefixMap[field]}_${timestamp}.${extension}`
  }, [])

  // 파일을 로컬에 저장하는 함수 (시뮬레이션)
  const saveFileLocally = useCallback((file, fileName) => {
    // 실제 로컬 저장은 브라우저 제한으로 불가능하므로
    // 여기서는 파일명만 생성하여 반환
    console.log(`파일 저장 시뮬레이션: ${fileName}`)
    return fileName
  }, [])

  // 파일 업로드 처리 - 더 간단한 방식
  const handleFileUpload = useCallback((field, event) => {
    const file = event.target.files[0]
    if (!file) return

    // 파일 검증
    if (!validateFile(file)) {
      event.target.value = '' // input 초기화
      return
    }

    setImageLoading(prev => ({ ...prev, [field]: true }))

    // 파일명 생성 및 로컬 저장 시뮬레이션
    const fileName = generateFileName(field, file.name)
    const savedFileName = saveFileLocally(file, fileName)

    // 즉시 URL 생성하고 설정
    try {
      const newImageUrl = URL.createObjectURL(file)
      
      // 이전 URL이 있다면 비동기로 정리
      const prevUrl = imageUrlsRef.current[field]
      if (prevUrl && typeof prevUrl === 'string') {
        setTimeout(() => {
          try {
            URL.revokeObjectURL(prevUrl)
          } catch (error) {
            console.warn('이전 URL revoke 실패:', error)
          }
        }, 1000) // 1초 후에 정리
      }
      
      // 새 URL 설정
      setImageUrls(prev => ({
        ...prev,
        [field]: newImageUrl
      }))
      
    } catch (error) {
      console.error('URL 생성 실패:', error)
      setImageLoading(prev => ({ ...prev, [field]: false }))
      return
    }

    // 실제 File 객체 저장 (FormData에서 사용)
    if (field === 'storeBusinessLicensePhoto') {
      setBusinessInfo(prev => ({
        ...prev,
        [field]: file // File 객체 저장
      }))
    } else {
      setStoreInfo(prev => ({
        ...prev,
        [field]: file // File 객체 저장
      }))
    }

    // 로딩 완료 - 이미지가 성공적으로 생성되면 바로 완료 처리
    setTimeout(() => {
      setImageLoading(prev => ({ ...prev, [field]: false }))
    }, 300) // 짧게 조정
  }, [validateFile, generateFileName, saveFileLocally])

  // 이미지 제거
  const removeImage = useCallback((field) => {
    // 로딩 상태 초기화
    setImageLoading(prev => ({ ...prev, [field]: false }))
    
    // URL 정리
    const currentUrl = imageUrlsRef.current[field]
    if (currentUrl && typeof currentUrl === 'string') {
      try {
        URL.revokeObjectURL(currentUrl)
      } catch (error) {
        console.warn('URL revoke 실패:', error)
      }
    }
    
    // 상태 업데이트
    setImageUrls(prev => ({
      ...prev,
      [field]: null
    }))

    // 파일 정보 제거
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

    // input 초기화
    const input = document.getElementById(field)
    if (input) {
      input.value = ''
    }
  }, [])

  // 이미지 미리보기 컴포넌트 (메모이제이션)
  const ImagePreview = useMemo(() => {
    return ({ field, onRemove }) => {
      const imageUrl = imageUrls[field]
      const isLoading = imageLoading[field]

      // 로딩 중이거나 이미지가 있을 때만 렌더링
      if (!isLoading && !imageUrl) return null

      return (
        <div className="image-preview">
          {isLoading ? (
            <div className="image-loading">
              <div className="loading-spinner-small"></div>
              <span>업로드 중...</span>
            </div>
          ) : imageUrl ? (
            <>
              <img 
                src={imageUrl} 
                alt="미리보기" 
                className="preview-image"
                onError={(e) => {
                  console.error(`이미지 로드 오류 (${field}):`, imageUrl)
                  // 오류 발생시 해당 필드만 정리
                  removeImage(field)
                }}
              />
              <button type="button" onClick={onRemove} className="image-remove" title="이미지 제거">
                ×
              </button>
            </>
          ) : null}
        </div>
      )
    }
  }, [imageUrls, imageLoading, removeImage])

  // 컴포넌트 언마운트 시 모든 URL 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      const currentUrls = imageUrlsRef.current
      Object.entries(currentUrls).forEach(([field, url]) => {
        if (url && typeof url === 'string') {
          try {
            URL.revokeObjectURL(url)
          } catch (error) {
            console.warn(`URL revoke 실패 (${field}):`, error)
          }
        }
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
    
    // 이전 페이지의 약관 동의 데이터 가져오기
    const agreementData = localStorage.getItem('register-store-agreements')
    let agreements = null
    if (agreementData) {
      try {
        agreements = JSON.parse(agreementData)
      } catch (error) {
        console.error('약관 동의 데이터 파싱 오류:', error)
      }
    }
    
    // localStorage에 임시 저장 (다음 페이지로 데이터 전달)
    const tempData = {
      userInfo,
      businessInfo,
      storeInfo,
      agreements,
      // FormData 생성 함수를 위한 참조
      createFormData: 'available'
    }
    localStorage.setItem('register-store-temp', JSON.stringify(tempData))
    
    // FormData도 별도로 생성해서 전역에서 접근 가능하도록 저장
    const formData = createFormData()
    // FormData를 window 객체에 임시 저장 (페이지 이동 간 유지)
    window.tempFormData = formData
    
    // 다음 페이지로 이동
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
              <span className="info-value" style={{color: '#000000', fontWeight: '600'}}>{userInfo.name || '정보 없음'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">전화번호</span>
              <span className="info-value" style={{color: '#000000', fontWeight: '600'}}>{userInfo.phone || '정보 없음'}</span>
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
                id="storeBusinessLicensePhoto"
                className="file-upload-input"
                accept="image/*"
                onChange={(e) => handleFileUpload('storeBusinessLicensePhoto', e)}
              />
              <label
                htmlFor="storeBusinessLicensePhoto"
                className={`file-upload-button ${businessInfo.storeBusinessLicensePhoto ? 'has-file' : ''}`}
              >
                {businessInfo.storeBusinessLicensePhoto 
                  ? '파일이 선택되었습니다' 
                  : '사업자 등록증 사진을 업로드하세요'}
              </label>
              <div className="image-preview-container">
                <ImagePreview 
                  field="storeBusinessLicensePhoto"
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
                id="storeSignPhoto"
                className="file-upload-input"
                accept="image/*"
                onChange={(e) => handleFileUpload('storeSignPhoto', e)}
              />
              <label
                htmlFor="storeSignPhoto"
                className={`file-upload-button ${storeInfo.storeSignPhoto ? 'has-file' : ''}`}
              >
                {storeInfo.storeSignPhoto 
                  ? '파일이 선택되었습니다' 
                  : '가맹점 간판 사진을 업로드하세요'}
              </label>
              <div className="image-preview-container">
                <ImagePreview 
                  field="storeSignPhoto"
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
                id="storeFrontPhoto"
                className="file-upload-input"
                accept="image/*"
                onChange={(e) => handleFileUpload('storeFrontPhoto', e)}
              />
              <label
                htmlFor="storeFrontPhoto"
                className={`file-upload-button ${storeInfo.storeFrontPhoto ? 'has-file' : ''}`}
              >
                {storeInfo.storeFrontPhoto 
                  ? '파일이 선택되었습니다' 
                  : '가맹점 매장 정면 사진을 업로드하세요'}
              </label>
              <div className="image-preview-container">
                <ImagePreview 
                  field="storeFrontPhoto"
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


