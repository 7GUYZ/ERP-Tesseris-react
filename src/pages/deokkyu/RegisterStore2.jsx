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
    hasManager: 'NO',
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
    
    console.log("📦 === FormData 생성 시작 ===")
    console.log("userInfo:", userInfo)
    console.log("businessInfo:", businessInfo)
    console.log("storeInfo:", storeInfo)
    
    // 신청자 정보
    formData.append('userName', userInfo.name || '')
    formData.append('userPhone', userInfo.phone || '')
    
    // 사업자 등록 정보
    formData.append('storeRegistrationNum', businessInfo.storeRegistrationNum || '')
    formData.append('storeCorporateName', businessInfo.storeCorporateName || '')
    formData.append('storeBossName', businessInfo.storeBossName || '')
    formData.append('storeTypeTaxation', businessInfo.storeTypeTaxation || '')
    
    // 사업자 등록증 사진 - File 객체가 있을 때만 추가
    if (businessInfo.storeBusinessLicensePhoto && businessInfo.storeBusinessLicensePhoto instanceof File) {
      formData.append('storeBusinessLicensePhoto', businessInfo.storeBusinessLicensePhoto)
      console.log("✅ 사업자 등록증 사진 추가:", businessInfo.storeBusinessLicensePhoto.name, businessInfo.storeBusinessLicensePhoto.size + "bytes")
    } else {
      console.log("❌ 사업자 등록증 사진 없음:", businessInfo.storeBusinessLicensePhoto)
    }
    
    // 가맹점 등록 정보
    formData.append('storeName', storeInfo.store_name || '')
    formData.append('storePhone', storeInfo.store_phone || '')
    formData.append('storePostcode', storeInfo.store_postcode || '')
    formData.append('storeAddress', storeInfo.store_address || '')
    formData.append('storeDetailAddress', storeInfo.store_detail_address || '')
    formData.append('storeSite', storeInfo.storeSite || '')
    
    // 간판 사진 - File 객체가 있을 때만 추가
    if (storeInfo.storeSignPhoto && storeInfo.storeSignPhoto instanceof File) {
      formData.append('storeSignPhoto', storeInfo.storeSignPhoto)
      console.log("✅ 간판 사진 추가:", storeInfo.storeSignPhoto.name, storeInfo.storeSignPhoto.size + "bytes")
    } else {
      console.log("❌ 간판 사진 없음:", storeInfo.storeSignPhoto)
    }
    
    // 매장 정면 사진 - File 객체가 있을 때만 추가
    if (storeInfo.storeFrontPhoto && storeInfo.storeFrontPhoto instanceof File) {
      formData.append('storeFrontPhoto', storeInfo.storeFrontPhoto)
      console.log("✅ 매장 정면 사진 추가:", storeInfo.storeFrontPhoto.name, storeInfo.storeFrontPhoto.size + "bytes")
    } else {
      console.log("❌ 매장 정면 사진 없음:", storeInfo.storeFrontPhoto)
    }
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
    
    // FormData 내용 확인 (디버깅)
    console.log("📦 === FormData 생성 완료 ===")
    console.log("FormData 항목 수:", Array.from(formData.entries()).length)
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }
    console.log("📦 === FormData 생성 완료 ===")
    
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

        const user_index = parsed.user_index || ''
        const name = parsed.name || ''
        const phone = parsed.phone || ''
        
        setUserInfo({
          user_index,
          name,
          phone
        })
        
        console.log("🔍 RegisterStore2에서 설정된 userInfo:");
        console.log("   - user_index:", user_index);
        console.log("   - name:", name);
        console.log("   - phone:", phone);
        
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
        localStorage.removeItem('temp-business-license-file')
        localStorage.removeItem('temp-sign-photo-file')
        localStorage.removeItem('temp-front-photo-file')
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
    // 파일 크기 검증 (localStorage 용량 고려하여 5MB로 제한)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert(`파일 크기는 5MB 이하여야 합니다.\n현재 파일: ${(file.size / 1024 / 1024).toFixed(2)}MB\n\n더 작은 크기의 이미지를 선택하거나 이미지를 압축해주세요.`)
      return false
    }
    
    // 권장 크기 안내 (2MB 이상일 때)
    const recommendedSize = 2 * 1024 * 1024 // 2MB
    if (file.size > recommendedSize) {
      console.warn(`⚠️ 권장 크기 초과: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      console.warn('⚠️ 권장 크기는 2MB 이하입니다. 압축하여 저장됩니다.')
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

  // 이미지 압축 함수 (동적 품질 조정)
  const compressImage = useCallback((file, maxWidth = 1200, quality = null) => {
    // 파일 크기에 따른 동적 품질 조정
    if (quality === null) {
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > 3) {
        quality = 0.6; // 3MB 이상: 낮은 품질
      } else if (fileSizeMB > 1) {
        quality = 0.7; // 1-3MB: 중간 품질
      } else {
        quality = 0.8; // 1MB 이하: 높은 품질
      }
      console.log(`📊 동적 품질 조정: ${file.name} (${fileSizeMB.toFixed(2)}MB) → 품질: ${quality}`);
    }
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // 비율 유지하면서 크기 조정
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height);
        
        // 압축된 이미지를 blob으로 변환
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          
          console.log(`📦 이미지 압축 완료: ${file.name}`);
          console.log(`   - 원본: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
          console.log(`   - 압축: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
          console.log(`   - 압축률: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);
          
          resolve(compressedFile);
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
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

  const handleApplyClick = async () => {
    // 필수 항목 검증
    if (!businessInfo.storeRegistrationNum || !businessInfo.storeCorporateName || 
        !businessInfo.storeBossName || !businessInfo.storeTypeTaxation ||
        !storeInfo.store_name || !storeInfo.store_phone || 
        !storeInfo.store_postcode || !storeInfo.store_address ||
        !storeInfo.managerId || storeInfo.managerId.trim() === '') {
      alert('필수 항목을 모두 입력해주세요.')
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
    
    // 파일들을 localStorage에 별도 저장
    console.log("📁 파일들을 localStorage에 저장 시작...");

    
    const filePromises = [];
    
    // 사업자등록증 파일 저장 (압축 적용)
    if (businessInfo.storeBusinessLicensePhoto && businessInfo.storeBusinessLicensePhoto instanceof File) {
      const filePromise = new Promise(async (resolve) => {
        try {
          // 이미지 압축 (동적 품질)
          const compressedFile = await compressImage(businessInfo.storeBusinessLicensePhoto);
          
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const fileData = {
                name: businessInfo.storeBusinessLicensePhoto.name, // 원본 파일명 유지
                type: compressedFile.type,
                size: compressedFile.size,
                originalSize: businessInfo.storeBusinessLicensePhoto.size,
                data: reader.result.split(',')[1] // base64 데이터만 추출
              };
              
              localStorage.setItem('temp-business-license-file', JSON.stringify(fileData));
              console.log("✅ 사업자등록증 파일 localStorage 저장:", businessInfo.storeBusinessLicensePhoto.name);
              console.log(`   - 압축 후 크기: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
              resolve();
            } catch (error) {
              if (error.name === 'QuotaExceededError') {
                console.error("❌ 사업자등록증 파일 저장 실패: localStorage 용량 초과");
                alert('사업자등록증 파일이 너무 큽니다. 더 작은 크기의 이미지를 선택해주세요.');
              } else {
                console.error("❌ 사업자등록증 파일 저장 실패:", error);
              }
              resolve(); // 실패해도 계속 진행
            }
          };
          reader.onerror = () => {
            console.error("❌ 사업자등록증 파일 읽기 실패");
            resolve(); // 실패해도 계속 진행
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error("❌ 사업자등록증 파일 압축 실패:", error);
          resolve(); // 실패해도 계속 진행
        }
      });
      filePromises.push(filePromise);
    }
    
    // 간판 사진 파일 저장 (압축 적용)
    if (storeInfo.storeSignPhoto && storeInfo.storeSignPhoto instanceof File) {
      const filePromise = new Promise(async (resolve) => {
        try {
          // 이미지 압축 (동적 품질)
          const compressedFile = await compressImage(storeInfo.storeSignPhoto);
          
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const fileData = {
                name: storeInfo.storeSignPhoto.name, // 원본 파일명 유지
                type: compressedFile.type,
                size: compressedFile.size,
                originalSize: storeInfo.storeSignPhoto.size,
                data: reader.result.split(',')[1] // base64 데이터만 추출
              };
              
              localStorage.setItem('temp-sign-photo-file', JSON.stringify(fileData));
              console.log("✅ 간판 사진 파일 localStorage 저장:", storeInfo.storeSignPhoto.name);
              console.log(`   - 압축 후 크기: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
              resolve();
            } catch (error) {
              if (error.name === 'QuotaExceededError') {
                console.error("❌ 간판 사진 파일 저장 실패: localStorage 용량 초과");
                alert('간판 사진 파일이 너무 큽니다. 더 작은 크기의 이미지를 선택해주세요.');
              } else {
                console.error("❌ 간판 사진 파일 저장 실패:", error);
              }
              resolve(); // 실패해도 계속 진행
            }
          };
          reader.onerror = () => {
            console.error("❌ 간판 사진 파일 읽기 실패");
            resolve(); // 실패해도 계속 진행
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error("❌ 간판 사진 파일 압축 실패:", error);
          resolve(); // 실패해도 계속 진행
        }
      });
      filePromises.push(filePromise);
    }
    
    // 매장 정면 사진 파일 저장 (압축 적용)
    if (storeInfo.storeFrontPhoto && storeInfo.storeFrontPhoto instanceof File) {
      const filePromise = new Promise(async (resolve) => {
        try {
          // 이미지 압축 (동적 품질)
          const compressedFile = await compressImage(storeInfo.storeFrontPhoto);
          
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const fileData = {
                name: storeInfo.storeFrontPhoto.name, // 원본 파일명 유지
                type: compressedFile.type,
                size: compressedFile.size,
                originalSize: storeInfo.storeFrontPhoto.size,
                data: reader.result.split(',')[1] // base64 데이터만 추출
              };
              
              localStorage.setItem('temp-front-photo-file', JSON.stringify(fileData));
              console.log("✅ 매장 정면 사진 파일 localStorage 저장:", storeInfo.storeFrontPhoto.name);
              console.log(`   - 압축 후 크기: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
              resolve();
            } catch (error) {
              if (error.name === 'QuotaExceededError') {
                console.error("❌ 매장 정면 사진 파일 저장 실패: localStorage 용량 초과");
                alert('매장 정면 사진 파일이 너무 큽니다. 더 작은 크기의 이미지를 선택해주세요.');
              } else {
                console.error("❌ 매장 정면 사진 파일 저장 실패:", error);
              }
              resolve(); // 실패해도 계속 진행
            }
          };
          reader.onerror = () => {
            console.error("❌ 매장 정면 사진 파일 읽기 실패");
            resolve(); // 실패해도 계속 진행
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error("❌ 매장 정면 사진 파일 압축 실패:", error);
          resolve(); // 실패해도 계속 진행
        }
      });
      filePromises.push(filePromise);
    }
    
        // 모든 파일 저장 완료 대기
    if (filePromises.length > 0) {
      console.log("⏳ 파일 저장 대기 중... (파일 개수:", filePromises.length, ")");
      try {
        await Promise.all(filePromises);
        console.log("✅ 모든 파일 localStorage 저장 완료");
        
        // 저장된 파일들의 총 크기 확인
        const totalSize = Object.keys(localStorage)
          .filter(key => key.startsWith('temp-') && key.endsWith('-file'))
          .reduce((total, key) => {
            try {
              const data = localStorage.getItem(key);
              return total + (data ? data.length : 0);
            } catch (e) {
              return total;
            }
          }, 0);
        
        console.log(`📊 localStorage 사용량: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
        
        
      } catch (error) {
        console.error("❌ 파일 저장 중 오류:", error);
        
        if (error.name === 'QuotaExceededError') {
          alert('파일 크기가 너무 큽니다. 더 작은 크기의 이미지를 선택해주세요.\n(권장: 각 파일당 2MB 이하)');
          return; // 다음 단계로 진행하지 않음
        }
        
        // 다른 오류의 경우 계속 진행
        console.warn('⚠️ 일부 파일 저장에 실패했지만 계속 진행합니다.');
      }
    }

    // localStorage에 임시 저장 (다음 페이지로 데이터 전달)
    const tempData = {
      userInfo,
      businessInfo: {
        ...businessInfo,
        storeBusinessLicensePhoto: businessInfo.storeBusinessLicensePhoto ? 'stored-in-localstorage' : null
      },
      storeInfo: {
        ...storeInfo,
        storeSignPhoto: storeInfo.storeSignPhoto ? 'stored-in-localstorage' : null,
        storeFrontPhoto: storeInfo.storeFrontPhoto ? 'stored-in-localstorage' : null
      },
      agreements,
      // FormData 생성 함수를 위한 참조
      createFormData: 'available'
    }
    
    console.log("💾 localStorage에 저장할 tempData:");
    console.log("   - userInfo.user_index:", tempData.userInfo?.user_index);
    console.log("   - userInfo.name:", tempData.userInfo?.name);
    console.log("   - userInfo.phone:", tempData.userInfo?.phone);
    
    localStorage.setItem('register-store-temp', JSON.stringify(tempData))
    
    // FormData도 별도로 생성해서 전역에서 접근 가능하도록 저장
    console.log("🔨 createFormData() 함수 호출 시작");
    const formData = createFormData()
    console.log("✅ createFormData() 함수 호출 완료");
    
    // FormData 내용 상세 확인
    console.log("🔍 생성된 FormData 상세 분석:");
    const entriesArray = Array.from(formData.entries());
    console.log("   - 총 엔트리 수:", entriesArray.length);
    
    let fileCount = 0;
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileCount++;
        console.log(`   - 📁 ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`   - 📝 ${key}: ${typeof value} = ${value}`);
      }
    }
    console.log("   - 파일 개수:", fileCount);
    
    // FormData를 window 객체에 임시 저장 (페이지 이동 간 유지)
    console.log("💾 window.tempFormData에 저장 시작");
    window.tempFormData = formData
    console.log("✅ window.tempFormData에 저장 완료");
    
    // 저장 후 검증
    console.log("🔍 window.tempFormData 저장 검증:");
    if (window.tempFormData) {
      const verifyEntries = Array.from(window.tempFormData.entries());
      console.log("   - 저장된 엔트리 수:", verifyEntries.length);
      console.log("   - 저장된 파일 수:", verifyEntries.filter(([key, value]) => value instanceof File).length);
    } else {
      console.error("❌ window.tempFormData 저장 실패!");
    }
    
    // 다음 페이지로 이동
    navigate('/registerstore3')
  }

  const handleCancelClick = () => { // 이전페이지로 이동
    // 파일 임시 저장 정리
    localStorage.removeItem('temp-business-license-file')
    localStorage.removeItem('temp-sign-photo-file')
    localStorage.removeItem('temp-front-photo-file')
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
            <label className="form-label required">담당자 아이디 (사업자 회원)</label>
            <input
              type="text"
              className="form-input"
              placeholder="담당자 아이디를 입력하세요"
              value={storeInfo.managerId}
              onChange={(e) => {
                const managerId = e.target.value;
                handleStoreInfoChange('managerId', managerId);
                // 담당자 아이디가 있으면 YES, 없으면 NO로 자동 설정 (백엔드 호환성 유지)
                handleStoreInfoChange('hasManager', managerId.trim() ? 'YES' : 'NO');
              }}
            />
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


