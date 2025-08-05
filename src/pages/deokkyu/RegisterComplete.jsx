import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import CustomButton from "../../components/ui/deokkyu/Deoktton"
import { confirmPayment, registerStore } from "../../api/auth/DeokkyuAuth"
import "../../styles/deokkyu/Registercommon.css"
import "../../styles/deokkyu/RegisterComplete.css"

export default function RegisterComplete() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDataSaved, setIsDataSaved] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // 페이지 로드 시 데이터 저장 확인
  useEffect(() => {
    // 콘솔 유지 설정
    console.log('🔄 RegisterComplete 페이지 로드됨');
    console.log('📋 이전 페이지의 콘솔 로그를 확인하세요 (위로 스크롤)');
    
    // localStorage가 정리되었는지 확인
    const tempData = localStorage.getItem('register-store-temp')
    const agreementData = localStorage.getItem('register-store-agreements')
    
    console.log('=== RegisterComplete: localStorage 상태 확인 ===');
    console.log('register-store-temp 존재:', !!tempData);
    console.log('register-store-agreements 존재:', !!agreementData);
    
    if (!tempData && !agreementData) {
      setIsDataSaved(true)
      console.log('✅ 가맹점 신청 데이터가 성공적으로 저장되고 임시 데이터가 정리되었습니다.')
    } else {
      console.warn('⚠️ 임시 데이터가 아직 정리되지 않았습니다.')
      // API 호출 후에 정리하므로 여기서는 정리하지 않음
      setIsDataSaved(true)
    }

    // URL 파라미터 확인 및 가맹점 정보 저장 처리
    const urlParams = new URLSearchParams(location.search)
    const success = urlParams.get('success')
    
    console.log('URL 파라미터:', { success });
    
    if (success === 'true') {
      console.log('🎉 결제 승인 완료로 페이지에 도달했습니다. 가맹점 정보 저장을 시작합니다.')
      setIsProcessing(true)
      
      // 가맹점 정보 저장 처리
      const processStoreRegistration = async () => {
        try {
          // localStorage에서 기존 데이터 복원
          const tempData = localStorage.getItem('register-store-temp');
          
          if (!tempData) {
            console.error("❌ localStorage에서 가맹점 정보를 찾을 수 없습니다!");
            throw new Error('가맹점 정보가 없습니다.')
          }
          
          const storeData = JSON.parse(tempData);
          
          console.log("🎉 === 가맹점 정보 저장 시작 ===");
          console.log("복원된 데이터:", storeData);
          
          // FormData 생성
          const formData = new FormData();
          
          // 서버에서 요구하는 storeData JSON 문자열 생성
          const serverStoreData = {
            userIndex: storeData.userInfo?.user_index || null,  // ✅ 최상위 레벨에 userIndex 추가
            userInfo: storeData.userInfo || {},
            businessInfo: storeData.businessInfo || {},
            storeInfo: storeData.storeInfo || {},
            agreements: {}
          };
          
          console.log("🔍 서버로 보낼 user_index:", serverStoreData.userIndex);
          console.log("🔍 userInfo 내부 user_index:", storeData.userInfo?.user_index);
          
          // 약관 동의 정보 추가
          const agreementData = localStorage.getItem('register-store-agreements');
          if (agreementData) {
            try {
              const agreements = JSON.parse(agreementData);
              serverStoreData.agreements = agreements.agreements || {};
              serverStoreData.agreementTimestamp = agreements.timestamp || '';
            } catch (error) {
              console.error('약관 동의 데이터 파싱 오류:', error);
            }
          }
          
          // storeData를 JSON 문자열로 FormData에 추가
          formData.append('storeData', JSON.stringify(serverStoreData));
          
          // localStorage에서 저장된 파일 정보 복원
          console.log("📁 파일 정보 복원 시작...");
          
          // base64로 저장된 파일들 복원
          const businessLicenseData = localStorage.getItem('temp-business-license-file');
          const signPhotoData = localStorage.getItem('temp-sign-photo-file');
          const frontPhotoData = localStorage.getItem('temp-front-photo-file');
          
          console.log("📁 localStorage 파일 확인:");
          console.log("   - business-license-file:", !!businessLicenseData);
          console.log("   - sign-photo-file:", !!signPhotoData);
          console.log("   - front-photo-file:", !!frontPhotoData);
          
          // 사업자등록증 파일 복원
          if (businessLicenseData) {
            try {
              const fileInfo = JSON.parse(businessLicenseData);
              const byteCharacters = atob(fileInfo.data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: fileInfo.type });
              const file = new File([blob], fileInfo.name, { type: fileInfo.type });
              
              formData.append('storeBusinessLicensePhoto', file);
              
              const sizeInfo = fileInfo.originalSize 
                ? `압축전: ${(fileInfo.originalSize / 1024 / 1024).toFixed(2)}MB → 압축후: ${(fileInfo.size / 1024 / 1024).toFixed(2)}MB`
                : `${(fileInfo.size / 1024 / 1024).toFixed(2)}MB`;
              console.log(`✅ 사업자등록증 파일 복원됨: ${fileInfo.name} (${sizeInfo}, ${fileInfo.type})`);
            } catch (error) {
              console.error('❌ 사업자등록증 파일 복원 실패:', error);
            }
          }
          
          // 간판 사진 파일 복원
          if (signPhotoData) {
            try {
              const fileInfo = JSON.parse(signPhotoData);
              const byteCharacters = atob(fileInfo.data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: fileInfo.type });
              const file = new File([blob], fileInfo.name, { type: fileInfo.type });
              
              formData.append('storeSignPhoto', file);
              
              const sizeInfo = fileInfo.originalSize 
                ? `압축전: ${(fileInfo.originalSize / 1024 / 1024).toFixed(2)}MB → 압축후: ${(fileInfo.size / 1024 / 1024).toFixed(2)}MB`
                : `${(fileInfo.size / 1024 / 1024).toFixed(2)}MB`;
              console.log(`✅ 간판 사진 파일 복원됨: ${fileInfo.name} (${sizeInfo}, ${fileInfo.type})`);
            } catch (error) {
              console.error('❌ 간판 사진 파일 복원 실패:', error);
            }
          }
          
          // 매장 정면 사진 파일 복원
          if (frontPhotoData) {
            try {
              const fileInfo = JSON.parse(frontPhotoData);
              const byteCharacters = atob(fileInfo.data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: fileInfo.type });
              const file = new File([blob], fileInfo.name, { type: fileInfo.type });
              
              formData.append('storeFrontPhoto', file);
              
              const sizeInfo = fileInfo.originalSize 
                ? `압축전: ${(fileInfo.originalSize / 1024 / 1024).toFixed(2)}MB → 압축후: ${(fileInfo.size / 1024 / 1024).toFixed(2)}MB`
                : `${(fileInfo.size / 1024 / 1024).toFixed(2)}MB`;
              console.log(`✅ 매장 정면 사진 파일 복원됨: ${fileInfo.name} (${sizeInfo}, ${fileInfo.type})`);
            } catch (error) {
              console.error('❌ 매장 정면 사진 파일 복원 실패:', error);
            }
          }
          
          console.log("=== 생성된 FormData 확인 ===");
          console.log("FormData 내용:");
          let fileCount = 0;
          let totalFileSize = 0;
          for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
              fileCount++;
              totalFileSize += value.size;
              console.log(`📁 ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
            } else {
              console.log(`📝 ${key}: ${typeof value} = ${value.substring ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : value}`);
            }
          }
          console.log("📊 FormData 요약:");
          console.log(`   - 총 엔트리 수: ${Array.from(formData.entries()).length}`);
          console.log(`   - 파일 개수: ${fileCount}`);
          console.log(`   - 총 파일 크기: ${totalFileSize} bytes (${(totalFileSize / 1024 / 1024).toFixed(2)} MB)`);
          
          // 브라우저 Network 탭 확인 가이드
          console.log("🌐 브라우저 Network 탭에서 다음을 확인하세요:");
          console.log("   1. /store/register POST 요청");
          console.log("   2. Request Headers: Content-Type: multipart/form-data");
          console.log("   3. Request Payload에서 파일들이 포함되어 있는지");
          console.log("   4. Response에서 서버 로그 확인");
          
          // 가맹점 정보 서버에 저장
          console.log("📋 가맹점 정보 서버 저장 시작...");
          
          console.log("🚀 registerStore API 호출 시작...");
          console.log("API 엔드포인트: /store/register");
          console.log("Content-Type: multipart/form-data");
          
          const response = await registerStore(formData);
          console.log("✅ registerStore API 호출 성공!");
          console.log("응답 상태:", response.status);
          console.log("응답 데이터:", response.data);
          
          // 성공 처리 및 데이터 정리
          console.log("🎊 성공 처리 및 데이터 정리...");
          
          // localStorage 정리
          console.log("🧹 localStorage 정리 중...");
          localStorage.removeItem('register-store-temp')
          localStorage.removeItem('register-store-agreements')
          localStorage.removeItem('temp-formdata-entries')
          localStorage.removeItem('temp-payment-info')
          localStorage.removeItem('temp-business-license-file')
          localStorage.removeItem('temp-sign-photo-file')
          localStorage.removeItem('temp-front-photo-file')
          localStorage.removeItem('@tosspayments/client-id')
          localStorage.removeItem('@tosspayments/merchant-browser-id')
          
          console.log("✅ 가맹점 신청 완료! 모든 처리가 성공적으로 완료되었습니다.");
          setIsDataSaved(true)
          
        } catch (error) {
          console.error('❌ 가맹점 정보 저장 오류:', error);
          console.error('에러 타입:', error.constructor.name);
          console.error('에러 메시지:', error.message);
          console.error('에러 응답:', error.response);
          
          // 서버 응답 상세 정보 출력
          if (error.response) {
            console.error('서버 응답 상태:', error.response.status);
            console.error('서버 응답 데이터:', error.response.data);
            console.error('서버 응답 헤더:', error.response.headers);
          }
          
          alert('가맹점 정보 저장 중 오류가 발생했습니다.')
        } finally {
          setIsProcessing(false)
        }
      }
      
      processStoreRegistration()
      
      // URL에서 파라미터 제거
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      console.log('🔗 URL 정리됨:', newUrl);
    }
    
    // 콘솔 유지를 위한 메시지
    console.log('💡 API 호출 로그를 확인하려면 위로 스크롤하세요!');
    console.log('💡 브라우저 개발자 도구에서 "Preserve log" 옵션을 활성화하면 페이지 이동 시에도 로그가 유지됩니다.');
  }, [location.search])

  const handleGoToMain = () => {
    navigate('/main')
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-spacer" />
        <h1 className="header-title">가맹점 신청</h1>
        <div className="header-spacer" />
      </div>

      {/* Main Content */}
      <div className="complete-content">
        {/* 성공 아이콘 */}
        <div className="success-icon-container">
          <div className="success-icon">✓</div>
        </div>

        {/* 완료 메시지 */}
        <div className="complete-message">
          <h2 className="complete-title">가맹점 신청이<br />완료되었습니다!</h2>
          <p className="complete-description">
            결제가 성공적으로 처리되었으며,<br />
            가맹점 심사가 시작됩니다.
          </p>
          {isDataSaved && (
            <p className="save-confirmation">
              ✅ 신청 정보가 안전하게 저장되었습니다.
            </p>
          )}
        </div>

        {/* 안내 정보 */}
        <div className="info-section">
          <h3 className="info-title">앞으로의 진행 과정</h3>
          <div className="info-list">
            <div className="info-item">
              <div className="info-step">1</div>
              <div className="info-content">
                <span className="info-label">서류 검토</span>
                <span className="info-desc">제출하신 서류를 검토합니다</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-step">2</div>
              <div className="info-content">
                <span className="info-label">현장 확인</span>
                <span className="info-desc">가맹점 현장을 확인합니다</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-step">3</div>
              <div className="info-content">
                <span className="info-label">최종 승인</span>
                <span className="info-desc">심사 완료 후 연락드립니다</span>
              </div>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="notice-section">
          <h3 className="notice-title">참고사항</h3>
          <div className="notice-list">
            <div className="notice-item">
              <span className="notice-number">•</span>
              <span>심사 결과는 3-5일 내에 연락드립니다.</span>
            </div>
            <div className="notice-item">
              <span className="notice-number">•</span>
              <span>추가 서류가 필요한 경우 별도 연락드립니다.</span>
            </div>
            <div className="notice-item">
              <span className="notice-number">•</span>
              <span>문의사항이 있으시면 고객센터로 연락주세요.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="bottom-button-container">
        <CustomButton onClick={handleGoToMain}>
          홈으로 가기
        </CustomButton>
      </div>
    </div>
  )
} 